import test from 'node:test';
import assert from 'node:assert/strict';
import { CanvasRenderer } from '../../js/render/CanvasRenderer.js';
import {
  ENTITY_SPRITES,
  SPRITE_SHEETS,
  getSpriteDefinition,
  getSpriteIds,
  normalizeSpriteId
} from '../../js/render/SpriteCatalog.js';
import { SpriteAssetLoader } from '../../js/render/SpriteAssetLoader.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

class SuccessfulImage {
  set src(value) {
    this.currentSrc = value;
    this.naturalWidth = SPRITE_SHEETS.entities.width;
    this.naturalHeight = SPRITE_SHEETS.entities.height;
    queueMicrotask(() => this.onload());
  }
}

class FailedImage {
  set src(value) {
    this.currentSrc = value;
    queueMicrotask(() => this.onerror());
  }
}

function createContext({ drawImageError = null } = {}) {
  const calls = [];
  return {
    calls,
    globalAlpha: 1,
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low',
    save: () => calls.push(['save']),
    restore: () => calls.push(['restore']),
    beginPath: () => calls.push(['beginPath']),
    closePath: () => calls.push(['closePath']),
    moveTo: (...args) => calls.push(['moveTo', ...args]),
    lineTo: (...args) => calls.push(['lineTo', ...args]),
    rect: (...args) => calls.push(['rect', ...args]),
    arc: (...args) => calls.push(['arc', ...args]),
    fill: () => calls.push(['fill']),
    stroke: () => calls.push(['stroke']),
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    drawImage: (...args) => {
      calls.push(['drawImage', ...args]);
      if (drawImageError) {
        throw drawImageError;
      }
    }
  };
}

function createRenderer(context, spriteAssets) {
  const canvas = { getContext: () => context };
  const camera = { resize() {} };
  return new CanvasRenderer(canvas, camera, balance, spriteAssets);
}

test('catalog covers every active tower, enemy, and boss exactly once', () => {
  const activeIds = [
    ...Object.keys(balance.towers),
    ...Object.keys(balance.enemies),
    ...Object.keys(balance.bosses)
  ];
  assert.deepEqual(getSpriteIds(), activeIds);
  assert.deepEqual(Object.keys(ENTITY_SPRITES), activeIds);

  for (const id of activeIds) {
    const sprite = getSpriteDefinition(id);
    const sheet = SPRITE_SHEETS[sprite.sheet];
    assert.ok(sprite.source.x >= 0);
    assert.ok(sprite.source.y >= 0);
    assert.ok(sprite.source.x + sprite.source.width <= sheet.width);
    assert.ok(sprite.source.y + sprite.source.height <= sheet.height);
    assert.ok(sprite.display.width > 0);
    assert.ok(sprite.display.height > 0);
    assert.ok(sprite.anchor.x >= 0 && sprite.anchor.x <= 1);
    assert.ok(sprite.anchor.y >= 0 && sprite.anchor.y <= 1);
  }
});

test('catalog normalizes human and file-style entity IDs', () => {
  assert.equal(normalizeSpriteId('Script Kiddie'), 'scriptKiddie');
  assert.equal(normalizeSpriteId('mega-corp_titan'), 'megaCorpTitan');
  assert.equal(normalizeSpriteId('AI Surveillance'), 'aiSurveillance');
  assert.equal(normalizeSpriteId('unknown'), null);
  assert.equal(getSpriteDefinition(null), null);
});

test('asset loader makes ready sheets available without loading in draw calls', async () => {
  const loader = new SpriteAssetLoader({ ImageCtor: SuccessfulImage });
  assert.equal(loader.get('firewall'), null);
  assert.deepEqual(await loader.loadAll(), {
    total: 1,
    ready: 1,
    failed: 0,
    loading: 0
  });
  const sprite = loader.get('Script Kiddie');
  assert.equal(sprite.id, 'scriptKiddie');
  assert.equal(sprite.image.currentSrc, 'assets/sprites/entities.svg');
  assert.equal(loader.getSheetStatus('entities'), 'ready');
});

test('asset loader resolves failures and leaves entities on fallback rendering', async () => {
  const loader = new SpriteAssetLoader({ ImageCtor: FailedImage });
  assert.deepEqual(await loader.loadAll(), {
    total: 1,
    ready: 0,
    failed: 1,
    loading: 0
  });
  assert.equal(loader.get('firewall'), null);
  assert.equal(loader.getSheetStatus('entities'), 'error');
});

test('renderer uses catalog frames when a sprite is ready', () => {
  const context = createContext();
  const sprite = {
    image: { naturalWidth: SPRITE_SHEETS.entities.width },
    definition: ENTITY_SPRITES.firewall
  };
  const renderer = createRenderer(context, { get: () => sprite });
  const session = {
    state: {
      defenses: new Map([
        [
          'tower-1',
          {
            id: 'tower-1',
            type: 'firewall',
            x: 210,
            y: 210,
            radius: 20,
            level: 1,
            disabledUntilMs: 0
          }
        ]
      ]),
      selectedDefenseId: null,
      settings: { showRanges: false },
      gameTimeMs: 0
    }
  };

  renderer.drawDefenses(context, session);
  const drawCall = context.calls.find(([name]) => name === 'drawImage');
  assert.deepEqual(drawCall.slice(2, 6), [0, 0, 256, 256]);
  assert.equal(context.calls.some(([name]) => name === 'rect'), false);
});

test('renderer falls back to shapes for missing and undrawable sprites', () => {
  const missingContext = createContext();
  const missingRenderer = createRenderer(missingContext, { get: () => null });
  const session = {
    state: {
      defenses: new Map([
        [
          'tower-1',
          {
            id: 'tower-1',
            type: 'firewall',
            x: 210,
            y: 210,
            radius: 20,
            level: 1,
            disabledUntilMs: 0
          }
        ]
      ]),
      enemies: new Map([
        [
          'enemy-1',
          {
            id: 'enemy-1',
            type: 'scriptKiddie',
            kind: 'regular',
            x: 120,
            y: 120,
            radius: 7.5,
            health: 60,
            maxHealth: 60,
            shield: 0
          }
        ]
      ]),
      selectedDefenseId: null,
      settings: { showRanges: false },
      gameTimeMs: 0
    }
  };
  missingRenderer.drawDefenses(missingContext, session);
  missingRenderer.drawEnemies(missingContext, session);
  assert.ok(missingContext.calls.some(([name]) => name === 'rect'));
  assert.ok(missingContext.calls.some(([name]) => name === 'arc'));

  const failedContext = createContext({ drawImageError: new Error('decode lost') });
  const failedRenderer = createRenderer(failedContext, {
    get: () => ({
      image: {},
      definition: ENTITY_SPRITES.firewall
    })
  });
  failedRenderer.drawDefenses(failedContext, session);
  assert.ok(failedContext.calls.some(([name]) => name === 'drawImage'));
  assert.ok(failedContext.calls.some(([name]) => name === 'rect'));
});

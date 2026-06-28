const FRAME_SIZE = 256;

const ids = [
  'firewall',
  'encryption',
  'distributor',
  'scriptKiddie',
  'federalAgent',
  'corporateSaboteur',
  'aiSurveillance',
  'quantumHacker',
  'corruptedMonk',
  'raidTeam',
  'megaCorpTitan'
];

const normalizedIds = new Map(
  ids.map((id) => [id.replaceAll(/[^a-z0-9]/gi, '').toLowerCase(), id])
);

export const SPRITE_SHEETS = Object.freeze({
  entities: Object.freeze({
    id: 'entities',
    src: 'assets/sprites/entities.svg',
    width: FRAME_SIZE * ids.length,
    height: FRAME_SIZE
  })
});

function frame(index, display, anchor = { x: 0.5, y: 0.54 }) {
  return Object.freeze({
    sheet: 'entities',
    source: Object.freeze({
      x: index * FRAME_SIZE,
      y: 0,
      width: FRAME_SIZE,
      height: FRAME_SIZE
    }),
    display: Object.freeze(display),
    anchor: Object.freeze(anchor),
    animation: null
  });
}

export const ENTITY_SPRITES = Object.freeze({
  firewall: frame(0, { width: 54, height: 54 }, { x: 0.5, y: 0.56 }),
  encryption: frame(1, { width: 52, height: 52 }, { x: 0.5, y: 0.56 }),
  distributor: frame(2, { width: 56, height: 56 }, { x: 0.5, y: 0.56 }),
  scriptKiddie: frame(3, { width: 24, height: 26 }),
  federalAgent: frame(4, { width: 28, height: 30 }),
  corporateSaboteur: frame(5, { width: 26, height: 28 }),
  aiSurveillance: frame(6, { width: 30, height: 30 }),
  quantumHacker: frame(7, { width: 32, height: 34 }),
  corruptedMonk: frame(8, { width: 36, height: 38 }),
  raidTeam: frame(9, { width: 54, height: 54 }),
  megaCorpTitan: frame(10, { width: 66, height: 66 })
});

export function normalizeSpriteId(id) {
  if (typeof id !== 'string') {
    return null;
  }
  const key = id.replaceAll(/[^a-z0-9]/gi, '').toLowerCase();
  return normalizedIds.get(key) || null;
}

export function getSpriteDefinition(id) {
  const normalized = normalizeSpriteId(id);
  return normalized ? ENTITY_SPRITES[normalized] : null;
}

export function getSpriteIds() {
  return [...ids];
}

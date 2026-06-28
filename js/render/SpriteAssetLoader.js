import {
  SPRITE_SHEETS,
  getSpriteDefinition,
  normalizeSpriteId
} from './SpriteCatalog.js';

export class SpriteAssetLoader {
  constructor({
    sheets = SPRITE_SHEETS,
    ImageCtor = globalThis.Image
  } = {}) {
    this.sheets = sheets;
    this.ImageCtor = ImageCtor;
    this.records = new Map(
      Object.values(sheets).map((sheet) => [
        sheet.id,
        {
          definition: sheet,
          image: null,
          status: 'idle',
          error: null,
          promise: null
        }
      ])
    );
  }

  async loadAll() {
    await Promise.all([...this.records.keys()].map((id) => this.loadSheet(id)));
    return this.summary();
  }

  loadSheet(id) {
    const record = this.records.get(id);
    if (!record) {
      return Promise.resolve(null);
    }
    if (record.promise) {
      return record.promise;
    }
    if (typeof this.ImageCtor !== 'function') {
      record.status = 'error';
      record.error = new Error('Image loading is unavailable.');
      return Promise.resolve(record);
    }

    record.status = 'loading';
    record.promise = new Promise((resolve) => {
      const image = new this.ImageCtor();
      record.image = image;
      image.decoding = 'async';
      image.onload = () => {
        const dimensionsMatch =
          image.naturalWidth >= record.definition.width &&
          image.naturalHeight >= record.definition.height;
        if (dimensionsMatch) {
          record.status = 'ready';
          record.error = null;
        } else {
          record.status = 'error';
          record.error = new Error(
            `Sprite sheet "${id}" is smaller than its catalog dimensions.`
          );
        }
        resolve(record);
      };
      image.onerror = () => {
        record.status = 'error';
        record.error = new Error(`Sprite sheet "${id}" failed to load.`);
        resolve(record);
      };
      image.src = record.definition.src;
    });
    return record.promise;
  }

  get(id) {
    const normalizedId = normalizeSpriteId(id);
    const definition = getSpriteDefinition(normalizedId);
    if (!definition) {
      return null;
    }
    const record = this.records.get(definition.sheet);
    if (!record || record.status !== 'ready' || !record.image) {
      return null;
    }
    return {
      id: normalizedId,
      image: record.image,
      definition
    };
  }

  getSheetStatus(id) {
    return this.records.get(id)?.status || 'missing';
  }

  summary() {
    const records = [...this.records.values()];
    return Object.freeze({
      total: records.length,
      ready: records.filter((record) => record.status === 'ready').length,
      failed: records.filter((record) => record.status === 'error').length,
      loading: records.filter((record) => record.status === 'loading').length
    });
  }
}

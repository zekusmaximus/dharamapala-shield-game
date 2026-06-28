export const WORLD = Object.freeze({ width: 960, height: 540, gridSize: 60 });

export const ENEMY_PATH = Object.freeze([
  Object.freeze({ x: -20, y: 270 }),
  Object.freeze({ x: 140, y: 270 }),
  Object.freeze({ x: 140, y: 110 }),
  Object.freeze({ x: 360, y: 110 }),
  Object.freeze({ x: 360, y: 400 }),
  Object.freeze({ x: 620, y: 400 }),
  Object.freeze({ x: 620, y: 190 }),
  Object.freeze({ x: 820, y: 190 }),
  Object.freeze({ x: 980, y: 190 })
]);

export function getPathMetrics(path = ENEMY_PATH) {
  const segments = [];
  let totalLength = 0;
  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    segments.push({ from, to, length, startsAt: totalLength });
    totalLength += length;
  }
  return { segments, totalLength };
}

export const PATH_METRICS = getPathMetrics();

export function pointAtPathDistance(distance, metrics = PATH_METRICS) {
  const clamped = Math.max(0, Math.min(distance, metrics.totalLength));
  const segment =
    metrics.segments.find(
      (candidate) => clamped <= candidate.startsAt + candidate.length
    ) || metrics.segments.at(-1);
  const progress =
    segment.length === 0 ? 1 : (clamped - segment.startsAt) / segment.length;
  return {
    x: segment.from.x + (segment.to.x - segment.from.x) * progress,
    y: segment.from.y + (segment.to.y - segment.from.y) * progress
  };
}

function distanceToSegment(point, from, to) {
  const lengthSquared = (to.x - from.x) ** 2 + (to.y - from.y) ** 2;
  if (lengthSquared === 0) {
    return Math.hypot(point.x - from.x, point.y - from.y);
  }
  const projection = Math.max(
    0,
    Math.min(
      1,
      ((point.x - from.x) * (to.x - from.x) +
        (point.y - from.y) * (to.y - from.y)) /
        lengthSquared
    )
  );
  const x = from.x + projection * (to.x - from.x);
  const y = from.y + projection * (to.y - from.y);
  return Math.hypot(point.x - x, point.y - y);
}

export function isNearPath(point, padding = 38) {
  return PATH_METRICS.segments.some(
    (segment) => distanceToSegment(point, segment.from, segment.to) < padding
  );
}

export function snapToBuildGrid(point) {
  const half = WORLD.gridSize / 2;
  return {
    x: Math.floor(point.x / WORLD.gridSize) * WORLD.gridSize + half,
    y: Math.floor(point.y / WORLD.gridSize) * WORLD.gridSize + half
  };
}

export function isInsideWorld(point, padding = 24) {
  return (
    point.x >= padding &&
    point.y >= padding &&
    point.x <= WORLD.width - padding &&
    point.y <= WORLD.height - padding
  );
}

export const TUTORIAL_BUILD_POSITION = Object.freeze({ x: 210, y: 210 });

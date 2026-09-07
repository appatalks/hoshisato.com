import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, starPosition } from '../src/data/campaign.js';
import { lowerRoute } from '../src/data/exploration.js';
import { freshSave, normalizeSave } from '../src/systems/save.js';

test('all ten worlds have bounded lower routes, alternate obstacles, and real rewards', () => {
  const names = new Set();
  const obstacles = new Set();
  for (const level of LEVELS) {
    const route = lowerRoute(level);
    names.add(route.name);
    obstacles.add(route.obstacle);
    assert.ok(route.left > 0 && route.right < level.width);
    assert.ok(route.entry > route.gapLeft && route.entry < route.gapLeft + route.gapWidth);
    assert.ok(route.bottom > 1200 && route.bottom <= 1500);
    assert.ok(route.cache.x > route.checkpoint.x && route.lift.x > route.cache.x);
    assert.ok(
      level.floors.some(([left, width]) => route.exit.x >= left && route.exit.x < left + width),
    );
    for (const index of [3, 4]) {
      const [left, top] = starPosition(level, index);
      assert.ok(left > route.left && left < route.right && top > 740 && top < route.bottom);
    }
  }
  assert.equal(names.size, 10);
  assert.equal(obstacles.size, 3);
});

test('old saves migrate without losing discoveries and lower checkpoints restore safely', () => {
  const old = freshSave();
  delete old.routes;
  assert.deepEqual(normalizeSave(old).routes, []);
  const save = freshSave();
  save.current = 7;
  save.routes = [0, 7];
  save.checkpoint = { level: 7, ...lowerRoute(LEVELS[7]).checkpoint, relays: [1] };
  assert.deepEqual(normalizeSave(save).checkpoint, save.checkpoint);
  assert.deepEqual(normalizeSave(save).routes, [0, 7]);
});

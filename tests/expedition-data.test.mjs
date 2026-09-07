import test from 'node:test';
import assert from 'node:assert/strict';
import { COLLECTIONS, objectiveReady } from '../src/data/expeditions.js';

for (const [key, collection] of Object.entries(COLLECTIONS)) {
  test(`${key} has ten authored stories with bounded objectives and unique identities`, () => {
    assert.equal(collection.missions.length, 10);
    assert.equal(new Set(collection.missions.map((mission) => mission.biome)).size, 10);
    collection.missions.forEach((mission, index) => {
      assert.equal(mission.id, index);
      assert.equal(mission.collection, key);
      assert.ok(mission.objectives.length >= 3 && mission.objectives.length <= 6);
      for (const [left, top] of [
        mission.start,
        mission.exit,
        mission.relic,
        ...mission.objectives.map((point) => [point.x, point.y]),
      ]) {
        assert.ok(left > 80 && left < mission.width - 80 && top > 80 && top < mission.height - 80);
        for (const [wallX, wallY, width, height] of mission.walls || [])
          assert.ok(
            left < wallX - 20 ||
              left > wallX + width + 20 ||
              top < wallY - 20 ||
              top > wallY + height + 20,
          );
      }
      assert.ok(mission.briefing && mission.ending && mission.discovery);
    });
  });
}

test('ordered objectives cannot be completed ahead of their prerequisites', () => {
  const mission = COLLECTIONS.shuttle.missions[3];
  assert.equal(objectiveReady(mission, 1, []), false);
  assert.equal(objectiveReady(mission, 1, [0]), true);
  assert.equal(objectiveReady(COLLECTIONS.away.missions[0], 2, []), true);
});

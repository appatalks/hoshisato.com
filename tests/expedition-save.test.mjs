import test from 'node:test';
import assert from 'node:assert/strict';
import { freshSave, normalizeSave, SaveStore } from '../src/systems/save.js';

test('legacy saves gain isolated expedition records without losing Star Chart progress', () => {
  const raw = {
    version: 1,
    completed: [0, 4],
    current: 4,
    checkpoint: { level: 4, x: 2160, relays: [0] },
  };
  const save = normalizeSave(raw);
  assert.deepEqual(save.completed, [0, 4]);
  assert.equal(save.checkpoint.x, 2160);
  assert.deepEqual(save.away, { completed: [], discoveries: [], checkpoint: null, bestTimes: {} });
  assert.deepEqual(save.shuttle, save.away);
});

test('expedition records sanitize inputs and remain separate', () => {
  const raw = freshSave();
  raw.activeCollection = 'shuttle';
  raw.away = {
    completed: [1, 1, 22],
    discoveries: [4, -1],
    checkpoint: { level: 9, objectives: [1, 1, 99] },
  };
  const save = normalizeSave(raw);
  assert.deepEqual(save.away.completed, [1]);
  assert.deepEqual(save.away.discoveries, [4]);
  assert.deepEqual(save.away.checkpoint, { level: 9, objectives: [1], elapsed: 0 });
  assert.deepEqual(save.shuttle.completed, []);
  assert.equal(save.activeCollection, 'shuttle');
});

test('completing an expedition never alters another collection or legacy checkpoint', () => {
  const storage = { getItem: () => null, setItem() {} };
  const store = new SaveStore(storage);
  store.data.checkpoint = { level: 0, x: 140, relays: [] };
  store.data.away.checkpoint = { level: 3, objectives: [0] };
  assert.equal(store.recordExpedition('away', 'completed', 3), true);
  assert.equal(store.recordExpedition('away', 'completed', 3), false);
  assert.equal(store.data.away.checkpoint, null);
  assert.ok(store.data.checkpoint);
  assert.deepEqual(store.data.shuttle.completed, []);
  store.reset();
  assert.deepEqual(store.data.away.completed, []);
});

test('replays clear their checkpoint and keep the fastest mission time', () => {
  const store = new SaveStore({ getItem: () => null, setItem() {} });
  store.recordExpedition('shuttle', 'completed', 8, 90000);
  store.data.shuttle.checkpoint = { level: 8, objectives: [0], elapsed: 15000 };
  assert.equal(store.recordExpedition('shuttle', 'completed', 8, 80000), false);
  assert.equal(store.data.shuttle.checkpoint, null);
  assert.equal(store.data.shuttle.bestTimes[8], 80000);
  store.recordExpedition('shuttle', 'completed', 8, 95000);
  assert.equal(normalizeSave(store.data).shuttle.bestTimes[8], 80000);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, THEMES, availableTools, completion } from '../src/data/campaign.js';
import { freshSave, normalizeSave, SaveStore } from '../src/systems/save.js';

test('ten authored journeys have distinct identity and complete objectives', () => {
  assert.equal(LEVELS.length, 10);
  assert.equal(new Set(LEVELS.map((level) => level.theme)).size, 10);
  assert.equal(new Set(LEVELS.map((level) => level.mechanic)).size, 10);
  LEVELS.forEach((level, index) => {
    assert.equal(level.id, index);
    assert.ok(THEMES[level.theme]);
    assert.ok(level.relays.length >= 2 && level.platforms.length >= 6);
    assert.equal(level.crystals.length, 5);
    assert.ok(level.checkpoint > 120 && level.checkpoint < level.width);
    assert.ok(
      level.floors.some(
        ([left, width]) => level.checkpoint >= left && level.checkpoint <= left + width,
      ),
    );
    for (const [left, width] of level.gaps) assert.ok(width <= 330 && left + width < level.width);
    for (const [left, top, tool] of level.relays) {
      assert.ok(left > 0 && left < level.width && top > 160);
      assert.ok(tool === 0 || (tool === 1 && index >= 2) || (tool === 2 && index >= 5));
    }
  });
  assert.equal(LEVELS.filter((level) => level.boss).length, 4);
});

test('corrupt, old, and out-of-range saves recover predictably', () => {
  assert.deepEqual(normalizeSave(null), freshSave());
  assert.deepEqual(normalizeSave({ version: 40 }), freshSave());
  const save = normalizeSave({
    version: 1,
    unlocked: 500,
    current: -2,
    completed: [1, 1, 23, '2'],
    settings: { music: 9, difficulty: 'impossible' },
  });
  assert.equal(save.unlocked, 9);
  assert.equal(save.current, 0);
  assert.deepEqual(save.completed, [1]);
  assert.equal(save.settings.music, 1);
  assert.equal(save.settings.difficulty, 'explorer');
});

test('campaign persistence, unlocks, and reset preserve settings', () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
  };
  const store = new SaveStore(storage);
  for (let level = 0; level < 10; level += 1) store.complete(level);
  assert.equal(new SaveStore(storage).data.completed.length, 10);
  assert.equal(store.data.unlocked, 9);
  store.data.settings.music = 0;
  store.reset();
  assert.equal(store.data.unlocked, 0);
  assert.equal(store.data.settings.music, 0);
});

test('storage denial is nonfatal and special tool rewards exploration', () => {
  const store = new SaveStore({
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('denied');
    },
  });
  assert.equal(store.write(), false);
  assert.equal(availableTools(store.data).length, 1);
  store.data.secrets = [0, 1, 2];
  assert.equal(availableTools(store.data).at(-1).id, 'echo');
});

test('completion counts campaign, secrets, lore, and all fifty stars', () => {
  const save = freshSave();
  assert.equal(completion(save), 0);
  save.completed = save.secrets = save.lore = LEVELS.map((level) => level.id);
  save.crystals = Array.from({ length: 50 }, (_, index) => String(index));
  assert.equal(completion(save), 100);
});

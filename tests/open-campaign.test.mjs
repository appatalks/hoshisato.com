import test from 'node:test';
import assert from 'node:assert/strict';
import { freshSave, normalizeSave } from '../src/systems/save.js';
import { availableTools, LEVELS } from '../src/data/campaign.js';

test('a fresh explorer has the required signal equipment at every destination', () => {
  for (const level of LEVELS) {
    const tools = availableTools(freshSave(), level.id).map((tool) => tool.id);
    for (const [, , frequency] of level.relays)
      assert.ok(tools.includes(['pulse', 'prism', 'chorus'][frequency]));
  }
});

test('out-of-order mission saves retain their destination and checkpoint', () => {
  const save = freshSave();
  save.current = 9;
  save.checkpoint = { level: 9, x: 2760, relays: [0] };
  const restored = normalizeSave(save);
  assert.equal(restored.current, 9);
  assert.equal(restored.checkpoint.level, 9);
  assert.deepEqual(restored.completed, []);
});

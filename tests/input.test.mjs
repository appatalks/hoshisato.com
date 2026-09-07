import test from 'node:test';
import assert from 'node:assert/strict';
import { InputController } from '../src/systems/input.js';

function controller() {
  return { held: new Set(), pressed: new Set(), touch: new Set(), padPrevious: [] };
}

test('no controller produces finite idle and keyboard movement', () => {
  const input = controller();
  assert.equal(InputController.prototype.sample.call(input).horizontal, 0);
  input.held.add('right');
  assert.equal(InputController.prototype.sample.call(input).horizontal, 1);
  input.held.delete('right');
  input.held.add('left');
  assert.equal(InputController.prototype.sample.call(input).horizontal, -1);
});

test('touch presses are consumed once and do not latch jumps', () => {
  const input = controller();
  input.touch.add('jump');
  input.pressed.add('jump');
  assert.equal(InputController.prototype.sample.call(input).jumpPressed, true);
  assert.ok(!InputController.prototype.sample.call(input).jumpPressed);
  input.touch.clear();
  assert.equal(InputController.prototype.sample.call(input).jump, false);
});

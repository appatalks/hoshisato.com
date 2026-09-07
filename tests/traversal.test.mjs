import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, archiveAlcove, starPosition } from '../src/data/campaign.js';
import { hubLevel, UPGRADES, unspentStars } from '../src/data/hub.js';
import { freshSave } from '../src/systems/save.js';

function reaches(from, to, level) {
  const jump = level.gravity < 800 ? 465 : 620;
  const rise = from.top - to.top;
  const extraRise = level.id >= 3 ? (jump * jump) / (2 * level.gravity) : 0;
  const discriminant = jump * jump - 2 * level.gravity * (rise - extraRise);
  if (discriminant < 0) return false;
  const flight = (jump + Math.sqrt(discriminant)) / level.gravity;
  const gap = Math.max(0, to.left - from.right, from.left - to.right);
  return gap + 20 < flight * 330;
}

for (const level of LEVELS)
  test(`${level.place}: receivers, archives, and exit are connected by reachable surfaces`, () => {
    const alcove = archiveAlcove(level);
    const surfaces = [
      ...level.floors.map(([left, width]) => ({ left, right: left + width, top: 620 })),
      ...[...level.platforms, alcove.platform].map(([left, top, width]) => ({
        left,
        right: left + width,
        top,
      })),
    ];
    const visited = new Set([0]);
    const pending = [0];
    while (pending.length) {
      const from = surfaces[pending.shift()];
      surfaces.forEach((surface, index) => {
        if (!visited.has(index) && reaches(from, surface, level)) {
          visited.add(index);
          pending.push(index);
        }
      });
    }
    const accessible = [...visited].map((index) => surfaces[index]);
    for (const [left, top] of [...level.relays, alcove.artifact, level.terminal]) {
      assert.ok(
        accessible.some(
          (surface) =>
            left >= surface.left - 25 &&
            left <= surface.right + 25 &&
            Math.abs(surface.top - top - 40) < 90,
        ),
        `No reachable support near ${left}, ${top}`,
      );
    }
    assert.ok(
      accessible.some(
        (surface) => surface.left <= level.width - 80 && surface.right >= level.width - 80,
      ),
    );
  });

test('the Defiant gains three real decks and upgrades never overspend stars', () => {
  const save = freshSave();
  const widths = [hubLevel(save).width];
  for (const count of [3, 6, 9]) {
    save.completed = Array.from({ length: count }, (_, index) => index);
    widths.push(hubLevel(save).width);
  }
  for (let index = 1; index < widths.length; index += 1)
    assert.ok(widths[index] > widths[index - 1]);
  save.crystals = Array.from({ length: 50 }, (_, index) => String(index));
  save.upgrades = UPGRADES.map((upgrade) => upgrade.id);
  assert.equal(unspentStars(save), 20);
});

test('receivers, logs, stars, and optional archives have separate readable positions', () => {
  for (const level of LEVELS) {
    for (const [left, top] of level.relays) {
      assert.ok(Math.hypot(left - level.terminal[0], top - level.terminal[1]) >= 75);
      for (let index = 0; index < 5; index += 1) {
        const [starX, starY] = starPosition(level, index);
        assert.ok(Math.hypot(left - starX, top - starY) >= 65);
      }
    }
    const alcove = archiveAlcove(level);
    assert.ok(alcove.platform[0] + alcove.platform[2] < level.width);
    assert.ok(alcove.platform[1] >= 140);
  }
});

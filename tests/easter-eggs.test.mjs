import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EASTER_EGGS,
  KONAMI_CODE,
  KonamiSequence,
  easterEggContext,
} from '../src/data/easter-eggs.js';
import { ACHIEVEMENTS } from '../src/data/campaign.js';

test('six contexts have individual, registered achievements', () => {
  const ids = Object.values(EASTER_EGGS).map((egg) => egg.achievement);
  assert.equal(new Set(ids).size, 6);
  for (const id of ids) assert.ok(ACHIEVEMENTS[id]);
  assert.equal(easterEggContext(null), 'title');
  assert.equal(easterEggContext({ isHub: true }), 'hub');
  assert.equal(easterEggContext({ collection: 'away' }), 'away');
  assert.equal(easterEggContext({ collection: 'shuttle' }), 'shuttle');
  assert.equal(easterEggContext({ collection: 'star' }), 'star');
  assert.equal(
    easterEggContext({
      player: { sprite: { x: 300, y: 1000 } },
      exploration: { contains: () => true },
    }),
    'underground',
  );
});

test('sequence accepts complete input, handles overlapping prefixes, and times out stale keys', () => {
  const matcher = new KonamiSequence();
  assert.equal(matcher.push('ArrowUp', 0), false);
  KONAMI_CODE.forEach((key, index) =>
    assert.equal(matcher.push(key, index * 100 + 100), index === 9),
  );
  KONAMI_CODE.slice(0, 9).forEach((key, index) => matcher.push(key, index * 100 + 1200));
  assert.equal(matcher.push('KeyA', 10000), false);
  matcher.reset();
  assert.equal(matcher.push('KeyA', 10100), false);
});

export const EASTER_EGGS = {
  title: {
    achievement: 'konami-title',
    title: 'A Crown of Stars',
    hint: 'Find the old sequence on the title screen.',
    message: 'Even the constellations have noticed the new Empress.',
    color: '#f3d49a',
  },
  hub: {
    achievement: 'konami-hub',
    title: 'Tea, by Imperial Decree',
    hint: 'Find the old sequence aboard the Defiant.',
    message: 'All departments report ready. The tea, at last, is the correct temperature.',
    color: '#c5e4d0',
  },
  star: {
    achievement: 'konami-star',
    title: 'A Very Royal Inspection',
    hint: 'Find the old sequence on an upper Star Chart route.',
    message: 'The inspection committee has arrived. It consists entirely of you.',
    color: '#f0c48e',
  },
  underground: {
    achievement: 'konami-depths',
    title: 'Lanterns Below the Empire',
    hint: 'Find the old sequence in a lower passage.',
    message: 'The forgotten deck remembers how to celebrate.',
    color: '#b8dcec',
  },
  away: {
    achievement: 'konami-away',
    title: 'An Unexpected Bloom',
    hint: 'Find the old sequence on an Away Mission.',
    message: 'First contact with the local flora appears to have gone rather well.',
    color: '#e5b7d4',
  },
  shuttle: {
    achievement: 'konami-shuttle',
    title: 'The Imperial Flypast',
    hint: 'Find the old sequence during a Shuttle Bay flight.',
    message: 'Ceremonial holograms, perfect formation. No additional paperwork.',
    color: '#a9dce8',
  },
};

export const EASTER_EGG_ACHIEVEMENTS = Object.fromEntries(
  Object.values(EASTER_EGGS).map((egg) => [egg.achievement, [egg.title, egg.hint]]),
);

export function easterEggContext(scene) {
  if (!scene) return 'title';
  if (scene.isHub) return 'hub';
  if (scene.collection === 'away' || scene.collection === 'shuttle') return scene.collection;
  const sprite = scene.player?.sprite;
  if (sprite && sprite.y > 785 && scene.exploration?.contains(sprite.x)) return 'underground';
  return 'star';
}

export const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export class KonamiSequence {
  constructor() {
    this.reset();
  }
  reset() {
    this.buffer = [];
    this.lastKeyAt = -Infinity;
  }
  push(code, time) {
    if (time - this.lastKeyAt > 5000) this.reset();
    this.lastKeyAt = time;
    this.buffer.push(code);
    while (this.buffer.some((key, index) => key !== KONAMI_CODE[index])) this.buffer.shift();
    if (this.buffer.length !== KONAMI_CODE.length) return false;
    this.reset();
    return true;
  }
}

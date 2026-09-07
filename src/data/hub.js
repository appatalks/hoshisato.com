export function hubLevel(save) {
  const count = save.completed.length;
  return {
    id: -1,
    title: count === 10 ? 'A Universe to Share' : 'A Place to Come Home To',
    place: 'THE DEFIANT / HOME',
    theme: count >= 8 ? 'throne' : 'defiant',
    width: count >= 9 ? 4100 : count >= 6 ? 3450 : count >= 3 ? 2700 : 2000,
    gravity: 1100,
    floors: [[0, 4200]],
    platforms: [
      [620, 465, 250],
      [1000, 465, 250],
    ],
    relays: [],
    patrols: [],
    crystals: [],
    gaps: [],
    briefing: count
      ? 'Welcome home, Empress. The ship has been listening.'
      : 'A ship full of possibility. The star chart is just ahead.',
  };
}

export const CREW_LINES = [
  [
    'Navigator Ivo',
    'I signed on for a quiet posting. Then you arrived. Still deciding whether that is a good thing.',
  ],
  [
    'Navigator Ivo',
    'The yard called. Apparently they like you. I am beginning to see their point.',
  ],
  [
    'Navigator Ivo',
    'We have room for more than one kind of future on this ship. I would like to help you find it.',
  ],
  [
    'Navigator Ivo',
    'Ten worlds on one channel. No orders, no shouting. I think I will stay, Empress.',
  ],
];

export const UPGRADES = [
  { id: 'resonance', name: 'Resonance coil', cost: 8, text: 'Signal tools recharge 25% faster.' },
  { id: 'phase', name: 'Phase capacitor', cost: 12, text: 'Phase steps recharge sooner.' },
  {
    id: 'compass',
    name: 'Archive compass',
    cost: 10,
    text: 'Hidden archives glow from farther away.',
  },
];

export function unspentStars(save) {
  return Math.max(
    0,
    save.crystals.length -
      UPGRADES.filter((upgrade) => save.upgrades.includes(upgrade.id)).reduce(
        (sum, upgrade) => sum + upgrade.cost,
        0,
      ),
  );
}

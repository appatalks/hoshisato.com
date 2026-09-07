const ROUTES = [
  {
    name: 'The Unlisted Deck',
    style: 'service',
    obstacle: 'gate',
    span: 1160,
    bottom: 1310,
    message:
      'SEALED ORDERS / Admiral Vey has denied your authority. His private channel is now routed through your bridge. Hoshi: How considerate of him.',
  },
  {
    name: 'The Foundry Below',
    style: 'industrial',
    obstacle: 'crawl',
    span: 1410,
    bottom: 1430,
    message:
      'DOCKMASTER / The admirals own the contracts. The crews own the ships. Remember which signatures keep an empire moving.',
  },
  {
    name: 'The Root Cathedral',
    style: 'cave',
    obstacle: 'bridge',
    span: 1340,
    bottom: 1390,
    message:
      'VULCAN ARCHIVE / These chambers predate the imperial banners above. Their custodians will grant passage, but not ownership.',
  },
  {
    name: 'The Silent Hold',
    style: 'wreck',
    obstacle: 'gate',
    span: 1270,
    bottom: 1330,
    message:
      'RECOVERED MANIFEST / A second command seal. A different succession. Someone expected the Enterprise to carry another ruler home.',
  },
  {
    name: 'Beneath the Banners',
    style: 'crypt',
    obstacle: 'crawl',
    span: 1260,
    bottom: 1460,
    message:
      "PALACE COURIER / The capital has prepared three versions of tomorrow's proclamation. Hoshi: Keep the one with my name. Recycle the rest.",
  },
  {
    name: 'The Listening Vault',
    style: 'service',
    obstacle: 'bridge',
    span: 1480,
    bottom: 1370,
    message:
      'INTERCEPT / The Free Relay hears every faction. Your rivals call that a liability. Your navigator calls it a considerable advantage.',
  },
  {
    name: 'The Glass Beneath',
    style: 'crystal',
    obstacle: 'crawl',
    span: 1530,
    bottom: 1450,
    message:
      'THOLIAN TRANSLATION / The imperial seal is not a key here. The web recognizes only a pattern answered correctly.',
  },
  {
    name: 'The Mnemonic Catacombs',
    style: 'lab',
    obstacle: 'gate',
    span: 1330,
    bottom: 1410,
    message:
      'CLASSIFIED / The Regent was not built to obey the throne. It was built to decide who could be trusted with it. Access restricted by imperial order.',
  },
  {
    name: "The Empress's Passage",
    style: 'service',
    obstacle: 'bridge',
    span: 1510,
    bottom: 1470,
    message:
      'PRIVATE CHANNEL / Every admiral has a map of the Defiant. None of them has this one. Hoshi: Let us keep it that way.',
  },
  {
    name: 'The First Empire',
    style: 'crypt',
    obstacle: 'gate',
    span: 1540,
    bottom: 1500,
    message:
      'THE REGENT / Many have brought a crown into this room. You are the first to bring the voices beneath it.',
  },
];

export function lowerRoute(level) {
  const route = ROUTES[level.id];
  const [gapLeft, gapWidth] = level.gaps[0];
  const entry = gapLeft + gapWidth / 2;
  const left = gapLeft - 190;
  const right = Math.min(left + route.span, level.width - 230);
  const checkpoint = { x: left + 230, y: route.bottom };
  const lift = { x: right - 100, y: route.bottom };
  const ledges = [
    [entry - 120, 850, 250],
    [left + 80, 1020, 230],
    [left + 170, route.bottom - 150, 240],
    [right - 410, route.bottom - 150, 210],
  ];
  return {
    ...route,
    left,
    right,
    entry,
    gapLeft,
    gapWidth,
    checkpoint,
    lift,
    ledges,
    cache: { x: right - 260, y: route.bottom - 150 },
    exit: { x: gapLeft + gapWidth + 90, y: 620 },
  };
}

export function routeStars(level) {
  const route = lowerRoute(level);
  return [
    [route.left + 190, 980],
    [route.right - 335, route.bottom - 190],
  ];
}

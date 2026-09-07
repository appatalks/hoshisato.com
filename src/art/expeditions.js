import { seeded, polygon, ellipse, paintHoshi } from './illustration.js';

function canvasTexture(scene, key, width, height, paint) {
  if (scene.textures.exists(key)) return;
  const texture = scene.textures.createCanvas(key, width, height);
  paint(texture.context);
  texture.refresh();
}

export function createExpeditionTextures(scene) {
  canvasTexture(scene, 'exp-star', 32, 32, (context) => {
    polygon(
      context,
      [
        [16, 1],
        [21, 11],
        [31, 16],
        [21, 21],
        [16, 31],
        [11, 21],
        [1, 16],
        [11, 11],
      ],
      '#f2d396',
      '#ffedc1',
    );
  });
  canvasTexture(scene, 'exp-pulse', 16, 16, (context) => {
    const light = context.createRadialGradient(8, 8, 1, 8, 8, 8);
    light.addColorStop(0, '#ffffff');
    light.addColorStop(1, '#ffffff00');
    context.fillStyle = light;
    context.fillRect(0, 0, 16, 16);
  });
  canvasTexture(scene, 'exp-landmark', 96, 120, (context) => {
    ellipse(context, 48, 100, 40, 14, '#0b182877');
    polygon(
      context,
      [
        [15, 100],
        [24, 28],
        [47, 7],
        [73, 29],
        [80, 100],
        [48, 113],
      ],
      '#526a73',
      '#bdd0ba',
    );
    polygon(
      context,
      [
        [47, 7],
        [48, 113],
        [80, 100],
        [73, 29],
      ],
      '#263b4a',
    );
    polygon(
      context,
      [
        [47, 28],
        [62, 53],
        [47, 78],
        [32, 53],
      ],
      '#a1ded0',
      '#f7e1b0',
    );
    context.strokeStyle = '#d3ba87';
    context.lineWidth = 2;
    context.strokeRect(36, 85, 24, 8);
  });
  canvasTexture(scene, 'exp-contact', 100, 120, (context) => {
    ellipse(context, 50, 107, 30, 8, '#08142166');
    polygon(
      context,
      [
        [38, 36],
        [64, 36],
        [72, 61],
        [86, 101],
        [57, 112],
        [23, 100],
        [33, 62],
      ],
      '#bcc9c4',
      '#f0dcc0',
    );
    polygon(
      context,
      [
        [58, 40],
        [62, 74],
        [57, 112],
        [77, 105],
        [69, 61],
      ],
      '#5b838a',
    );
    ellipse(context, 50, 26, 16, 21, '#92bbaa');
    polygon(
      context,
      [
        [35, 20],
        [29, 5],
        [41, 12],
        [50, 4],
        [63, 12],
        [72, 5],
        [65, 27],
        [60, 12],
        [42, 12],
      ],
      '#394f5b',
      '#98b9bd',
    );
    ellipse(context, 44, 25, 2, 1, '#182f38');
    ellipse(context, 57, 25, 2, 1, '#182f38');
    context.strokeStyle = '#ecd8a2';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(38, 46);
    context.lineTo(54, 66);
    context.lineTo(67, 44);
    context.stroke();
  });
  for (let frame = 0; frame < 6; frame += 1)
    canvasTexture(scene, `exp-hoshi-${frame}`, 80, 128, (context) =>
      paintHoshi(context, 42, 16, 0.36, (frame / 6) * Math.PI * 2),
    );
  canvasTexture(scene, 'exp-ship', 128, 160, (context) => {
    ellipse(context, 64, 51, 47, 38, '#9aaeb9');
    ellipse(context, 64, 47, 43, 31, '#bac8c9');
    context.strokeStyle = '#506579';
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(64, 47, 33, 23, 0, 0, Math.PI * 2);
    context.stroke();
    polygon(
      context,
      [
        [54, 71],
        [74, 71],
        [83, 121],
        [64, 139],
        [46, 121],
      ],
      '#879aa6',
      '#c3d5d4',
    );
    polygon(
      context,
      [
        [49, 94],
        [18, 108],
        [18, 126],
        [54, 111],
      ],
      '#526d7b',
      '#b3c9ca',
    );
    polygon(
      context,
      [
        [79, 94],
        [110, 108],
        [110, 126],
        [74, 111],
      ],
      '#526d7b',
      '#b3c9ca',
    );
    polygon(
      context,
      [
        [11, 66],
        [24, 66],
        [27, 142],
        [17, 151],
        [9, 142],
      ],
      '#9eafba',
      '#d4ded9',
    );
    polygon(
      context,
      [
        [104, 66],
        [117, 66],
        [119, 142],
        [110, 151],
        [101, 142],
      ],
      '#9eafba',
      '#d4ded9',
    );
    ellipse(context, 18, 71, 6, 10, '#c87583');
    ellipse(context, 111, 71, 6, 10, '#c87583');
    context.fillStyle = '#94e5e1';
    context.fillRect(12, 136, 11, 8);
    context.fillRect(106, 136, 11, 8);
    polygon(
      context,
      [
        [61, 26],
        [67, 26],
        [68, 63],
        [60, 63],
      ],
      '#914458',
    );
    ellipse(context, 64, 48, 10, 7, '#d7e0d8');
    context.fillStyle = '#415263';
    context.fillRect(37, 47, 12, 2);
    context.fillRect(79, 47, 12, 2);
    context.fillStyle = '#e0c496';
    context.fillRect(61, 96, 6, 16);
  });
  canvasTexture(scene, 'exp-freighter', 92, 120, (context) => {
    polygon(
      context,
      [
        [28, 8],
        [63, 8],
        [76, 91],
        [60, 108],
        [32, 108],
        [17, 91],
      ],
      '#768d98',
      '#bcc6b8',
    );
    context.fillStyle = '#c79e78';
    for (let row = 25; row < 85; row += 20) context.fillRect(30, row, 31, 13);
    context.fillStyle = '#9adee0';
    context.fillRect(22, 88, 9, 15);
    context.fillRect(61, 88, 9, 15);
  });
  canvasTexture(scene, 'exp-station', 160, 160, (context) => {
    context.strokeStyle = '#758e9c';
    context.lineWidth = 15;
    context.beginPath();
    context.arc(80, 80, 55, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = '#d2ba86';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(80, 80, 64, 0, Math.PI * 2);
    context.stroke();
    for (let index = 0; index < 4; index += 1) {
      context.save();
      context.translate(80, 80);
      context.rotate((index * Math.PI) / 2);
      polygon(
        context,
        [
          [-12, -15],
          [12, -15],
          [16, -70],
          [-16, -70],
        ],
        '#8b9eab',
        '#cfdbd3',
      );
      context.restore();
    }
    ellipse(context, 80, 80, 25, 25, '#304e61');
    ellipse(context, 80, 80, 12, 12, '#a1ddd1');
  });
  canvasTexture(scene, 'exp-crate', 60, 60, (context) => {
    polygon(
      context,
      [
        [10, 10],
        [42, 5],
        [54, 18],
        [50, 49],
        [17, 55],
        [5, 41],
      ],
      '#8d9e9d',
      '#dfd3b3',
    );
    context.fillStyle = '#475964';
    context.fillRect(15, 15, 30, 30);
    context.strokeStyle = '#dfbd89';
    context.lineWidth = 3;
    context.strokeRect(20, 20, 20, 20);
  });
  for (let variant = 0; variant < 4; variant += 1)
    canvasTexture(scene, `exp-rock-${variant}`, 120, 120, (context) => {
      const random = seeded(variant + 244);
      const points = Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        const radius = 43 + random() * 13;
        return [60 + Math.cos(angle) * radius, 60 + Math.sin(angle) * radius];
      });
      polygon(context, points, '#59616b', '#939598');
      ellipse(context, 42, 38, 12, 9, '#878b8a');
      ellipse(context, 75, 68, 19, 15, '#343f4b');
      ellipse(context, 35, 78, 8, 7, '#414956');
    });
}

function terrainDetail(context, left, top, biome, random, palette) {
  if (biome === 'shore') {
    context.strokeStyle = '#9acbcb45';
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(left - 22, top);
    context.quadraticCurveTo(left, top + 9, left + 24, top);
    context.stroke();
    if (random() > 0.7) {
      context.strokeStyle = '#d7a6a9';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(left, top + 8);
      context.lineTo(left, top - 20);
      context.moveTo(left, top - 5);
      context.lineTo(left - 12, top - 16);
      context.moveTo(left, top - 10);
      context.lineTo(left + 10, top - 23);
      context.stroke();
      ellipse(context, left, top + 12, 14, 5, '#bbbab58c');
    }
  } else if (['forest', 'night'].includes(biome)) {
    ellipse(context, left + 12, top + 13, 39, 17, '#061d2544');
    context.strokeStyle = biome === 'night' ? '#568f91' : '#536b53';
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(left, top + 14);
    context.lineTo(left - 3, top - 27);
    context.stroke();
    for (let petal = 0; petal < 5; petal += 1)
      ellipse(
        context,
        left + Math.cos(petal * 1.3) * 18,
        top - 22 + Math.sin(petal * 1.3) * 12,
        23,
        13,
        petal % 2 ? palette[1] : palette[2] + 'aa',
      );
    if (biome === 'night') ellipse(context, left, top - 20, 5, 5, '#e5c2de');
  } else if (['ruins', 'rain', 'eclipse'].includes(biome)) {
    polygon(
      context,
      [
        [left - 15, top],
        [left - 15, top - 35],
        [left, top - 45],
        [left + 17, top - 31],
        [left + 17, top + 7],
      ],
      palette[1],
      palette[2] + '55',
    );
    context.fillStyle = palette[2] + '66';
    context.fillRect(left - 8, top - 30, 15, 3);
    context.fillRect(left - 8, top - 23, 9, 2);
  } else if (biome === 'ice') {
    polygon(
      context,
      [
        [left - 24, top + 6],
        [left - 7, top - 28],
        [left + 20, top - 17],
        [left + 30, top + 10],
      ],
      '#a4c9d5',
      '#e0eeee',
    );
    polygon(
      context,
      [
        [left - 7, top - 28],
        [left + 2, top + 9],
        [left + 30, top + 10],
      ],
      '#6e9faf',
    );
  } else if (biome === 'cloud') {
    context.strokeStyle = '#dee4d977';
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(left, top, 30, 9, 0.2, 0, Math.PI * 2);
    context.stroke();
    polygon(
      context,
      [
        [left, top - 21],
        [left + 10, top],
        [left, top + 22],
        [left - 9, top],
      ],
      '#e0d6ba99',
    );
  } else {
    const radius = 8 + random() * 18;
    polygon(
      context,
      [
        [left - radius, top],
        [left - radius * 0.6, top - radius],
        [left + radius * 0.4, top - radius * 1.2],
        [left + radius, top],
        [left, top + radius * 0.3],
      ],
      palette[1],
      palette[2] + '33',
    );
    if (biome === 'volcanic') {
      context.strokeStyle = '#e4a17b66';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left + radius * 0.2, top - radius);
      context.stroke();
    }
  }
}

export function createTerrain(scene) {
  const key = 'exp-terrain';
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const mission = scene.level;
  canvasTexture(scene, key, 1600, 1200, (context) => {
    context.scale(2 / 3, 2 / 3);
    const random = seeded(mission.id + 1903);
    const palette = mission.palette;
    const ground = context.createLinearGradient(0, 0, 2400, 1800);
    ground.addColorStop(0, palette[0]);
    ground.addColorStop(1, mission.collection === 'shuttle' ? '#1a2233' : palette[1]);
    context.fillStyle = ground;
    context.fillRect(0, 0, 2400, 1800);
    if (mission.collection === 'shuttle') {
      for (let index = 0; index < 750; index += 1) {
        context.globalAlpha = 0.15 + random() * 0.7;
        context.fillStyle = index % 7 ? '#d8e2d9' : '#f3cfa3';
        const size = index % 31 ? 1 : 3;
        context.fillRect(random() * 2400, random() * 1800, size, size);
      }
      context.globalAlpha = 1;
      const colors = {
        nebula: '#69547e',
        ion: '#377d8a',
        rift: '#75638d',
        gravity: '#3d4864',
        orbit: '#315771',
        cargo: '#315058',
        patrol: '#643b53',
        race: '#78654b',
        convoy: '#4b596e',
        belt: '#4f4b56',
      };
      for (let layer = 0; layer < 7; layer += 1) {
        context.strokeStyle = colors[mission.biome] + '25';
        context.lineWidth = 22 + layer * 16;
        context.beginPath();
        context.moveTo(-100, 1350 - layer * 85);
        context.bezierCurveTo(760, 1640, 1300, 120 - layer * 60, 2550, 490 + layer * 50);
        context.stroke();
      }
      const radius = 160;
      const planet = context.createRadialGradient(2100, 1450, 0, 2180, 1520, radius);
      planet.addColorStop(0, '#a2b6c2');
      planet.addColorStop(0.5, colors[mission.biome]);
      planet.addColorStop(1, '#132031');
      ellipse(context, 2180, 1520, radius, radius, planet);
      return;
    }
    for (let band = 0; band < 16; band += 1) {
      context.strokeStyle = palette[2] + '13';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-100, band * 140);
      context.bezierCurveTo(740, band * 140 - 230, 1530, band * 140 + 220, 2500, band * 140 - 100);
      context.stroke();
    }
    const landmarks = [
      mission.start,
      ...mission.objectives.map((node) => [node.x, node.y]),
      mission.exit,
    ];
    const trail = (size, color) => {
      context.strokeStyle = color;
      context.lineWidth = size;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.beginPath();
      landmarks.forEach(([left, top], index) =>
        index ? context.lineTo(left, top) : context.moveTo(left, top),
      );
      context.stroke();
    };
    const pathColor = {
      shore: '#9dbaa9',
      forest: '#879273',
      ice: '#b8d7de',
      rain: '#718f96',
      desert: '#bb9d88',
      night: '#466a6b',
      volcanic: '#786d72',
      cloud: '#c4d1cf',
      ruins: '#9aaa9e',
      eclipse: '#8e929e',
    }[mission.biome];
    trail(285, palette[0] + '77');
    trail(251, mission.biome === 'shore' ? '#e3d4b299' : palette[2] + '44');
    trail(231, pathColor);
    trail(125, palette[2] + '13');
    for (const [left, top] of landmarks) {
      ellipse(context, left + 15, top + 24, 155, 105, '#071d2644');
      ellipse(context, left, top, 153, 102, mission.biome === 'shore' ? '#d8d1b3' : pathColor);
      ellipse(context, left, top - 5, 142, 91, pathColor);
      context.strokeStyle = palette[2] + '55';
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(left, top, 107, 68, 0, 0, Math.PI * 2);
      context.stroke();
    }
    if (mission.biome === 'shore')
      for (let index = 0; index < 30; index += 1) {
        const left = 180 + random() * 2100;
        const top = 150 + random() * 1460;
        context.strokeStyle = '#d5ede252';
        context.lineWidth = 1;
        context.beginPath();
        context.ellipse(left, top, 40 + random() * 80, 12, 0, 0, Math.PI);
        context.stroke();
      }
    for (let index = 0; index < 420; index += 1) {
      const left = 90 + random() * 2220;
      const top = 100 + random() * 1580;
      const clear = [...landmarks, mission.relic].some(
        ([markX, markY]) => Math.hypot(left - markX, top - markY) < 150,
      );
      if (!clear) terrainDetail(context, left, top, mission.biome, random, palette);
    }
    for (const [left, top, width, height] of mission.walls) {
      context.fillStyle = '#07131f55';
      context.fillRect(left + 14, top + 22, width, height);
      const ridge = context.createLinearGradient(left, top, left + width, top + height);
      ridge.addColorStop(0, palette[1]);
      ridge.addColorStop(1, palette[0]);
      context.fillStyle = ridge;
      context.fillRect(left, top, width, height);
      context.strokeStyle = palette[2] + '99';
      context.lineWidth = 4;
      context.strokeRect(left + 2, top + 2, width - 4, height - 4);
      for (let offset = 20; offset < width; offset += 48) {
        context.strokeStyle = palette[2] + '33';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(left + offset, top + 12);
        context.lineTo(left + offset + 12, top + height - 12);
        context.stroke();
      }
      for (let offset = 20; offset < height; offset += 95)
        terrainDetail(context, left + width * 0.5, top + offset, mission.biome, random, palette);
    }
    context.strokeStyle = palette[2] + '44';
    context.lineWidth = 3;
    context.strokeRect(70, 70, 2260, 1660);
  });
  return key;
}

export function asteroidLayout(mission) {
  const random = seeded(mission.id + 755);
  const rocks = [];
  const clear = [
    mission.start,
    mission.exit,
    mission.relic,
    ...mission.objectives.map((node) => [node.x, node.y]),
  ];
  for (let attempt = 0; rocks.length < mission.rocks && attempt < 1000; attempt += 1) {
    const left = 130 + random() * 2140;
    const top = 140 + random() * 1520;
    const radius = 22 + random() * 37;
    if (clear.some(([markX, markY]) => Math.hypot(left - markX, top - markY) < radius + 130))
      continue;
    rocks.push({
      x: left,
      y: top,
      radius,
      variant: rocks.length % 4,
      speed: random() * 0.00014 + 0.00007,
      phase: random() * 6.28,
    });
  }
  return rocks;
}

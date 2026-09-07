import { ellipse, polygon } from './illustration.js';

function star(context, left, top, radius, color) {
  polygon(
    context,
    [
      [left, top - radius],
      [left + radius * 0.3, top - radius * 0.3],
      [left + radius, top],
      [left + radius * 0.3, top + radius * 0.3],
      [left, top + radius],
      [left - radius * 0.3, top + radius * 0.3],
      [left - radius, top],
      [left - radius * 0.3, top - radius * 0.3],
    ],
    color,
  );
}

function crown(context, left, top, scale) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  polygon(
    context,
    [
      [-32, 12],
      [-41, -19],
      [-15, -5],
      [0, -34],
      [15, -5],
      [41, -19],
      [32, 12],
    ],
    '#e4b86e',
    '#fff0ba',
  );
  polygon(
    context,
    [
      [-32, 12],
      [32, 12],
      [30, 23],
      [-30, 23],
    ],
    '#b0765b',
    '#e6c28b',
  );
  for (const [jewelX, jewelY] of [
    [-39, -19],
    [0, -34],
    [39, -19],
  ])
    ellipse(context, jewelX, jewelY, 3, 3, '#fff3ce');
  polygon(
    context,
    [
      [0, 0],
      [6, 8],
      [0, 16],
      [-6, 8],
    ],
    '#afdece',
  );
  context.restore();
}

function teacup(context, left, top, scale, time) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  ellipse(context, 0, 17, 23, 5, '#decbac');
  context.strokeStyle = '#e4d6ba';
  context.lineWidth = 4;
  context.beginPath();
  context.ellipse(20, 3, 8, 8, 0, 0, Math.PI * 2);
  context.stroke();
  polygon(
    context,
    [
      [-17, -7],
      [17, -7],
      [13, 11],
      [5, 15],
      [-8, 14],
      [-14, 8],
    ],
    '#e8ead9',
    '#a1c9c6',
  );
  ellipse(context, 0, -6, 16, 5, '#a36e4c');
  context.strokeStyle = '#f1e7d1aa';
  context.lineWidth = 1.5;
  for (let index = 0; index < 3; index += 1) {
    const steam = Math.sin(time + index) * 4;
    context.beginPath();
    context.moveTo(-9 + index * 8, -17);
    context.bezierCurveTo(
      -15 + index * 8 + steam,
      -27,
      1 + index * 8 - steam,
      -31,
      -6 + index * 8,
      -43,
    );
    context.stroke();
  }
  context.restore();
}

function lantern(context, left, top, scale) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  ellipse(context, 0, 0, 27, 39, '#b8dcec12');
  polygon(
    context,
    [
      [-12, -19],
      [12, -19],
      [16, 15],
      [0, 25],
      [-16, 15],
    ],
    '#6a97a880',
    '#d8e8cc',
  );
  polygon(
    context,
    [
      [0, -10],
      [6, 4],
      [0, 14],
      [-6, 4],
    ],
    '#ffdaa0',
  );
  context.strokeStyle = '#d8e8cc';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(0, -21, 7, Math.PI, 0);
  context.stroke();
  context.beginPath();
  context.moveTo(0, 25);
  context.lineTo(0, 40);
  context.stroke();
  context.restore();
}

function bloom(context, left, top, scale, color) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  context.strokeStyle = '#a5d9b9';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 22);
  context.quadraticCurveTo(5, 10, 0, 0);
  context.stroke();
  for (let petal = 0; petal < 5; petal += 1) {
    context.save();
    context.rotate((petal / 5) * Math.PI * 2);
    ellipse(context, 0, -10, 6, 12, color);
    context.restore();
  }
  ellipse(context, 0, 0, 5, 5, '#f9dea2');
  context.restore();
}

export function drawEasterEgg(canvas, context, state, app, time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  const reduced = app.store.data.settings.reducedMotion;
  const elapsed = time - state.started;
  const progress = Math.min(1, elapsed / state.duration);
  context.globalAlpha = reduced
    ? 0.9
    : Math.min(1, elapsed / 300, (state.duration - elapsed) / 600);
  const motion = reduced ? 0 : elapsed / 1000;
  const color = state.egg.color;
  if (state.location === 'title') {
    const centerX = width < 600 ? width * 0.76 : width * 0.74;
    const centerY = height * (width < 600 ? 0.21 : 0.3);
    const scale = Math.min(width < 600 ? 0.6 : 1.15, height / 640);
    const points = [
      [-110, 50],
      [-130, -55],
      [-55, -15],
      [0, -100],
      [55, -15],
      [130, -55],
      [110, 50],
      [-110, 50],
    ];
    context.strokeStyle = color;
    context.lineWidth = 1.2;
    context.beginPath();
    const visible = reduced
      ? points.length
      : Math.max(2, Math.min(points.length, Math.floor(progress * 22) + 2));
    points.slice(0, visible).forEach(([left, top], index) => {
      if (index) context.lineTo(centerX + left * scale, centerY + top * scale);
      else context.moveTo(centerX + left * scale, centerY + top * scale);
    });
    context.stroke();
    for (const [left, top] of points.slice(0, visible))
      star(context, centerX + left * scale, centerY + top * scale, 5 * scale, color);
    for (let index = 0; index < 14; index += 1) {
      const angle = index * 2.4;
      const radius = 70 + index * 11;
      star(
        context,
        centerX + Math.cos(angle) * radius * scale,
        centerY + Math.sin(angle) * radius * 0.55 * scale,
        2 + Math.sin(motion + index) * 0.4,
        color,
      );
    }
    return;
  }
  const scene = state.scene;
  const camera = scene.cameras.main;
  const sprite = scene.player.sprite;
  const rect = app.game.canvas.getBoundingClientRect();
  const bounds = canvas.getBoundingClientRect();
  const scaleX = rect.width / camera.width;
  const scaleY = rect.height / camera.height;
  const playerX =
    rect.left -
    bounds.left +
    ((sprite.x - camera.scrollX - camera.width / 2) * camera.zoom + camera.width / 2) * scaleX;
  const playerY =
    rect.top -
    bounds.top +
    ((sprite.y - camera.scrollY - camera.height / 2) * camera.zoom + camera.height / 2) * scaleY;
  const unit = Math.max(0.55, Math.min(1.3, camera.zoom * scaleY));
  if (state.location === 'hub') {
    for (let index = 0; index < 3; index += 1)
      teacup(
        context,
        playerX + (index - 1) * 78 * unit,
        playerY - (155 + (index % 2) * 34) * unit + (reduced ? 0 : Math.sin(motion + index) * 7),
        unit * 0.85,
        motion + index,
      );
  } else if (state.location === 'star') {
    crown(
      context,
      playerX,
      playerY - (sprite.displayHeight + 23) * camera.zoom * scaleY,
      unit * 0.65,
    );
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2 + motion * 0.15;
      star(
        context,
        playerX + Math.cos(angle) * 65 * unit,
        playerY - 70 * unit + Math.sin(angle) * 60 * unit,
        3 * unit,
        color,
      );
    }
  } else if (state.location === 'underground') {
    for (let index = 0; index < 7; index += 1)
      lantern(
        context,
        playerX + (index - 3) * 55 * unit,
        playerY -
          (120 + Math.sin(index * 0.6) * 80) * unit +
          (reduced ? 0 : Math.sin(motion * 0.7 + index) * 9),
        unit * 0.65,
      );
  } else if (state.location === 'away') {
    for (let index = 0; index < 9; index += 1) {
      const angle = (index / 9) * Math.PI * 2;
      const grow = reduced ? 1 : Math.min(1, elapsed / 800);
      bloom(
        context,
        playerX + Math.cos(angle) * 110 * unit,
        playerY + Math.sin(angle) * 65 * unit,
        unit * 0.9 * grow,
        index % 2 ? color : '#b2e7cd',
      );
    }
  } else if (state.location === 'shuttle') {
    const image = scene.textures.get('exp-ship').getSourceImage();
    context.save();
    context.translate(playerX, playerY);
    context.rotate(scene.player.heading);
    for (const [left, top] of [
      [-105, 85],
      [105, 85],
      [-175, 160],
      [175, 160],
    ]) {
      context.globalAlpha *= 0.84;
      context.drawImage(image, (left - 26) * unit, (top - 33) * unit, 52 * unit, 66 * unit);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(left * unit, (top + 35) * unit);
      context.lineTo(left * unit, (top + 65 + (reduced ? 0 : Math.sin(motion * 3) * 5)) * unit);
      context.stroke();
    }
    context.restore();
  }
  context.globalAlpha = 1;
}

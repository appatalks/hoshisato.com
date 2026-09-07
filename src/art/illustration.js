import { paintHoshi } from './hoshi.js';

export { paintHoshi };

export function paintImperialStandard(context, left, top, scale = 1) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  polygon(
    context,
    [
      [-42, 0],
      [42, 0],
      [42, 194],
      [0, 223],
      [-42, 194],
    ],
    '#742d43',
    '#c69769',
  );
  polygon(
    context,
    [
      [-34, 8],
      [-20, 8],
      [-20, 195],
      [-34, 186],
    ],
    '#a051593d',
  );
  context.strokeStyle = '#e6c893';
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(0, 91, 27, 27, 0, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.ellipse(0, 91, 34, 10, -0.3, 0, Math.PI * 2);
  context.stroke();
  polygon(
    context,
    [
      [-17, 71],
      [-22, 54],
      [-6, 62],
      [0, 45],
      [7, 62],
      [22, 54],
      [17, 71],
    ],
    '#dfc48e',
  );
  polygon(
    context,
    [
      [0, 81],
      [8, 94],
      [0, 106],
      [-8, 94],
    ],
    '#d9b17b',
  );
  context.fillStyle = '#d6b381';
  context.fillRect(-18, 144, 36, 2);
  context.fillRect(-10, 153, 20, 2);
  context.fillRect(-2, 166, 4, 4);
  context.restore();
}

export function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function polygon(context, points, fill, stroke) {
  context.beginPath();
  points.forEach(([left, top], index) =>
    index ? context.lineTo(left, top) : context.moveTo(left, top),
  );
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = 1.5;
    context.stroke();
  }
}

export function ellipse(context, left, top, width, height, fill) {
  context.fillStyle = fill;
  context.beginPath();
  context.ellipse(left, top, width, height, 0, 0, Math.PI * 2);
  context.fill();
}

export function paintBackdrop(context, width, height, theme, seed = 1) {
  const random = seeded(seed + 119);
  context.save();
  context.scale(width / 1280, height / 720);
  const gradient = context.createLinearGradient(0, 0, 0, 720);
  gradient.addColorStop(0, theme.sky);
  gradient.addColorStop(1, theme.far);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1280, 720);
  for (let index = 0; index < 140; index += 1) {
    context.globalAlpha = 0.2 + random() * 0.6;
    context.fillStyle = '#e4efe5';
    const size = random() > 0.92 ? 2 : 1;
    context.fillRect(random() * 1280, random() * 500, size, size);
  }
  context.globalAlpha = 1;
  const planet = context.createRadialGradient(850, 183, 12, 902, 215, 160);
  planet.addColorStop(0, theme.light);
  planet.addColorStop(0.8, theme.mid);
  planet.addColorStop(1, theme.far);
  ellipse(context, 914, 216, 137, 137, planet);
  context.save();
  context.translate(914, 216);
  context.rotate(-0.3);
  context.strokeStyle = theme.light;
  context.globalAlpha = 0.24;
  context.lineWidth = 8;
  context.beginPath();
  context.ellipse(0, 0, 218, 51, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();
  if (['ship', 'lab', 'throne'].includes(theme.scene)) {
    for (let index = 0; index < 5; index += 1) {
      const left = index * 310 - 40;
      polygon(
        context,
        [
          [left, 0],
          [left + 36, 0],
          [left + 70, 70],
          [left + 70, 425],
          [left + 115, 485],
          [left + 70, 490],
          [left + 24, 428],
          [left + 24, 69],
        ],
        theme.sky,
        theme.mid,
      );
      context.fillStyle = theme.light;
      context.globalAlpha = 0.35;
      context.fillRect(left + 72, 80, 2, 333);
      context.globalAlpha = 1;
    }
    context.fillStyle = theme.far;
    context.fillRect(0, 475, 1280, 245);
    context.fillStyle = theme.mid;
    context.fillRect(0, 470, 1280, 8);
    for (let index = 0; index < 10; index += 1) {
      const left = index * 145;
      polygon(
        context,
        [
          [left, 523],
          [left + 88, 523],
          [left + 103, 573],
          [left - 13, 573],
        ],
        theme.sky,
        theme.mid,
      );
      context.fillStyle = theme.light;
      context.globalAlpha = 0.48;
      context.fillRect(left + 10, 536, 40, 3);
      context.fillRect(left + 10, 545, 62, 2);
      context.globalAlpha = 1;
    }
  }
  if (['city', 'yard', 'relay'].includes(theme.scene)) {
    for (let index = 0; index < 24; index += 1) {
      const left = index * 62 - 30;
      const top = 210 + random() * 190;
      polygon(
        context,
        [
          [left, 520],
          [left, top + 15],
          [left + 20, top],
          [left + 56, top + 15],
          [left + 56, 520],
        ],
        index % 2 ? theme.far : theme.mid,
      );
      for (let row = top + 32; row < 500; row += 23) {
        context.fillStyle = theme.light;
        context.globalAlpha = 0.2 + random() * 0.5;
        context.fillRect(left + 10, row, 4, 9);
        context.fillRect(left + 33, row, 4, 9);
      }
      context.globalAlpha = 1;
    }
    if (theme.scene === 'yard')
      for (let index = 0; index < 4; index += 1) {
        const left = index * 380;
        context.strokeStyle = theme.mid;
        context.lineWidth = 7;
        context.beginPath();
        context.moveTo(left + 100, 540);
        context.lineTo(left + 100, 125);
        context.lineTo(left + 350, 125);
        context.lineTo(left + 100, 190);
        context.stroke();
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(left + 330, 128);
        context.lineTo(left + 330, 326);
        context.stroke();
        polygon(
          context,
          [
            [left + 295, 320],
            [left + 362, 320],
            [left + 362, 358],
            [left + 295, 358],
          ],
          theme.far,
          theme.light,
        );
      }
    if (theme.scene === 'city') {
      context.strokeStyle = theme.light;
      context.globalAlpha = 0.5;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, 190);
      context.quadraticCurveTo(640, 430, 1280, 190);
      context.stroke();
      context.globalAlpha = 1;
      for (let index = 0; index < 18; index += 1)
        ellipse(
          context,
          index * 75,
          195 + Math.sin((index / 17) * Math.PI) * 115,
          5,
          11,
          index % 3 ? '#e8c489' : '#e98c96',
        );
    }
  }
  if (theme.scene === 'garden') {
    for (let index = 0; index < 12; index += 1) {
      const left = index * 120;
      const tall = 160 + random() * 140;
      context.strokeStyle = theme.mid;
      context.lineWidth = 13;
      context.beginPath();
      context.moveTo(left, 570);
      context.quadraticCurveTo(left + 45, 470, left + 20, tall);
      context.stroke();
      for (let branch = 0; branch < 5; branch += 1)
        ellipse(
          context,
          left + (branch % 2 ? 52 : -8),
          tall + branch * 48,
          48,
          16,
          branch % 2 ? theme.far : theme.mid,
        );
      ellipse(context, left + 21, tall, 8, 12, theme.accent);
    }
    context.fillStyle = theme.far;
    context.fillRect(0, 510, 1280, 210);
    for (let index = 0; index < 18; index += 1)
      ellipse(context, index * 81, 530, 65, 26, theme.mid);
  }
  if (theme.scene === 'web') {
    context.strokeStyle = theme.mid;
    context.lineWidth = 1;
    for (let index = 0; index < 24; index += 1) {
      const left = random() * 1280;
      const top = random() * 450;
      polygon(
        context,
        [
          [left, top - 80],
          [left + 32, top],
          [left, top + 90],
          [left - 30, top],
        ],
        theme.far,
        theme.mid,
      );
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(640, 350);
      context.stroke();
    }
  }
  if (theme.scene === 'wreck')
    for (let index = 0; index < 12; index += 1) {
      context.save();
      context.translate(random() * 1280, 240 + random() * 360);
      context.rotate(random() - 0.5);
      polygon(
        context,
        [
          [-100, -20],
          [68, -20],
          [95, 18],
          [16, 33],
          [-100, 22],
        ],
        theme.far,
        theme.mid,
      );
      context.fillStyle = theme.light;
      context.globalAlpha = 0.3;
      context.fillRect(-80, -8, 55, 2);
      context.restore();
    }
  if (theme.scene === 'lab')
    for (let index = 0; index < 6; index += 1) {
      const left = index * 230 + 55;
      context.fillStyle = '#91e6d322';
      context.fillRect(left, 210, 78, 240);
      context.strokeStyle = theme.light;
      context.lineWidth = 1;
      context.strokeRect(left, 210, 78, 240);
      ellipse(context, left + 39, 330, 23, 44, '#bde7d633');
      context.fillStyle = theme.mid;
      context.fillRect(left - 8, 205, 94, 10);
      context.fillRect(left - 8, 448, 94, 12);
    }
  if (theme.scene === 'throne') {
    for (let index = 0; index < 7; index += 1) {
      context.strokeStyle = index % 2 ? theme.accent : theme.light;
      context.globalAlpha = 0.24;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(640, 265, 110 + index * 29, Math.PI, Math.PI * 2);
      context.stroke();
    }
    context.globalAlpha = 1;
  }
  if (['ship', 'city', 'lab', 'throne'].includes(theme.scene)) {
    paintImperialStandard(context, 198, 58, 0.78);
    paintImperialStandard(context, 1100, 58, 0.78);
    context.fillStyle = '#ba6b6c77';
    context.fillRect(0, 477, 1280, 3);
  }
  const mist = context.createLinearGradient(0, 450, 0, 720);
  mist.addColorStop(0, '#00000000');
  mist.addColorStop(1, `${theme.sky}ee`);
  context.fillStyle = mist;
  context.fillRect(0, 450, 1280, 270);
  context.restore();
}

export function startTitleArt(canvas, reducedMotion) {
  const context = canvas.getContext('2d');
  let frame;
  let last = 0;
  let disposed = false;
  const backdrop = document.createElement('canvas');
  backdrop.width = 1600;
  backdrop.height = 1000;
  paintBackdrop(
    backdrop.getContext('2d'),
    1600,
    1000,
    {
      sky: '#1b1c27',
      far: '#363342',
      mid: '#616278',
      light: '#c7d3d7',
      accent: '#efd49a',
      scene: 'ship',
    },
    21,
  );
  const render = (time) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (
      canvas.width !== Math.round(width * ratio) ||
      canvas.height !== Math.round(height * ratio)
    ) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.drawImage(backdrop, 0, 0, width, height);
    context.fillStyle = '#10272b';
    context.fillRect(0, height * 0.82, width, height * 0.18);
    context.strokeStyle = '#67877b50';
    context.lineWidth = 1;
    for (let index = -5; index < 12; index += 1) {
      context.beginPath();
      context.moveTo(width * 0.62, height * 0.75);
      context.lineTo((index * width) / 6, height);
      context.stroke();
    }
    context.fillStyle = '#88b9ac';
    context.globalAlpha = 0.23;
    context.fillRect(0, height * 0.827, width, 2);
    context.globalAlpha = 1;
    const scale = Math.min(height / 540, width > 800 ? 2 : 1.7);
    const left = width > 800 ? width * 0.74 : width * 0.83;
    const light = context.createLinearGradient(left - 100, 0, left + 120, 0);
    light.addColorStop(0, '#d7e8c400');
    light.addColorStop(0.5, '#d7e8c41a');
    light.addColorStop(1, '#d7e8c400');
    context.fillStyle = light;
    context.fillRect(left - 120, 0, 240, height * 0.83);
    paintHoshi(context, left, height * 0.83 - 310 * scale, scale);
    polygon(
      context,
      [
        [width * 0.84, height * 0.82],
        [width * 0.87, height * 0.65],
        [width, height * 0.65],
        [width, height],
      ],
      '#142c30',
      '#516b6b',
    );
    polygon(
      context,
      [
        [width * 0.87, height * 0.65],
        [width * 0.89, height * 0.61],
        [width, height * 0.61],
        [width, height * 0.65],
      ],
      '#3d5d57',
      '#839b83',
    );
    context.fillStyle = '#d3b884';
    context.fillRect(width * 0.9, height * 0.625, width * 0.065, 2);
    context.fillStyle = '#80d3c4';
    context.fillRect(width * 0.9, height * 0.639, width * 0.042, 2);
    if (!reducedMotion()) {
      const random = seeded(818);
      for (let index = 0; index < 20; index += 1) {
        const starX = (random() * width + time * 0.003 * ((index % 3) + 1)) % width;
        const starY = random() * height * 0.75 + Math.sin(time * 0.0005 + index) * 8;
        context.globalAlpha = 0.1 + (Math.sin(time * 0.001 + index) + 1) * 0.15;
        ellipse(context, starX, starY, 1, 1, '#e2eac4');
      }
      context.globalAlpha = 1;
    }
  };
  const animate = (time) => {
    if (disposed) return;
    if (time - last > 70 && !canvas.closest('[hidden]')) {
      last = time;
      render(time);
    }
    frame = requestAnimationFrame(animate);
  };
  render(0);
  frame = requestAnimationFrame(animate);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
  };
}

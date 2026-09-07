const paths = new Map();

function shape(context, outline, fill, stroke, width = 1.4) {
  if (!paths.has(outline)) paths.set(outline, new Path2D(outline));
  const path = paths.get(outline);
  if (fill) {
    context.fillStyle = fill;
    context.fill(path);
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.stroke(path);
  }
}

function gradient(context, left, top, right, bottom, colors) {
  const fill = context.createLinearGradient(left, top, right, bottom);
  colors.forEach((color, index) => fill.addColorStop(index / (colors.length - 1), color));
  return fill;
}

function leg(context, left, stride, near) {
  context.save();
  context.translate(left, 177);
  context.rotate(stride * 0.16);
  const fabric = gradient(
    context,
    -16,
    0,
    19,
    0,
    near ? ['#373748', '#464455', '#242736'] : ['#232936', '#343645', '#1c2430'],
  );
  shape(
    context,
    'M-16 0 Q-21 25-16 55 L-10 102 Q-1 108 14 103 L17 52 Q21 24 14 0 Z',
    fabric,
    '#5e6571',
  );
  shape(context, 'M-10 8 L-10 31 Q0 34 9 30 L10 8 Z', '#2c303e', '#687581', 1);
  shape(context, 'M-7 11 L5 11 M-6 39 L-5 69 M-9 80 Q0 84 11 80', null, '#777f8755', 1);
  shape(
    context,
    'M-10 95 Q1 98 13 95 L15 119 L18 128 Q0 134-34 129 L-35 124 Q-31 119-13 118 Z',
    '#192430',
    '#71858d',
  );
  shape(context, 'M-31 127 Q-7 131 17 126 M-9 105 L11 105', null, '#91a4a755', 1.2);
  context.restore();
}

function arm(context, left, top, swing, near) {
  context.save();
  context.translate(left, top);
  context.rotate(swing);
  const fabric = gradient(
    context,
    -12,
    0,
    15,
    60,
    near ? ['#454251', '#373745', '#272d3a'] : ['#2d3140', '#252b39', '#1d2733'],
  );
  shape(
    context,
    'M-9-4 Q4-12 13 1 Q20 22 12 48 L7 82 Q-3 88-13 81 L-10 46 Q-17 20-9-4 Z',
    fabric,
    '#697984',
  );
  shape(context, 'M-11 78 Q-2 83 8 79 L8 87 Q0 91-12 85 Z', '#303441', '#899a9c', 1);
  shape(context, 'M-11 86 L7 89 L6 102 Q3 107-2 103 Q-7 106-12 98 Z', '#d1a88d', '#937d72', 1);
  shape(context, 'M-9 18 Q2 22 15 16 M-10 21 Q3 25 15 19', null, '#437d83', 2.1);
  if (near) {
    shape(context, 'M-7 29 Q2 23 10 29 L10 46 Q3 54-6 47 Z', '#263c50', '#afb8b4', 1.5);
    shape(context, 'M-4 30 Q2 26 8 30 M-5 45 Q2 50 8 44', null, '#b58b82', 1.6);
    shape(context, 'M2 30 L5 39 L2 45 L-1 39 Z M-3 37 L7 37', null, '#a8c6cf', 1);
  }
  context.restore();
}

export function paintHoshi(context, left, top, scale = 1, pose = 0) {
  context.save();
  context.translate(left, top);
  context.scale(scale, scale);
  context.lineJoin = 'round';
  context.lineCap = 'round';
  const stride = Math.sin(pose);
  shape(context, 'M-51 311 A54 7 0 1 0 57 311 A54 7 0 1 0-51 311', '#06101455');
  leg(context, -12, -stride, false);
  leg(context, 17, stride, true);
  context.translate(-Math.abs(stride) * 1.5, -Math.abs(stride) * 1.2);
  arm(context, -28, 90, stride * 0.2 + 0.09, false);
  shape(
    context,
    'M-13 53 L17 52 Q16 68 23 80 L3 96 L-19 79 Q-9 66-13 53 Z',
    gradient(context, -14, 60, 20, 76, ['#ab8171', '#d7b294', '#a17769']),
    '#7e685f',
  );
  const jacket = gradient(context, -40, 85, 43, 169, ['#484452', '#373543', '#242938']);
  shape(
    context,
    'M-20 77 Q-38 81-40 101 L-29 137 Q-29 155-31 172 Q-11 187 29 175 L29 146 Q34 125 40 107 Q37 87 17 78 L0 93 Z',
    jacket,
    '#73828b',
  );
  shape(context, 'M-26 90 Q-34 110-23 131 L-22 165 Q-12 170-6 169 L-5 96 Z', '#4d495730');
  shape(
    context,
    'M15 86 Q27 100 25 120 L18 149 L21 173 L30 174 L29 146 Q35 121 38 106 Z',
    '#14243155',
  );
  shape(context, 'M-39 100 L-20 96 L-10 84 M13 83 L5 102 Q21 114 35 114', null, '#467e85', 3);
  shape(context, 'M-38 103 L-19 99 M5 105 Q18 118 35 117', null, '#82b2ad66', 0.9);
  shape(context, 'M-5 92 Q-12 123-9 169', null, '#171d2a', 3.5);
  shape(context, 'M-6 94 Q-12 127-10 167', null, '#7b8993', 0.85);
  shape(context, 'M13 118 L7 145 M14 117 L17 120 L13 124 L11 121 Z', null, '#8c9b9d', 1.4);
  shape(context, 'M-30 168 Q-4 180 29 169 L29 181 Q1 191-32 181 Z', '#343441', '#6b7680', 1);
  shape(context, 'M-28 173 Q-3 184 25 174 M-27 177 Q-2 188 25 178', null, '#909a994d', 0.8);
  shape(context, 'M-30 116 L-27 111 L-25 112 L-28 118 Z', '#dedad0');
  arm(context, 32, 92, -stride * 0.2 - 0.05, true);
  shape(context, 'M-19 69 L-3 75 L-9 93 L-24 85 Z', '#30323f', '#777d86');
  shape(context, 'M3 74 L24 65 L26 82 L-2 102 L-5 86 Z', '#3a3646', '#8b9398');
  shape(
    context,
    'M-19 74 L-8 79 M-20 78 L-10 84 M3 81 L21 72 M2 86 L22 77 M0 91 L20 82',
    null,
    '#82859077',
    0.8,
  );
  shape(
    context,
    'M23 19 Q44 21 46 37 Q49 51 34 56 L22 47 Z',
    gradient(context, 22, 23, 44, 50, ['#253039', '#141e29', '#0f1a24']),
    '#5b686f',
  );
  shape(context, 'M32 27 Q46 34 38 48 M30 31 Q42 37 35 49', null, '#82909355', 1);
  const skin = gradient(context, -31, 16, 30, 55, ['#e7c5a3', '#d9b18f', '#b18776']);
  shape(
    context,
    'M-25 10 Q-13-2 5 0 Q29 3 28 27 L24 46 Q16 61 0 66 Q-11 64-18 56 L-25 44 L-31 42 Q-34 39-29 34 L-28 27 Q-32 17-25 10 Z',
    skin,
    '#b18e7b',
    1,
  );
  shape(context, 'M11 9 Q29 10 26 31 L21 45 Q11 59-1 65 Q15 62 25 45 L28 25 Z', '#84605e44');
  shape(context, 'M-24 16 Q-14 8-2 11 Q-10 17-13 25 L-25 28 Z', '#f6dcbb55');
  shape(context, 'M-22 39 Q-13 34-6 42 Q-13 49-21 46 Z', '#f1c5a04d');
  shape(context, 'M22 28 Q29 21 31 31 Q32 42 23 45 L20 41 Z', '#d4ab91', '#ae8777', 0.9);
  shape(context, 'M25 29 Q29 29 26 36 L23 40', null, '#977364', 0.8);
  const hair = gradient(context, -22, -10, 32, 28, ['#101b27', '#26303a', '#111d27']);
  shape(
    context,
    'M-29 20 Q-34 4-24-6 Q-12-17 8-13 Q30-11 33 7 L31 29 L25 34 L23 17 Q19 6 7 2 Q-4-3-15 5 Q-25 10-29 20 Z',
    hair,
    '#5a646b',
    1,
  );
  shape(
    context,
    'M-27 9 Q-24-1-15-5 M-22 8 Q-19-3-6-8 M-16 5 Q-9-6 2-8 M-8 1 Q4-6 13-5 M2 0 Q16-3 23 4 M10 3 Q23 6 27 18',
    null,
    '#82878855',
    0.9,
  );
  shape(context, 'M-30 18 Q-25 8-16 5 M23 17 L25 30', null, '#a0a29955', 1);
  shape(context, 'M-27 24 Q-21 20-15 24 M-7 22 Q1 17 10 23', null, '#453735', 2.1);
  shape(context, 'M-27 30 Q-22 25-15 30 Q-20 34-26 32 Z', '#eee0cb');
  shape(context, 'M-8 29 Q0 23 10 28 Q3 35-6 32 Z', '#f2e4d0');
  shape(context, 'M-24 27 Q-27 31-22 33 Q-17 32-20 27 Z', '#4b3933');
  shape(context, 'M-3 26 Q-7 31-1 33 Q5 32 2 26 Z', '#493630');
  shape(context, 'M-22 28 L-22 31 M-1 27 L-1 31', null, '#171d22', 1.6);
  shape(context, 'M-27 30 Q-22 25-15 30 M-8 29 Q0 23 10 28', null, '#4a3938', 1.3);
  shape(context, 'M-23 28 L-22 28 M-1 27 L0 27', null, '#fff4da', 0.8);
  shape(context, 'M-17 30 Q-18 35-21 40 Q-18 43-13 41', null, '#a57864', 1);
  shape(context, 'M-28 41 Q-25 43-22 41', null, '#b1846c', 0.8);
  shape(context, 'M-21 50 Q-16 47-12 49 Q-8 46-3 49 Q-10 53-21 50 Z', '#ae7469');
  shape(context, 'M-21 50 Q-12 59-3 49 Q-11 54-21 50 Z', '#cb9280');
  shape(context, 'M-21 50 Q-12 52-3 49', null, '#885950', 0.9);
  shape(context, 'M-14 54 L-9 54 M-10 60 Q-3 64 4 59', null, '#eed1b155', 0.8);
  context.restore();
}

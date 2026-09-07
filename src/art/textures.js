import { paintHoshi, paintBackdrop, polygon, ellipse } from './illustration.js';

function texture(scene, key, width, height, paint) {
  if (scene.textures.exists(key)) return;
  const surface = scene.textures.createCanvas(key, width, height);
  paint(surface.context);
  surface.refresh();
}

export function createTextures(scene) {
  for (let frame = 0; frame < 7; frame += 1)
    texture(scene, `hoshi-${frame}`, 80, 128, (context) =>
      paintHoshi(context, 42, 16, 0.36, frame === 0 ? 0 : ((frame - 1) / 6) * Math.PI * 2),
    );
  texture(scene, 'spark', 16, 16, (context) => {
    const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#ffffffdd');
    gradient.addColorStop(1, '#ffffff00');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, 16);
  });
  texture(scene, 'star', 28, 36, (context) => {
    polygon(
      context,
      [
        [14, 1],
        [20, 13],
        [27, 18],
        [20, 23],
        [14, 35],
        [8, 23],
        [1, 18],
        [8, 13],
      ],
      '#f6d38e',
      '#fff3c8',
    );
    polygon(
      context,
      [
        [14, 6],
        [14, 30],
        [8, 18],
      ],
      '#ffffff88',
    );
  });
  texture(scene, 'relay', 66, 86, (context) => {
    polygon(
      context,
      [
        [12, 84],
        [12, 70],
        [22, 63],
        [22, 38],
        [44, 38],
        [44, 63],
        [54, 70],
        [54, 84],
      ],
      '#233a43',
      '#849d97',
    );
    polygon(
      context,
      [
        [33, 2],
        [60, 30],
        [33, 59],
        [6, 30],
      ],
      '#182e39',
      '#d3e5d3',
    );
    polygon(
      context,
      [
        [33, 12],
        [50, 30],
        [33, 48],
        [16, 30],
      ],
      '#edf3e3',
    );
    context.fillStyle = '#a2c3b6';
    context.fillRect(23, 75, 20, 3);
  });
  texture(scene, 'terminal', 74, 95, (context) => {
    polygon(
      context,
      [
        [10, 95],
        [20, 70],
        [25, 32],
        [57, 32],
        [59, 72],
        [71, 95],
      ],
      '#2a4049',
      '#7a9996',
    );
    polygon(
      context,
      [
        [4, 8],
        [61, 8],
        [71, 53],
        [14, 53],
      ],
      '#152e37',
      '#9bc9bc',
    );
    context.fillStyle = '#8bd8c9';
    context.fillRect(16, 18, 31, 3);
    context.fillRect(18, 27, 39, 2);
    context.fillRect(20, 37, 22, 2);
  });
  texture(scene, 'drone', 70, 56, (context) => {
    ellipse(context, 35, 46, 15, 4, '#8de2d377');
    polygon(
      context,
      [
        [7, 16],
        [23, 8],
        [47, 8],
        [63, 16],
        [61, 34],
        [49, 43],
        [21, 43],
        [9, 34],
      ],
      '#49656c',
      '#a6c8bc',
    );
    polygon(
      context,
      [
        [17, 18],
        [53, 18],
        [49, 32],
        [21, 32],
      ],
      '#142c36',
    );
    ellipse(context, 28, 25, 3, 3, '#f3d696');
    ellipse(context, 43, 25, 3, 3, '#f3d696');
    context.strokeStyle = '#c4ceab';
    context.beginPath();
    context.moveTo(28, 36);
    context.quadraticCurveTo(35, 40, 43, 36);
    context.stroke();
  });
  texture(scene, 'moth', 74, 64, (context) => {
    polygon(
      context,
      [
        [35, 27],
        [9, 4],
        [2, 25],
        [27, 42],
        [35, 59],
        [44, 42],
        [71, 25],
        [63, 4],
      ],
      '#83b6b5',
      '#d4efe2',
    );
    polygon(
      context,
      [
        [36, 11],
        [45, 31],
        [36, 55],
        [27, 31],
      ],
      '#d7aed0',
      '#eee0cf',
    );
    ellipse(context, 35, 25, 3, 3, '#fff2ba');
  });
  texture(scene, 'crew', 65, 113, (context) => {
    polygon(
      context,
      [
        [17, 63],
        [47, 63],
        [47, 108],
        [34, 108],
        [31, 80],
        [28, 108],
        [15, 108],
      ],
      '#25363d',
      '#738b87',
    );
    polygon(
      context,
      [
        [16, 32],
        [47, 32],
        [56, 70],
        [45, 74],
        [40, 58],
        [40, 76],
        [19, 76],
        [19, 50],
        [13, 74],
        [3, 69],
      ],
      '#658c8a',
      '#c0cec0',
    );
    ellipse(context, 31, 22, 13, 17, '#d0ab91');
    polygon(
      context,
      [
        [17, 19],
        [17, 7],
        [26, 1],
        [43, 7],
        [46, 24],
        [36, 13],
        [20, 15],
      ],
      '#23313c',
    );
    context.fillStyle = '#e5d08a';
    context.fillRect(22, 37, 19, 4);
    ellipse(context, 26, 23, 1, 1, '#14232c');
    ellipse(context, 35, 23, 1, 1, '#14232c');
  });
  texture(scene, 'portal', 126, 176, (context) => {
    polygon(
      context,
      [
        [6, 176],
        [6, 38],
        [33, 6],
        [93, 6],
        [120, 38],
        [120, 176],
        [101, 176],
        [101, 44],
        [86, 27],
        [40, 27],
        [25, 45],
        [25, 176],
      ],
      '#37545c',
      '#adc7b2',
    );
    context.fillStyle = '#8ee0d344';
    context.fillRect(29, 46, 67, 130);
    context.fillStyle = '#e6ca91';
    context.fillRect(47, 11, 31, 5);
    context.strokeStyle = '#96d9c6';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(45, 93);
    context.lineTo(78, 112);
    context.lineTo(45, 131);
    context.stroke();
  });
  texture(scene, 'artifact', 65, 80, (context) => {
    ellipse(context, 32, 62, 27, 8, '#83d8c62a');
    polygon(
      context,
      [
        [32, 2],
        [53, 25],
        [44, 54],
        [20, 54],
        [11, 25],
      ],
      '#c4e6d4',
      '#fff2c7',
    );
    polygon(
      context,
      [
        [32, 2],
        [32, 53],
        [11, 25],
      ],
      '#81a8b1',
    );
    polygon(
      context,
      [
        [7, 69],
        [57, 69],
        [61, 79],
        [3, 79],
      ],
      '#314850',
      '#94afa2',
    );
  });
}

export function createWorldTextures(scene, theme) {
  for (const key of ['world-back', 'floor-tile'])
    if (scene.textures.exists(key)) scene.textures.remove(key);
  texture(scene, 'world-back', 1600, 900, (context) =>
    paintBackdrop(context, 1600, 900, theme, scene.level.id + 20),
  );
  texture(scene, 'floor-tile', 128, 112, (context) => {
    context.fillStyle = theme.floor;
    context.fillRect(0, 0, 128, 112);
    context.fillStyle = theme.mid;
    context.fillRect(0, 0, 128, 12);
    context.fillStyle = theme.light;
    context.fillRect(0, 0, 128, 3);
    context.strokeStyle = '#00000030';
    context.strokeRect(5, 18, 116, 74);
    context.fillStyle = '#081e2a66';
    context.fillRect(15, 30, 58, 4);
    context.fillRect(15, 42, 58, 4);
    context.fillRect(15, 54, 58, 4);
    context.fillStyle = theme.accent;
    context.fillRect(100, 28, 4, 17);
    context.fillStyle = '#dce7d355';
    context.fillRect(8, 20, 3, 3);
    context.fillRect(114, 80, 3, 3);
  });
}

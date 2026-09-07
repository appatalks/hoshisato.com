import '../travel.css';
import { THEMES } from '../data/campaign.js';
import { seeded, polygon, ellipse } from '../art/illustration.js';

export class TravelSequence {
  constructor(app) {
    this.app = app;
    this.dialog = document.createElement('dialog');
    this.dialog.id = 'travel-screen';
    this.dialog.setAttribute('aria-labelledby', 'travel-destination');
    this.dialog.innerHTML =
      '<canvas id="travel-art" aria-label="Original illustration of an imperial shuttle approaching its destination"></canvas><div class="travel-top"><span>IMPERIAL TRANSIT / AUTHORITY: EMPRESS SATO</span><span id="travel-stage"></span></div><div class="travel-copy"><p id="travel-place"></p><h2 id="travel-destination"></h2><p id="travel-message"></p></div><div class="travel-bottom"><span id="travel-origin"></span><button class="secondary-button" id="skip-travel">Skip arrival <span aria-hidden="true">&gt;</span></button></div>';
    document.body.append(this.dialog);
    this.canvas = this.dialog.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.dialog.querySelector('#skip-travel').addEventListener('click', () => this.finish());
    this.dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.finish();
    });
    this.dialog.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        this.finish();
      }
    });
  }
  play(destination) {
    this.finish();
    this.destination = destination;
    this.started = performance.now();
    this.reduced = this.app.store.data.settings.reducedMotion;
    this.duration = this.reduced ? 1200 : 3400;
    this.dialog.querySelector('#travel-place').textContent = destination.place;
    this.dialog.querySelector('#travel-destination').textContent = destination.title;
    this.dialog.querySelector('#travel-message').textContent =
      destination.id === -1
        ? 'The bridge recognizes your command. Welcome aboard, Empress.'
        : 'The Empire may dispute the crown. It will not close the sky.';
    this.dialog.querySelector('#travel-origin').textContent =
      destination.id === -1
        ? 'COURSE SET / THE DEFIANT'
        : `${destination.collection === 'away' ? 'AWAY TEAM / PLANETFALL' : destination.collection === 'shuttle' ? 'MIRROR ENTERPRISE / LAUNCH' : 'THE DEFIANT / DESTINATION'} ${String(destination.id + 1).padStart(2, '0')}`;
    this.dialog.showModal();
    this.dialog.querySelector('#skip-travel').focus();
    this.app.audio.suspend(false);
    this.app.audio.cue('door');
    this.timer = setTimeout(() => this.finish(), this.duration);
    this.frame = requestAnimationFrame((time) => this.draw(time));
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  draw(time) {
    if (!this.dialog.open) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    if (
      this.canvas.width !== Math.round(width * ratio) ||
      this.canvas.height !== Math.round(height * ratio)
    ) {
      this.canvas.width = width * ratio;
      this.canvas.height = height * ratio;
    }
    const context = this.context;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const progress = Math.min(1, (time - this.started) / this.duration);
    const motion = this.reduced ? 0.75 : progress;
    const theme = THEMES[this.destination.theme];
    context.fillStyle = '#0b111b';
    context.fillRect(0, 0, width, height);
    const sky = context.createLinearGradient(0, 0, width, height);
    sky.addColorStop(0, '#15121e');
    sky.addColorStop(1, theme.far);
    context.fillStyle = sky;
    context.fillRect(0, height * 0.09, width, height * 0.82);
    const random = seeded(this.destination.id + 928);
    const speed = Math.sin(motion * Math.PI);
    for (let index = 0; index < 130; index += 1) {
      const left = (random() * width + motion * width * (1 + (index % 3))) % width;
      const top = height * (0.13 + random() * 0.72);
      context.strokeStyle = index % 4 ? '#c6dbe677' : '#e9c69d99';
      context.lineWidth = index % 8 ? 1 : 2;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left - (this.reduced ? 2 : 2 + speed * 58), top);
      context.stroke();
    }
    const radius = Math.min(width * 0.3, height * 0.37) * (0.85 + motion * 0.25);
    const planetX = width * 0.77;
    const planetY = height * 0.43;
    const planet = context.createRadialGradient(
      planetX - radius * 0.3,
      planetY - radius * 0.4,
      0,
      planetX,
      planetY,
      radius,
    );
    planet.addColorStop(0, theme.light);
    planet.addColorStop(0.65, theme.mid);
    planet.addColorStop(1, theme.sky);
    ellipse(context, planetX, planetY, radius, radius, planet);
    context.save();
    context.translate(planetX, planetY);
    context.rotate(-0.23);
    context.strokeStyle = `${theme.accent}55`;
    context.lineWidth = 7;
    context.beginPath();
    context.ellipse(0, 0, radius * 1.7, radius * 0.22, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
    context.save();
    context.translate(width * (0.22 + motion * 0.2), height * 0.42);
    const scale = Math.min(width / 850, height / 440) * (1 - motion * 0.28);
    context.scale(scale, scale);
    polygon(
      context,
      [
        [-94, -8],
        [-48, -20],
        [27, -16],
        [105, 0],
        [27, 17],
        [-48, 22],
        [-94, 8],
      ],
      '#7f929e',
      '#c2d4d7',
    );
    polygon(
      context,
      [
        [-67, -17],
        [-31, -52],
        [5, -52],
        [20, -16],
      ],
      '#3d515f',
      '#a2bec5',
    );
    polygon(
      context,
      [
        [-67, 18],
        [-31, 53],
        [5, 53],
        [20, 17],
      ],
      '#3d515f',
      '#a2bec5',
    );
    polygon(
      context,
      [
        [-60, -55],
        [20, -55],
        [36, -48],
        [19, -42],
        [-65, -43],
      ],
      '#7a919d',
      '#afcbd1',
    );
    polygon(
      context,
      [
        [-60, 44],
        [20, 44],
        [36, 51],
        [19, 57],
        [-65, 56],
      ],
      '#7a919d',
      '#afcbd1',
    );
    polygon(
      context,
      [
        [-73, -5],
        [30, -5],
        [60, 0],
        [30, 5],
        [-73, 5],
      ],
      '#8b4256',
    );
    context.fillStyle = '#b5e4e9';
    context.fillRect(-67, -52, 8, 7);
    context.fillRect(-67, 47, 8, 7);
    context.strokeStyle = '#e8c384';
    context.lineWidth = 2;
    context.strokeRect(-13, -10, 21, 20);
    context.restore();
    this.dialog.querySelector('#travel-stage').textContent =
      progress < 0.28
        ? 'DEPARTURE CLEARED'
        : progress < 0.76
          ? 'CROSSING THE MIRROR'
          : 'APPROACH CONFIRMED';
    const pad = Array.from(navigator.getGamepads?.() || []).find((entry) => entry?.connected);
    if (pad?.buttons[0]?.pressed || pad?.buttons[9]?.pressed) {
      this.finish();
      return;
    }
    this.frame = requestAnimationFrame((next) => this.draw(next));
  }
  finish() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
    if (this.dialog.open) this.dialog.close();
    const resolve = this.resolve;
    this.resolve = null;
    resolve?.();
  }
}

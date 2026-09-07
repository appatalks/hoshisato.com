import '../easter-eggs.css';
import { EASTER_EGGS, KonamiSequence, easterEggContext } from '../data/easter-eggs.js';
import { drawEasterEgg } from '../art/easter-eggs.js';

export class EasterEggs {
  constructor(app) {
    this.app = app;
    this.sequence = new KonamiSequence();
    this.active = null;
    this.abort = new AbortController();
    this.overlay = document.createElement('div');
    this.overlay.id = 'easter-egg';
    this.overlay.hidden = true;
    this.overlay.innerHTML =
      '<canvas aria-hidden="true"></canvas><aside class="secret-announcement" role="status" aria-live="polite"><span>IMPERIAL FREQUENCY / UNLISTED</span><strong></strong><p></p></aside>';
    document.querySelector('#experience').append(this.overlay);
    this.canvas = this.overlay.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    window.addEventListener('keydown', (event) => this.key(event), {
      capture: true,
      signal: this.abort.signal,
    });
    window.addEventListener('blur', () => this.sequence.reset(), { signal: this.abort.signal });
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) this.clear();
      },
      { signal: this.abort.signal },
    );
  }
  key(event) {
    if (event.repeat || event.isComposing) return;
    if (
      this.app.starting ||
      this.app.travel.dialog.open ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.target?.closest?.(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
      )
    ) {
      this.sequence.reset();
      return;
    }
    const location = easterEggContext(this.app.scene);
    if (this.sequenceScene !== this.app.scene || this.sequenceLocation !== location)
      this.sequence.reset();
    this.sequenceScene = this.app.scene;
    this.sequenceLocation = location;
    if (!this.sequence.push(event.code, performance.now())) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.app.input.clear();
    this.trigger(location);
  }
  trigger(location) {
    this.clear();
    const egg = EASTER_EGGS[location];
    const earned =
      Number(this.app.store.add('achievements', 'konami')) +
      Number(this.app.store.add('achievements', egg.achievement));
    const state = {
      location,
      egg,
      scene: this.app.scene,
      started: performance.now(),
      duration: 8500,
    };
    this.active = state;
    this.overlay.hidden = false;
    this.overlay.dataset.egg = location;
    this.overlay.style.setProperty('--secret-color', egg.color);
    this.overlay.querySelector('.secret-announcement > span').textContent = earned
      ? `${earned} ACHIEVEMENT${earned === 1 ? '' : 'S'} EARNED / UNLISTED FREQUENCY`
      : 'IMPERIAL FREQUENCY / UNLISTED';
    this.overlay.querySelector('strong').textContent = egg.title;
    this.overlay.querySelector('p').textContent = egg.message;
    if (this.app.ui.panel.open) {
      if (document.querySelector('#panel-title').textContent === 'Achievements')
        this.app.ui.achievements();
      const note = document.createElement('p');
      note.className = 'secret-menu-note';
      note.setAttribute('role', 'status');
      note.textContent = `${egg.title}. ${egg.message}`;
      document.querySelector('#panel-content').prepend(note);
    }
    this.app.audio
      .start()
      .then(() => {
        if (this.active === state) this.app.audio.cue(location === 'hub' ? 'chorus' : 'secret');
      })
      .catch(() => {});
    this.timer = setTimeout(() => this.clear(), state.duration);
    let lastFrame = -Infinity;
    const frame = (time) => {
      if (this.active !== state) return;
      if (
        this.app.starting ||
        state.scene !== this.app.scene ||
        (state.scene && !state.scene.sys.isActive() && !state.scene.sys.isPaused())
      ) {
        this.clear();
        return;
      }
      if (time - lastFrame >= 1000 / 30) {
        drawEasterEgg(this.canvas, this.context, state, this.app, time);
        lastFrame = time;
      }
      this.frame = requestAnimationFrame(frame);
    };
    this.frame = requestAnimationFrame(frame);
  }
  clear() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
    this.active = null;
    this.sequence.reset();
    this.overlay.hidden = true;
    delete this.overlay.dataset.egg;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.querySelectorAll('.secret-menu-note').forEach((note) => note.remove());
  }
  destroy() {
    this.clear();
    this.abort.abort();
    this.overlay.remove();
  }
}

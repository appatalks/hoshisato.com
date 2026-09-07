const BINDINGS = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowUp: 'up',
  KeyW: 'up',
  Space: 'jump',
  KeyE: 'interact',
  KeyF: 'signal',
  KeyQ: 'cycle',
  ShiftLeft: 'dash',
  ShiftRight: 'dash',
  KeyR: 'shield',
  Escape: 'pause',
  KeyM: 'map',
  KeyH: 'hub',
};

export class InputController {
  constructor(app) {
    this.app = app;
    this.held = new Set();
    this.pressed = new Set();
    this.touch = new Set();
    this.padPrevious = [];
    this.abort = new AbortController();
    const options = { signal: this.abort.signal };
    window.addEventListener(
      'keydown',
      (event) => {
        const action = BINDINGS[event.code];
        if (!action || !app.scene || app.ui.panel.open || app.starting) return;
        event.preventDefault();
        if (!this.held.has(action) && !event.repeat) this.pressed.add(action);
        if (action === 'jump' && this.held.has('down') && !event.repeat) this.pressed.add('drop');
        this.held.add(action);
      },
      options,
    );
    window.addEventListener(
      'keyup',
      (event) => {
        const action = BINDINGS[event.code];
        if (action) this.held.delete(action);
      },
      options,
    );
    window.addEventListener('blur', () => this.clear(), options);
    document.querySelectorAll('[data-touch]').forEach((button) => {
      const action = button.dataset.touch;
      button.addEventListener(
        'pointerdown',
        (event) => {
          event.preventDefault();
          button.setPointerCapture(event.pointerId);
          this.touch.add(action);
          this.pressed.add(action);
          if (action === 'jump' && (this.touch.has('down') || this.held.has('down')))
            this.pressed.add('drop');
          button.classList.add('active');
        },
        options,
      );
      const release = () => {
        this.touch.delete(action);
        button.classList.remove('active');
      };
      button.addEventListener('pointerup', release, options);
      button.addEventListener('pointercancel', release, options);
      button.addEventListener('lostpointercapture', release, options);
    });
  }
  sample() {
    const pad = Array.from(navigator.getGamepads?.() || []).find(
      (entry) => entry?.connected && entry.mapping === 'standard',
    );
    const buttons = pad?.buttons.map((button) => button.pressed) || [];
    const padMap = { jump: 0, dash: 1, signal: 2, interact: 3, cycle: 5, shield: 6, pause: 9 };
    const down = (action) =>
      this.held.has(action) || this.touch.has(action) || Boolean(buttons[padMap[action]]);
    const just = (action) =>
      this.pressed.has(action) || (buttons[padMap[action]] && !this.padPrevious[padMap[action]]);
    const axis = pad?.axes[0] || 0;
    const horizontal =
      Math.abs(axis) > 0.2
        ? axis
        : Number(Boolean(down('right') || buttons[15])) -
          Number(Boolean(down('left') || buttons[14]));
    const verticalAxis = pad?.axes[1] || 0;
    const vertical =
      Math.abs(verticalAxis) > 0.2
        ? verticalAxis
        : Number(Boolean(down('down') || buttons[13])) - Number(Boolean(down('up') || buttons[12]));
    const state = {
      horizontal,
      vertical,
      down: down('down') || buttons[13] || (pad?.axes[1] || 0) > 0.6,
      up: down('up') || buttons[12] || verticalAxis < -0.6,
      jump: down('jump'),
      signal: down('signal'),
      dropPressed:
        this.pressed.has('drop') ||
        (just('jump') && (down('down') || buttons[13] || (pad?.axes[1] || 0) > 0.6)),
      aimX: pad?.axes[2] || 0,
      aimY: pad?.axes[3] || 0,
    };
    for (const action of ['jump', 'dash', 'interact', 'cycle', 'shield', 'pause', 'map', 'hub'])
      state[`${action}Pressed`] = just(action);
    this.pressed.clear();
    this.padPrevious = buttons;
    return state;
  }
  clear() {
    this.held.clear();
    this.pressed.clear();
    this.touch.clear();
    document
      .querySelectorAll('[data-touch]')
      .forEach((button) => button.classList.remove('active'));
  }
  destroy() {
    this.abort.abort();
    this.clear();
  }
}

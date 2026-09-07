import './style.css';
import { SaveStore } from './systems/save.js';
import { Soundscape } from './systems/audio.js';
import { InputController } from './systems/input.js';
import { Interface } from './ui/interface.js';
import { startTitleArt } from './art/illustration.js';
import { ACHIEVEMENTS, LEVELS } from './data/campaign.js';
import { hubLevel } from './data/hub.js';
import { TravelSequence } from './systems/travel.js';
import { expedition } from './data/expeditions.js';
import { EasterEggs } from './systems/easter-eggs.js';

const store = new SaveStore();
if (!localStorageHasSave() && matchMedia('(prefers-reduced-motion: reduce)').matches)
  store.data.settings.reducedMotion = true;

function localStorageHasSave() {
  try {
    return Boolean(localStorage.getItem('hoshi-mirror-signal-v1'));
  } catch {
    return false;
  }
}

const app = {
  store,
  audio: new Soundscape(store.data.settings),
  scene: null,
  game: null,
  starting: false,
  async launch(level, hub, cinematic = true, collection = 'star') {
    if (this.starting) return;
    const destination = hub
      ? hubLevel(this.store.data)
      : collection === 'star'
        ? LEVELS[level]
        : expedition(collection, level);
    if (!destination) return;
    this.easterEggs.clear();
    this.starting = true;
    this.scene?.persist();
    if (cinematic && this.scene?.scene.isActive()) this.scene.sys.pause();
    this.input.clear();
    this.ui.loading();
    try {
      try {
        await this.audio.start();
      } catch {
        this.ui.toast('Audio is unavailable. You can still explore.');
      }
      if (cinematic && (!hub || this.scene)) await this.travel.play(destination);
      const key = collection === 'star' ? 'World' : collection === 'away' ? 'Away' : 'Flight';
      const module = await (collection === 'star'
        ? import('./game/world.js')
        : import('./game/expedition.js'));
      const Scene =
        collection === 'star'
          ? module.World
          : collection === 'away'
            ? module.AwayScene
            : module.FlightScene;
      const data = { app: this, level, hub, collection };
      document.querySelector('#game-screen').hidden = false;
      if (!this.game) {
        const { default: Phaser } = await import('phaser');
        this.game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: 'game-view',
          width: 1280,
          height: 720,
          backgroundColor: '#102328',
          scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.NO_CENTER },
          physics: {
            default: 'arcade',
            arcade: { gravity: { y: 1100 }, debug: false, fixedStep: true },
          },
          render: { antialias: true, roundPixels: true, powerPreference: 'low-power' },
          audio: { noAudio: true },
          fps: { target: 60, forceSetTimeOut: false },
          banner: false,
          callbacks: {
            postBoot: (game) => {
              game.scene.add(key, Scene, true, data);
            },
          },
        });
        this.resizeObserver = new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          if (
            width > 0 &&
            height > 0 &&
            this.game.isBooted &&
            (this.game.scale.width !== Math.round(width) ||
              this.game.scale.height !== Math.round(height))
          )
            this.game.scale.resize(Math.round(width), Math.round(height));
        });
        this.resizeObserver.observe(document.querySelector('#game-view'));
      } else {
        const previous = this.scene?.sys.settings.key;
        if (previous) this.game.scene.stop(previous);
        if (!this.game.scene.keys[key]) this.game.scene.add(key, Scene, false);
        this.game.scene.start(key, data);
      }
    } catch (error) {
      console.error('The Mirror Signal could not start:', error);
      document.querySelector('#loading').hidden = true;
      document.querySelector('#game-screen').hidden = true;
      this.ui.show(
        'A Signal Interrupted',
        '<p>The game could not start. Check that JavaScript and canvas are enabled, then reload the page. Your saved discoveries are still safe.</p>',
      );
    } finally {
      this.starting = false;
    }
  },
  play() {
    const collection = this.store.data.activeCollection;
    if (collection !== 'star') {
      const checkpoint = this.store.data[collection].checkpoint;
      return checkpoint ? this.startExpedition(collection, checkpoint.level) : this.startHub();
    }
    return this.store.data.checkpoint ? this.startLevel(this.store.data.current) : this.startHub();
  },
  startHub() {
    return this.launch(0, true);
  },
  startLevel(level) {
    if (!Number.isInteger(level) || level < 0 || level > 9) return;
    if (this.store.data.checkpoint?.level !== level) this.store.data.checkpoint = null;
    return this.launch(level, false);
  },
  startExpedition(collection, level) {
    if (
      !['away', 'shuttle'].includes(collection) ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 9
    )
      return;
    return this.launch(level, false, true, collection);
  },
  restart() {
    if (!this.scene) return;
    return this.launch(
      this.scene.isHub ? 0 : this.scene.level.id,
      this.scene.isHub,
      false,
      this.scene.collection || 'star',
    );
  },
  toTitle() {
    this.easterEggs.clear();
    this.scene?.persist();
    this.ui.close(false);
    if (this.scene) this.game.scene.stop(this.scene.sys.settings.key);
    this.scene = null;
    document.body.dataset.mode = 'star';
    this.input.clear();
    document.querySelector('#title-screen').hidden = false;
    document.querySelector('#game-screen').hidden = true;
    document.querySelector('#loading').hidden = true;
    this.audio.suspend(false);
    this.ui.title();
  },
  achievement(id) {
    if (this.store.add('achievements', id)) this.ui.toast(`Discovery: ${ACHIEVEMENTS[id][0]}`);
  },
};

app.ui = new Interface(app);
app.input = new InputController(app);
app.travel = new TravelSequence(app);
app.easterEggs = new EasterEggs(app);
app.ui.applySettings();
const stopArt = startTitleArt(
  document.querySelector('#title-art'),
  () => store.data.settings.reducedMotion,
);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (app.scene && !app.ui.panel.open && !app.starting) app.ui.pause();
    app.audio.suspend(true);
  } else if (!app.ui.panel.open) app.audio.suspend(false);
});
window.addEventListener('pagehide', () => {
  app.scene?.persist();
  store.write();
});
window.addEventListener('beforeunload', () => {
  app.easterEggs.destroy();
  stopArt();
  app.travel.finish();
  app.audio.destroy();
  app.input.destroy();
  app.resizeObserver?.disconnect();
  clearInterval(app.ui.menuTimer);
});

if (import.meta.env.DEV && new URLSearchParams(location.search).has('qa')) window.__mirror = app;

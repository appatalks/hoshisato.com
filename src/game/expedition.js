import Phaser from 'phaser';
import { expedition, objectiveReady } from '../data/expeditions.js';
import { createExpeditionTextures, createTerrain } from '../art/expeditions.js';
import { ExpeditionPilot } from './expedition-pilot.js';
import { ExpeditionEnvironment } from './expedition-environment.js';

class ExpeditionScene extends Phaser.Scene {
  init({ app, level, collection }) {
    this.app = app;
    this.collection = collection;
    this.level = expedition(collection, level);
    this.isHub = false;
  }
  create() {
    this.app.scene = this;
    document.body.dataset.mode = this.collection;
    this.settings = this.app.store.data.settings;
    this.finished = false;
    this.recalls = 0;
    this.scanUntil = 0;
    this.captionUntil = 0;
    this.lastHud = 0;
    this.elapsed = 0;
    this.escort = null;
    this.cargo = null;
    this.towing = false;
    const record = this.app.store.data[this.collection];
    if (record.checkpoint?.level === this.level.id) this.elapsed = record.checkpoint.elapsed || 0;
    this.completed =
      record.checkpoint?.level === this.level.id
        ? record.checkpoint.objectives.filter((index) => index < this.level.objectives.length)
        : [];
    this.completed = [...new Set(this.completed)];
    this.lastSafe = this.completed.length
      ? this.level.objectives[this.completed.at(-1)]
      : { x: this.level.start[0], y: this.level.start[1] };
    this.app.store.data.activeCollection = this.collection;
    this.physics.world.gravity.set(0, 0);
    this.physics.world.setBounds(70, 70, this.level.width - 140, this.level.height - 140);
    createExpeditionTextures(this);
    this.terrain = this.add
      .image(0, 0, createTerrain(this))
      .setOrigin(0)
      .setDisplaySize(this.level.width, this.level.height)
      .setDepth(-30);
    this.solids = this.physics.add.staticGroup();
    this.player = new ExpeditionPilot(this);
    this.player.sprite.body.reset(this.lastSafe.x, this.lastSafe.y);
    this.environment = new ExpeditionEnvironment(this);
    this.physics.add.collider(this.player.sprite, this.solids, () => {
      if (this.collection === 'shuttle') this.player.recall();
    });
    this.fx = this.add
      .particles(0, 0, 'exp-pulse', {
        emitting: false,
        lifespan: 650,
        speed: { min: 15, max: 85 },
        scale: { start: 0.7, end: 0 },
        alpha: { start: 0.7, end: 0 },
        maxParticles: 120,
        blendMode: 'ADD',
      })
      .setDepth(30);
    this.nodes = this.level.objectives.map((node, index) => {
      const flight = this.collection === 'shuttle';
      const isRing = flight && node.kind === 'ring';
      const texture = flight
        ? node.kind === 'tow' || node.kind === 'rescue'
          ? 'exp-crate'
          : 'exp-station'
        : node.kind === 'contact'
          ? 'exp-contact'
          : 'exp-landmark';
      const image = isRing
        ? this.add.circle(node.x, node.y, 62).setStrokeStyle(5, 0xe8c990, 0.8)
        : this.add.image(node.x, node.y, texture).setScale(flight ? 0.65 : 0.82);
      image.setDepth(12);
      if (!flight) image.setOrigin(0.5, 0.8);
      const name = this.add
        .text(node.x, node.y + (flight ? 90 : 35), `${index + 1} / ${node.name.toUpperCase()}`, {
          fontFamily: 'Rajdhani',
          fontSize: '17px',
          color: '#ecdfbf',
          backgroundColor: '#12222dbb',
          padding: { x: 8, y: 4 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(16);
      return { ...node, index, image, label: name };
    });
    this.home = this.add
      .image(...this.level.exit, 'exp-station')
      .setScale(0.75)
      .setDepth(14);
    this.homeLabel = this.add
      .text(
        this.level.exit[0],
        this.level.exit[1] + 83,
        this.collection === 'away' ? 'EXTRACTION BEACON' : 'RETURN DOCK',
        {
          fontFamily: 'Rajdhani',
          fontSize: '18px',
          color: '#c2e4d7',
          backgroundColor: '#132732c9',
          padding: { x: 8, y: 4 },
        },
      )
      .setOrigin(0.5)
      .setDepth(16);
    this.relic = this.add
      .image(...this.level.relic, 'exp-star')
      .setDepth(16)
      .setScale(1.3);
    this.relic.setVisible(!record.discoveries.includes(this.level.id));
    if (this.level.rule === 'tow' && this.completed.includes(0) && !this.completed.includes(1))
      this.startTow();
    if (this.level.rule === 'escort' && this.completed.includes(0) && !this.completed.includes(2))
      this.startEscort();
    this.shroud = this.add.graphics().setDepth(17);
    this.ambient = this.add
      .particles(0, 0, 'exp-pulse', {
        x: { min: 80, max: 2320 },
        y: { min: 80, max: 1720 },
        lifespan: 4200,
        frequency: 160,
        speedY: this.level.biome === 'rain' ? 130 : -8,
        speedX: this.level.biome === 'rain' ? -30 : 4,
        scale: { start: 0.22, end: 0 },
        alpha: { start: 0.35, end: 0 },
        tint: 0xc3ddd8,
        maxParticles: 35,
      })
      .setDepth(18);
    if (this.settings.reducedMotion) this.ambient.stop();
    this.app.audio.level = this.level.id + (this.collection === 'shuttle' ? 1 : 0);
    this.app.audio.hub = false;
    this.app.audio.depth = this.level.rule === 'dark';
    this.app.audio.suspend(false);
    this.resize();
    this.scale.on('resize', this.resize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.resize, this);
      this.app.input.clear();
      if (this.app.scene === this) this.app.scene = null;
    });
    this.renderHud();
    this.persist();
    this.app.ui.ready();
    this.caption(this.level.briefing, 10500);
    this.startedAt = this.time.now;
    if (!this.settings.reducedMotion) this.cameras.main.fadeIn(450, 12, 20, 30);
  }
  resize() {
    const camera = this.cameras.main;
    camera.setSize(this.scale.width, this.scale.height);
    camera.setZoom(
      Math.min(1.15, Math.max(0.48, Math.min(this.scale.width / 1050, this.scale.height / 720))),
    );
    this.frameCamera(true);
  }
  frameCamera(immediate = false) {
    const camera = this.cameras.main;
    const halfX = camera.width / camera.zoom / 2;
    const halfY = camera.height / camera.zoom / 2;
    const portrait = camera.height > camera.width;
    const verticalMargin = portrait ? 370 : 0;
    const targetX =
      Phaser.Math.Clamp(this.player.sprite.x, halfX, Math.max(halfX, this.level.width - halfX)) -
      camera.width / 2;
    const targetY =
      Phaser.Math.Clamp(
        this.player.sprite.y,
        halfY - verticalMargin,
        Math.max(halfY, this.level.height + verticalMargin - halfY),
      ) -
      camera.height / 2;
    camera.scrollX = Phaser.Math.Linear(
      camera.scrollX,
      targetX,
      immediate || this.settings.reducedMotion ? 1 : 0.13,
    );
    camera.scrollY = Phaser.Math.Linear(
      camera.scrollY,
      targetY,
      immediate || this.settings.reducedMotion ? 1 : 0.13,
    );
  }
  burst(left, top, color, count = 10) {
    this.fx.setParticleTint(color);
    this.fx.explode(this.settings.reducedMotion ? Math.min(count, 3) : count, left, top);
  }
  pulse(left, top) {
    const ring = this.add.circle(left, top, 20).setStrokeStyle(3, 0xa4e4d6, 0.8).setDepth(25);
    this.tweens.add({
      targets: ring,
      scale: this.settings.reducedMotion ? 2 : 15,
      alpha: 0,
      duration: 650,
      onComplete: () => ring.destroy(),
    });
  }
  caption(text, duration = 6500) {
    document.querySelector('#game-caption').textContent = text;
    this.captionUntil = this.time.now + duration;
  }
  persist() {
    if (this.finished) return;
    this.app.store.data[this.collection].checkpoint = {
      level: this.level.id,
      objectives: [...this.completed],
      elapsed: this.elapsed,
    };
    this.app.store.data.activeCollection = this.collection;
    this.app.store.write();
  }
  renderHud() {
    this.app.ui.expeditionHud(this);
    for (const node of this.nodes || []) {
      const done = this.completed.includes(node.index);
      node.image.setAlpha(done ? 0.48 : 1);
      node.label.setText(`${done ? 'CONNECTED' : node.index + 1} / ${node.name.toUpperCase()}`);
    }
  }
  startTow() {
    this.towing = true;
    if (!this.cargo)
      this.cargo = this.add
        .image(this.player.sprite.x, this.player.sprite.y + 95, 'exp-crate')
        .setScale(0.7)
        .setDepth(14);
  }
  startEscort() {
    if (!this.escort)
      this.escort = this.add
        .image(this.player.sprite.x - 90, this.player.sprite.y + 70, 'exp-freighter')
        .setScale(0.7)
        .setDepth(14);
  }
  interact(node) {
    if (this.completed.includes(node.index)) return;
    if (!objectiveReady(this.level, node.index, this.completed)) {
      this.caption(
        'This site depends on an earlier objective. The field survey shows the sequence.',
      );
      return;
    }
    const speed = this.player.sprite.body.speed;
    if (this.collection === 'shuttle' && node.kind !== 'ring' && speed > 85) {
      this.caption('Approach too fast. Apply the brake before making contact.');
      return;
    }
    if (
      node.kind === 'escort-check' &&
      (!this.escort ||
        Phaser.Math.Distance.Between(this.escort.x, this.escort.y, node.x, node.y) > 230)
    ) {
      this.caption('The freighter is still approaching. Stay nearby and let it catch up.');
      return;
    }
    if (node.kind === 'deliver' && !this.towing) {
      this.caption('Establish the tractor link at the processor crate first.');
      return;
    }
    if (this.level.rule === 'eclipse' && node.index === 2 && this.time.now % 9000 < 4200) {
      this.caption('The sanctuary opens during the shared shadow. Wait for the eclipse.');
      return;
    }
    this.completed.push(node.index);
    this.lastSafe = { x: node.x, y: node.y };
    this.player.stability = 3;
    if (node.kind === 'tow') this.startTow();
    if (node.kind === 'deliver') {
      this.towing = false;
      this.cargo?.destroy();
      this.cargo = null;
    }
    if (node.kind === 'escort') this.startEscort();
    this.burst(node.x, node.y, 0xefcf8c, 20);
    this.pulse(node.x, node.y);
    this.app.audio.cue(node.kind === 'rescue' ? 'complete' : 'relay');
    this.caption(node.text, 8000);
    this.persist();
    this.renderHud();
  }
  finish() {
    if (this.completed.length < this.nodes.length) {
      this.caption('The mission still has unfinished objectives. Check the field survey.');
      return;
    }
    if (this.collection === 'shuttle' && this.player.sprite.body.speed > 85) {
      this.caption('Slow for the return dock.');
      return;
    }
    if (this.finished) return;
    this.finished = true;
    this.app.store.recordExpedition(this.collection, 'completed', this.level.id, this.elapsed);
    this.app.audio.cue('complete');
    this.app.ui.expeditionCompleted(this);
  }
  update(time, delta) {
    if (this.finished) return;
    this.elapsed += delta;
    const input = this.app.input.sample();
    if (input.pausePressed) {
      this.app.ui.pause();
      return;
    }
    if (input.mapPressed) {
      this.app.ui.expeditionSurvey(this);
      return;
    }
    if (input.hubPressed) {
      this.persist();
      this.app.startHub();
      return;
    }
    this.player.update(time, delta, input);
    this.environment.update(time, delta);
    this.frameCamera();
    const sprite = this.player.sprite;
    let nearest = null;
    let distance = 105;
    for (const node of this.nodes) {
      const range = Phaser.Math.Distance.Between(sprite.x, sprite.y, node.x, node.y);
      if (!this.completed.includes(node.index) && range < distance) {
        nearest = node;
        distance = range;
      }
      if (
        this.collection === 'shuttle' &&
        node.kind === 'ring' &&
        !this.completed.includes(node.index) &&
        range < 62 &&
        objectiveReady(this.level, node.index, this.completed)
      )
        this.interact(node);
      if (
        ['dark', 'mirage', 'rescue'].includes(this.level.rule) &&
        !this.completed.includes(node.index)
      ) {
        const visible = this.scanUntil > time || range < 250;
        node.image.setAlpha(visible ? 1 : 0.15);
        node.label.setAlpha(visible ? 1 : 0.15);
      }
    }
    const homeDistance = Phaser.Math.Distance.Between(sprite.x, sprite.y, ...this.level.exit);
    const relicDistance = Phaser.Math.Distance.Between(sprite.x, sprite.y, ...this.level.relic);
    const prompt = document.querySelector('#interaction');
    prompt.hidden = true;
    if (this.relic.visible) {
      this.relic.setAlpha(this.scanUntil > time || relicDistance < 200 ? 1 : 0.16);
      if (relicDistance < 65) {
        prompt.hidden = false;
        prompt.querySelector('span').textContent = 'Record an uncharted discovery';
        if (input.interactPressed) {
          this.app.store.recordExpedition(this.collection, 'discoveries', this.level.id);
          this.relic.setVisible(false);
          this.app.audio.cue('secret');
          this.app.ui.message('An Uncharted Discovery', this.level.discovery);
          this.renderHud();
        }
      }
    }
    if (homeDistance < 110) {
      prompt.hidden = false;
      prompt.querySelector('span').textContent =
        this.completed.length === this.nodes.length
          ? 'Return to the Defiant'
          : 'Extraction / objectives still open';
      if (input.interactPressed) this.finish();
    } else if (nearest) {
      prompt.hidden = false;
      prompt.querySelector('span').textContent = `${nearest.index + 1} / ${nearest.name}`;
      if (input.interactPressed) this.interact(nearest);
    }
    this.shroud.clear();
    if (this.level.rule === 'dark' && this.scanUntil < time) {
      this.shroud.fillStyle(0x060f20, 0.5);
      const radius = 310;
      this.shroud.fillRect(0, 0, this.level.width, Math.max(0, sprite.y - radius));
      this.shroud.fillRect(0, sprite.y + radius, this.level.width, this.level.height);
      this.shroud.fillRect(0, sprite.y - radius, Math.max(0, sprite.x - radius), radius * 2);
      this.shroud.fillRect(sprite.x + radius, sprite.y - radius, this.level.width, radius * 2);
    }
    if (time - this.lastHud > 180) {
      this.lastHud = time;
      this.app.ui.expeditionTelemetry(this);
    }
    if (time > this.captionUntil) document.querySelector('#game-caption').textContent = '';
  }
}

export class AwayScene extends ExpeditionScene {
  constructor() {
    super('Away');
  }
}
export class FlightScene extends ExpeditionScene {
  constructor() {
    super('Flight');
  }
}

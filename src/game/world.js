import Phaser from 'phaser';
import { LEVELS, THEMES, TOOLS, archiveAlcove, starPosition } from '../data/campaign.js';
import { hubLevel, CREW_LINES } from '../data/hub.js';
import { createTextures, createWorldTextures } from '../art/textures.js';
import { Player } from './player.js';
import { Effects } from './effects.js';
import { Signals } from './signals.js';
import { Patrol, Keeper } from './encounters.js';
import { Exploration } from './exploration.js';
import { lowerRoute } from '../data/exploration.js';

export class World extends Phaser.Scene {
  constructor() {
    super('World');
  }
  init({ app, level = 0, hub = false }) {
    this.app = app;
    this.isHub = hub;
    this.level = hub
      ? hubLevel(app.store.data)
      : { ...LEVELS[level], height: lowerRoute(LEVELS[level]).bottom + 200 };
  }
  create() {
    this.app.scene = this;
    this.collection = 'star';
    document.body.dataset.mode = 'star';
    if (!this.isHub) this.app.store.data.activeCollection = 'star';
    this.theme = THEMES[this.level.theme];
    this.recalls = 0;
    this.finished = false;
    this.captionUntil = 0;
    this.relays = [];
    this.patrols = [];
    this.stations = [];
    this.collectibles = [];
    this.movers = [];
    this.curtains = [];
    this.keeper = null;
    this.exploration = null;
    this.physics.world.gravity.y = this.level.gravity;
    createTextures(this);
    createWorldTextures(this, this.theme);
    this.cameras.main.setBackgroundColor(this.theme.sky);
    this.backdrop = this.add.image(0, 0, 'world-back').setOrigin(0).setDepth(-20);
    this.scenery = this.add.graphics().setDepth(-5);
    this.ground = this.physics.add.staticGroup();
    for (const [left, width] of this.level.floors)
      this.platform(left, 620, Math.min(width, this.level.width - left), 'floor');
    for (const [left, top, width, kind] of this.level.platforms)
      this.platform(left, top, width, kind);
    const checkpoint =
      !this.isHub && this.app.store.data.checkpoint?.level === this.level.id
        ? this.app.store.data.checkpoint
        : null;
    const lowerCheckpoint = this.isHub ? null : lowerRoute(this.level).checkpoint;
    const underground =
      checkpoint &&
      lowerCheckpoint &&
      checkpoint.x === lowerCheckpoint.x &&
      checkpoint.y === lowerCheckpoint.y;
    this.checkpointX = underground
      ? lowerCheckpoint.x
      : checkpoint && checkpoint.x === this.level.checkpoint
        ? this.level.checkpoint
        : 140;
    this.checkpointY = underground ? lowerCheckpoint.y : 620;
    this.player = new Player(this, this.checkpointX, this.checkpointY - 5);
    this.physics.add.collider(this.player.sprite, this.ground, undefined, (sprite, platform) => {
      if (!platform.oneWay) return true;
      return (
        this.time.now >= this.player.dropUntil &&
        sprite.body.velocity.y >= 0 &&
        sprite.body.prev.y + sprite.body.height <= platform.body.top + 16
      );
    });
    this.fx = new Effects(this);
    this.signals = new Signals(this);
    this.ambient = this.add
      .particles(0, 0, 'spark', {
        x: { min: 0, max: this.level.width },
        y: { min: 80, max: 560 },
        quantity: 1,
        frequency: 140,
        lifespan: 5200,
        speedX: { min: -8, max: 8 },
        speedY: { min: -10, max: -3 },
        scale: { start: 0.22, end: 0 },
        alpha: { start: 0.35, end: 0 },
        tint: [0xbad7c2, 0xf4d29a],
        maxParticles: 50,
      })
      .setDepth(5);
    if (this.app.store.data.settings.reducedMotion) this.ambient.stop();
    if (this.isHub) this.buildHub();
    else {
      this.buildMission(checkpoint);
      this.exploration = new Exploration(this);
    }
    this.app.audio.level = this.isHub ? 0 : this.level.id;
    this.app.audio.hub = this.isHub;
    this.app.audio.depth = false;
    this.app.audio.harmony = this.app.store.data.completed.length;
    this.app.audio.suspend(false);
    this.resize();
    this.scale.on('resize', this.resize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.resize, this);
      if (this.app.scene === this) this.app.scene = null;
      this.app.input.clear();
    });
    const camera = this.cameras.main;
    const halfView = camera.width / camera.zoom / 2;
    camera.scrollX =
      Phaser.Math.Clamp(
        this.checkpointX + 110,
        halfView,
        Math.max(halfView, this.level.width - halfView),
      ) -
      camera.width / 2;
    this.app.ui.hud(this);
    this.app.ui.ready();
    this.caption(
      this.isHub && this.app.store.data.completed.length === 0
        ? 'A / D to move. Space to jump. E at the star chart to choose your first journey.'
        : this.level.briefing,
      10000,
    );
    if (!this.app.store.persistent)
      this.app.ui.toast(
        'Browser storage is unavailable. This journey will not persist after closing the page.',
      );
    if (!this.app.store.data.settings.reducedMotion) this.cameras.main.fadeIn(500, 15, 28, 31);
    if (this.level.unlock && !this.app.store.data.completed.includes(this.level.id))
      this.time.delayedCall(2000, () => this.app.ui.toast(this.level.unlock));
  }
  resize() {
    const camera = this.cameras.main;
    camera.setSize(this.scale.width, this.scale.height);
    const zoom = Math.min(this.scale.height / 720, this.scale.width / 760);
    camera.setZoom(Math.max(0.4, zoom));
    camera.scrollY = Math.max(360, this.checkpointY - 250) - camera.height / 2;
    this.backdrop.setDisplaySize(
      Math.max(1600, camera.width / camera.zoom + 350),
      Math.max(900, camera.height / camera.zoom),
    );
  }
  platform(left, top, width, kind = 'ledge') {
    const height = kind === 'floor' ? 112 : 26;
    const block = this.add.zone(left + width / 2, top + height / 2, width, height);
    this.physics.add.existing(block, true);
    this.ground.add(block);
    block.oneWay = kind !== 'floor';
    const visual = this.add
      .tileSprite(left, top, width, height, 'floor-tile')
      .setOrigin(0)
      .setDepth(10);
    if (kind === 'lift' || kind === 'phase')
      this.movers.push({ block, visual, kind, left, top, width, lastTop: top });
    if (kind === 'ledge') {
      this.scenery.lineStyle(1, Phaser.Display.Color.HexStringToColor(this.theme.mid).color, 0.45);
      const base = top > 740 ? this.level.height - 200 : 620;
      this.scenery.lineBetween(left + 15, top + 26, left + 15, base);
      this.scenery.lineBetween(left + width - 15, top + 26, left + width - 15, base);
    }
    return block;
  }
  label(left, top, text, color = '#abcac0', size = 14) {
    return this.add
      .text(left, top, text, {
        fontFamily: 'Rajdhani',
        fontSize: `${size}px`,
        color,
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5)
      .setDepth(12);
  }
  station(left, label, action, texture = 'terminal', top = 620) {
    const image = this.add.image(left, top, texture).setOrigin(0.5, 1).setDepth(12);
    this.label(left, top - image.height - 23, label.toUpperCase());
    const station = { x: left, y: top - 45, action, label, image };
    this.stations.push(station);
    return station;
  }
  buildMission(checkpoint) {
    this.app.store.data.current = this.level.id;
    this.level.relays.forEach(([left, top, tool], index) => {
      const active = checkpoint?.relays.includes(index) || false;
      const image = this.add
        .image(left, top + 54, 'relay')
        .setOrigin(0.5, 1)
        .setTint(TOOLS[tool].color)
        .setDepth(12);
      const marker = this.label(
        left,
        top - 60,
        `${index + 1} / ${TOOLS[tool].name.toUpperCase()}`,
        TOOLS[tool].hex,
        12,
      );
      const relay = { x: left, y: top, tool, index, image, marker, active };
      this.relays.push(relay);
      if (active) {
        image.setAlpha(0.55);
        marker.setText('CONNECTED');
      }
    });
    this.level.patrols.forEach(([left, right, kind], index) =>
      this.patrols.push(new Patrol(this, left, right, kind, index)),
    );
    this.level.crystals.forEach((coordinates, index) => {
      const [left, top] = starPosition(this.level, index);
      const key = `${this.level.id}:${index}`;
      if (!this.app.store.data.crystals.includes(key))
        this.collectibles.push({
          key,
          x: left,
          y: top,
          image: this.add.image(left, top, 'star').setScale(0.65).setDepth(16),
        });
    });
    const alcove = archiveAlcove(this.level);
    const [secretX, secretY] = alcove.artifact;
    const [ledgeX, ledgeY, ledgeWidth] = alcove.platform;
    this.platform(ledgeX, ledgeY, ledgeWidth);
    const room = this.add.graphics().setDepth(6).setAlpha(0.2);
    room.fillStyle(0x122b34, 0.8);
    room.fillRoundedRect(ledgeX - 12, ledgeY - 125, ledgeWidth + 24, 125, 5);
    room.lineStyle(1, 0xc4acd8, 0.8);
    room.strokeRoundedRect(ledgeX - 12, ledgeY - 125, ledgeWidth + 24, 125, 5);
    room.lineBetween(ledgeX + 9, ledgeY - 106, ledgeX + 43, ledgeY - 106);
    room.lineBetween(ledgeX + ledgeWidth - 43, ledgeY - 106, ledgeX + ledgeWidth - 9, ledgeY - 106);
    this.secret = this.app.store.data.secrets.includes(this.level.id)
      ? null
      : {
          x: secretX,
          y: secretY,
          room,
          image: this.add
            .image(secretX, secretY, 'artifact')
            .setScale(0.65)
            .setDepth(9)
            .setAlpha(0.12),
        };
    this.station(
      this.level.terminal[0],
      'Read world log',
      () => {
        this.app.store.add('lore', this.level.id);
        this.app.ui.message(this.level.place, this.level.lore);
        if (this.app.store.data.lore.length === 10) this.app.achievement('listener');
      },
      'terminal',
      this.level.terminal[1] + 40,
    ).image.setScale(0.65);
    this.checkpointBeacon = this.add
      .image(this.level.checkpoint, 620, 'terminal')
      .setOrigin(0.5, 1)
      .setScale(0.8)
      .setTint(0x8ee0d3)
      .setDepth(12);
    this.checkpointLabel = this.label(
      this.level.checkpoint,
      515,
      checkpoint ? 'SIGNAL SAVED' : 'CHECKPOINT',
      '#96d7c7',
    );
    if (this.level.boss) this.keeper = new Keeper(this);
    this.portal = this.station(
      this.level.width - 80,
      'Return to the Defiant',
      () => this.finish(),
      'portal',
    );
    this.station(60, 'Back to the ship', () => this.app.startHub(), 'terminal').image.setScale(0.6);
    for (const left of this.level.curtains || [])
      this.curtains.push({
        x: left,
        image: this.add.rectangle(left, 520, 14, 200, 0xe9b3d0, 0.15).setDepth(13),
        active: false,
      });
    for (const left of this.level.springs || []) {
      this.add.ellipse(left, 614, 64, 14, 0xd4dfad).setStrokeStyle(2, 0x90d8c1).setDepth(12);
      this.label(left, 645, 'UPDRAFT', '#c5dcae', 12);
    }
    if (this.level.id === 0) {
      this.label(230, 433, 'A / D  MOVE     SPACE  JUMP', '#dbdfc7', 17);
      this.label(545, 570, 'F  SIGNAL     E  INTERACT', '#c4dfd2', 16);
      this.label(1520, 667, 'THE SHIP WILL CATCH YOU', '#98bfb6', 12);
    }
    this.persist();
  }
  buildHub() {
    const save = this.app.store.data;
    const count = save.completed.length;
    this.station(440, 'Star chart', () => this.app.ui.missions());
    this.station(800, 'Away Missions', () => this.app.ui.expeditions.list('away')).image.setTint(
      0xb5dfb8,
    );
    this.station(1170, 'Shuttle Bay', () => this.app.ui.expeditions.list('shuttle')).image.setTint(
      0xc3cee8,
    );
    this.label(800, 657, `${save.away.completed.length} / 10 AWAY MISSIONS`, '#b4d8b9', 13);
    this.label(1170, 657, `${save.shuttle.completed.length} / 10 FLIGHT MISSIONS`, '#c2cfe6', 13);
    this.station(780, 'Linda Park archive', () => this.app.ui.archive(), 'artifact', 465);
    this.station(1180, 'Signal workshop', () => this.app.ui.workshop(), 'terminal', 465);
    this.station(1520, 'Listening post', () => this.app.ui.journal());
    this.station(
      1750,
      'Navigator Ivo',
      () => {
        const [name, words] = CREW_LINES[count >= 10 ? 3 : count >= 5 ? 2 : count >= 2 ? 1 : 0];
        this.app.ui.message(name, words);
      },
      'crew',
    );
    this.label(260, 375, 'HOME IS A FREQUENCY', '#f2d69f', 27);
    this.label(440, 683, `${String(count).padStart(2, '0')} WORLDS CONNECTED`, '#d9d6b4', 15);
    this.label(920, 300, 'THE EMPRESS ARCHIVE', '#d6cbad', 20);
    for (let index = 0; index < 10; index += 1)
      this.add
        .circle(238 + index * 28, 410, 4, save.completed.includes(index) ? 0xf1ce91 : 0x416366)
        .setDepth(5);
    save.completed.slice(0, 5).forEach((id, index) => {
      this.add
        .image(1320 + index * 65, 397, 'artifact')
        .setScale(0.48)
        .setTint(Phaser.Display.Color.HexStringToColor(THEMES[LEVELS[id].theme].light).color)
        .setDepth(8);
    });
    if (count < 3)
      this.station(
        1920,
        'Conservatory / 3 worlds',
        () =>
          this.app.ui.message(
            'A Future Garden',
            'Three connected worlds will help the crew open this deck.',
          ),
        'portal',
      );
    if (count >= 3) {
      this.label(2280, 300, 'THE CONSERVATORY', '#c5dfa8', 22);
      for (let index = 0; index < 6; index += 1) {
        const left = 2080 + index * 86;
        this.scenery.lineStyle(5, 0x8caf88, 0.8);
        this.scenery.lineBetween(left, 615, left, 460 + (index % 2) * 40);
        this.add
          .ellipse(left - 15, 535, 44, 16, 0x719c82)
          .setAngle(-25)
          .setDepth(8);
        this.add
          .ellipse(left + 15, 500, 44, 16, 0x93b294)
          .setAngle(25)
          .setDepth(8);
        this.add.circle(left, 464 + (index % 2) * 40, 7, 0xf0bfb2).setDepth(8);
      }
      this.station(
        2510,
        "Gardener T'Vel",
        () =>
          this.app.ui.message(
            "T'Vel",
            count >= 8
              ? 'The ship is a little less efficient with a garden. It is, however, considerably more alive.'
              : 'I came to observe. I find myself wanting to stay. There is a difference.',
          ),
        'crew',
      ).image.setTint(0xcde5bb);
    }
    if (count >= 6) {
      this.label(3020, 305, 'THE LISTENING GALLERY', '#dbc6dd', 22);
      save.completed.forEach((id, index) => {
        const left = 2750 + index * 65;
        const color = Phaser.Display.Color.HexStringToColor(THEMES[LEVELS[id].theme].light).color;
        this.add.image(left, 405, 'artifact').setScale(0.7).setTint(color).setDepth(8);
        this.label(left, 449, `${String(id + 1).padStart(2, '0')}`, '#c6d7cb', 12);
      });
      this.station(3100, 'The ship remembers', () => this.app.ui.achievements());
      this.station(3320, 'Listen to the worlds', () => {
        this.app.audio.cue('complete');
        this.app.ui.message(
          'An Open Channel',
          "A garden chord. A city bell. A shipyard rhythm. Every signal you brought home has become part of the Defiant's song.",
        );
      });
    }
    if (save.away.discoveries.length || save.shuttle.discoveries.length) {
      this.station(
        1400,
        'Expedition collection',
        () => this.app.ui.expeditions.journal(),
        'artifact',
        465,
      ).image.setScale(0.65);
    }
    if (count >= 9) {
      this.label(3780, 240, 'A ROOM FOR EVERYONE', '#f4d79d', 24);
      this.scenery.lineStyle(2, 0xe6cd91, 0.65);
      for (let index = 0; index < 5; index += 1)
        this.scenery.strokeCircle(3800, 405, 60 + index * 24);
      this.station(
        3780,
        'The observation room',
        () =>
          this.app.ui.message(
            'Hoshi Sato',
            count === 10
              ? 'I asked for a throne. They built a table instead. I think I shall keep it.'
              : 'A bigger room. More chairs. There may be something to this kind of grandeur.',
          ),
        'crew',
      );
      this.add.tileSprite(3790, 594, 160, 26, 'floor-tile').setDepth(18);
    }
    if (count === 0)
      this.caption(
        'A / D to move. Space to jump. E at the star chart to choose your first journey.',
        12000,
      );
  }
  tune(relay, tool) {
    if (relay.active) return;
    if (tool.id !== 'echo' && tool.id !== TOOLS[relay.tool].id) {
      this.caption(
        `This receiver is listening for the ${TOOLS[relay.tool].name}. Q changes tools.`,
      );
      return;
    }
    if (
      this.level.sequence &&
      this.relays.some((other) => other.index < relay.index && !other.active)
    ) {
      this.caption('The memory has an order. Begin with receiver 1.');
      return;
    }
    relay.active = true;
    relay.image.setAlpha(0.55);
    relay.marker.setText('CONNECTED');
    this.fx.burst(relay.x, relay.y, tool.color, 18, 160);
    this.fx.ring(relay.x, relay.y, tool.color);
    this.app.audio.cue('relay');
    this.persist();
    this.app.ui.hud(this);
    if (this.relays.every((entry) => entry.active)) {
      this.caption(
        this.keeper
          ? 'The keeper is listening. Follow its changing frequency.'
          : 'World signal restored. Your way home is open.',
      );
      this.app.audio.cue('door');
    }
  }
  persist() {
    if (this.isHub || this.finished) return;
    this.app.store.data.checkpoint = {
      level: this.level.id,
      x: this.checkpointX,
      y: this.checkpointY,
      relays: this.relays.filter((relay) => relay.active).map((relay) => relay.index),
    };
    this.app.store.write();
  }
  caption(text, duration = 5000) {
    this.captionUntil = this.time.now + duration;
    document.querySelector('#game-caption').textContent = text;
  }
  finish() {
    if (this.finished) return;
    if (!this.relays.every((relay) => relay.active)) {
      this.caption('A few receivers are still waiting. Follow the numbered signals.');
      return;
    }
    if (this.keeper && !this.keeper.done) {
      this.caption('One last harmony. The keeper is still listening.');
      return;
    }
    this.finished = true;
    this.app.store.complete(this.level.id);
    this.app.achievement('first');
    if (this.recalls === 0) this.app.achievement('perfect');
    if (this.level.id === 9) this.app.achievement('finale');
    this.app.audio.cue('complete');
    this.app.ui.completed(this);
  }
  update(time, delta) {
    if (this.finished) return;
    const input = this.app.input.sample();
    if (input.pausePressed) {
      this.app.ui.pause();
      return;
    }
    if (input.mapPressed) {
      this.app.ui.missions();
      return;
    }
    if (input.hubPressed && !this.isHub) {
      this.persist();
      this.app.startHub();
      return;
    }
    this.player.update(time, Math.min(delta, 35), input);
    this.exploration?.update(time);
    if (input.cyclePressed) this.signals.cycle();
    if (input.signal) this.signals.send(input);
    this.signals.update(time);
    const sprite = this.player.sprite;
    const camera = this.cameras.main;
    const visible = camera.width / camera.zoom;
    const target =
      Phaser.Math.Clamp(
        sprite.x + this.player.facing * 110,
        visible / 2,
        Math.max(visible / 2, this.level.width - visible / 2),
      ) -
      camera.width / 2;
    camera.scrollX = Phaser.Math.Linear(
      camera.scrollX,
      target,
      this.app.store.data.settings.reducedMotion ? 1 : Math.min(0.15, delta / 180),
    );
    const centerY = Phaser.Math.Clamp(
      sprite.y - 250,
      360,
      this.level.height ? this.level.height - 360 : 360,
    );
    camera.scrollY = Phaser.Math.Linear(
      camera.scrollY,
      centerY - camera.height / 2,
      this.app.store.data.settings.reducedMotion ? 1 : Math.min(0.15, delta / 180),
    );
    this.backdrop.x = camera.scrollX * 0.88 - 130;
    this.backdrop.y = 360 - this.backdrop.displayHeight / 2;
    for (const mover of this.movers) {
      if (mover.kind === 'lift') {
        const top = mover.top + Math.sin(time * 0.0009 + mover.left) * 38;
        if (
          Math.abs(sprite.y - mover.lastTop) < 6 &&
          sprite.x > mover.left - 10 &&
          sprite.x < mover.left + mover.width + 10
        )
          sprite.y += top - mover.lastTop;
        mover.block.y = top + 13;
        mover.visual.y = top;
        mover.lastTop = top;
        mover.block.body.updateFromGameObject();
      } else {
        const near = Math.abs(sprite.x - (mover.left + mover.width / 2)) < mover.width / 2 + 25;
        const active = (time + mover.left) % 4200 < 3000 || near;
        mover.block.body.enable = active;
        mover.visual.setAlpha(active ? 0.8 : 0.18);
      }
    }
    for (const patrol of this.patrols) patrol.update(time, delta);
    this.keeper?.update(time, delta);
    for (const curtain of this.curtains) {
      const cycle = (time + curtain.x * 2) % 3600;
      curtain.active = cycle > 1800 && cycle < 2800;
      curtain.image.setAlpha(curtain.active ? 0.65 : cycle > 1300 && cycle < 1800 ? 0.28 : 0.08);
      if (curtain.active && Math.abs(sprite.x - curtain.x) < 24 && sprite.y > 415 && sprite.y < 730)
        this.player.recall();
    }
    for (const left of this.level.springs || [])
      if (
        Math.abs(sprite.x - left) < 33 &&
        sprite.y >= 613 &&
        sprite.y < 640 &&
        this.player.sprite.body.velocity.y >= 0
      ) {
        this.player.sprite.body.setVelocityY(-810);
        this.app.audio.cue('jump');
        this.fx.ring(left, 610);
      }
    for (const crystal of this.collectibles) {
      if (!crystal.image.active) continue;
      crystal.image.y =
        crystal.y +
        (this.app.store.data.settings.reducedMotion ? 0 : Math.sin(time * 0.003 + crystal.x) * 5);
      if (Math.hypot(sprite.x - crystal.x, sprite.y - 53 - crystal.y) < 50) {
        crystal.image.destroy();
        this.app.store.add('crystals', crystal.key);
        this.app.audio.cue('pickup');
        this.fx.burst(crystal.x, crystal.y, 0xf1ce91, 8);
        if (this.app.store.data.crystals.length >= 25) this.app.achievement('collector');
        this.app.ui.hud(this);
      }
    }
    if (this.secret) {
      const distance = Math.hypot(sprite.x - this.secret.x, sprite.y - 53 - this.secret.y);
      this.secret.room.setAlpha(distance < 250 ? 0.9 : 0.2);
      this.secret.image.setAlpha(
        distance < (this.app.store.data.upgrades.includes('compass') ? 450 : 180) ? 0.85 : 0.12,
      );
      if (distance < 48) {
        this.fx.burst(this.secret.x, this.secret.y, 0xd6bbdc, 25);
        this.secret.image.destroy();
        this.secret = null;
        this.app.store.add('secrets', this.level.id);
        this.app.audio.cue('secret');
        this.app.achievement('secret');
        this.caption('A hidden archive. Some stories only reveal themselves to the curious.');
        if (this.app.store.data.secrets.length === 3) {
          this.signals = this.refreshSignals();
          this.app.ui.toast(
            'Three archives found. Echo Lantern unlocked: a signal for every receiver.',
          );
        }
        if (this.app.store.data.secrets.length === 10) this.app.achievement('explorer');
      }
    }
    if (
      !this.isHub &&
      this.checkpointX !== this.level.checkpoint &&
      Math.abs(sprite.x - this.level.checkpoint) < 80 &&
      sprite.y < 740
    ) {
      this.checkpointX = this.level.checkpoint;
      this.checkpointY = 620;
      this.checkpointLabel.setText('SIGNAL SAVED');
      this.player.stability = 3;
      this.persist();
      this.fx.ring(this.level.checkpoint, 570);
      this.app.audio.cue('relay');
      this.app.ui.hud(this);
    }
    let nearest = null;
    let nearestDistance = 110;
    for (const station of this.stations) {
      const distance = Math.hypot(sprite.x - station.x, sprite.y - 45 - station.y);
      if (distance < nearestDistance) {
        nearest = station;
        nearestDistance = distance;
      }
    }
    for (const relay of this.relays)
      if (!relay.active) {
        const distance = Math.hypot(sprite.x - relay.x, sprite.y - 50 - relay.y);
        if (distance < nearestDistance) {
          nearest = {
            label: `Tune ${TOOLS[relay.tool].name} receiver`,
            action: () => this.tune(relay, this.signals.tool),
          };
          nearestDistance = distance;
        }
      }
    const prompt = document.querySelector('#interaction');
    if (nearest) {
      prompt.hidden = false;
      prompt.querySelector('span').textContent = nearest.label;
      if (input.interactPressed) nearest.action();
    } else prompt.hidden = true;
    if (time > this.captionUntil) document.querySelector('#game-caption').textContent = '';
  }
  refreshSignals() {
    this.signals.pool.clear(true, true);
    this.signals.pool.destroy();
    const signals = new Signals(this);
    return signals;
  }
}

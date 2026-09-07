import { TOOLS } from '../data/campaign.js';

export class Patrol {
  constructor(scene, left, right, kind, index) {
    this.scene = scene;
    this.left = left;
    this.right = right;
    this.kind = kind;
    this.index = index;
    this.quietUntil = 0;
    this.x = left;
    this.y = kind === 'moth' ? 400 : kind === 'drone' ? 492 : 575;
    this.sprite = scene.add
      .image(this.x, this.y, kind === 'moth' ? 'moth' : 'drone')
      .setDepth(15)
      .setScale(kind === 'scanner' ? 0.9 : 1);
    this.beam = scene.add.graphics().setDepth(14);
    this.lastCue = 0;
  }
  quiet(time) {
    this.quietUntil = time + 4300;
    this.scene.fx.ring(this.x, this.y);
    this.scene.app.audio.cue('relay');
  }
  update(time, delta) {
    const player = this.scene.player.sprite;
    const pace = 0.0006 + this.scene.level.id * 0.000035;
    const phase = time * pace + this.index * 2;
    const resting = time < this.quietUntil;
    if (!resting) {
      if (this.kind === 'drone' && Math.abs(player.x - this.x) < 230)
        this.x +=
          Math.sign(player.x - this.x) * Math.min(Math.abs(player.x - this.x), delta * 0.078);
      else this.x = this.left + ((Math.sin(phase) + 1) / 2) * (this.right - this.left);
      this.y =
        this.kind === 'moth'
          ? 430 + Math.sin(phase * 1.7) * 80
          : this.kind === 'drone'
            ? 500 + Math.sin(phase) * 50
            : 575;
    }
    this.sprite.setPosition(this.x, this.y).setTint(resting ? 0x92edbc : 0xffffff);
    this.sprite.setAngle(this.kind === 'moth' ? Math.sin(phase) * 12 : 0);
    this.beam.clear();
    if (resting) return;
    const scannerOn = this.kind !== 'scanner' || Math.sin(time * 0.0014) > 0.25;
    if (['scanner', 'sweeper'].includes(this.kind)) {
      const direction = Math.cos(phase) >= 0 ? 1 : -1;
      this.beam.fillStyle(scannerOn ? 0xf5cd87 : 0x8ee0d3, scannerOn ? 0.12 : 0.035);
      this.beam.fillTriangle(
        this.x,
        this.y - 20,
        this.x + 160 * direction,
        this.y - 90,
        this.x + 160 * direction,
        this.y - 5,
      );
      if (
        scannerOn &&
        (player.x - this.x) * direction > 0 &&
        Math.abs(player.x - this.x) < 148 &&
        Math.abs(player.y - 600) < 55 &&
        !this.scene.player.crouching
      )
        this.scene.player.recall();
    } else if (Math.hypot(player.x - this.x, player.y - 58 - this.y) < 43)
      this.scene.player.recall();
    if (scannerOn && Math.abs(player.x - this.x) < 210 && time - this.lastCue > 2500) {
      this.lastCue = time;
      this.scene.app.audio.cue('scan');
    }
  }
}

export class Keeper {
  constructor(scene) {
    this.scene = scene;
    this.x = scene.level.width - 410;
    this.y = 352;
    this.progress = 0;
    this.done = false;
    this.started = false;
    this.ready = 0;
    this.wave = 0;
    this.sequence =
      scene.level.id === 2
        ? [0, 1, 1]
        : scene.level.id === 5
          ? [2, 0, 1, 2]
          : scene.level.id === 7
            ? [1, 0, 2, 1]
            : [0, 1, 2, 0, 2, 1];
    this.graphics = scene.add.graphics().setDepth(8);
    this.label = scene.add
      .text(this.x, 172, scene.level.boss.toUpperCase(), {
        fontFamily: 'Rajdhani',
        fontSize: '23px',
        color: '#f4d69d',
        align: 'center',
      })
      .setOrigin(0.5);
    this.status = scene.add
      .text(this.x, 202, 'AWAITING THE WORLD SIGNAL', {
        fontFamily: 'Rajdhani',
        fontSize: '13px',
        color: '#bcd8ce',
      })
      .setOrigin(0.5);
    this.nodes = [
      { x: this.x - 135, y: 505 },
      { x: this.x + 24, y: 400 },
      { x: this.x + 145, y: 505 },
    ];
    this.receivers = this.nodes.map((node, index) =>
      scene.add
        .image(node.x, node.y + 33, 'relay')
        .setOrigin(0.5, 1)
        .setScale(0.8)
        .setTint(TOOLS[index].color)
        .setDepth(11),
    );
    scene.platform(this.x - 200, 550, 200);
    scene.platform(this.x - 45, 455, 180);
    scene.platform(this.x + 100, 550, 180);
  }
  targets() {
    return this.started && !this.done ? [this.nodes[this.sequence[this.progress]]] : [];
  }
  receive(left, top, tool) {
    if (!this.started || this.done || this.scene.time.now < this.ready) return false;
    const index = this.sequence[this.progress];
    const node = this.nodes[index];
    if (Math.hypot(left - node.x, top - node.y) > 37) return false;
    if (tool.id !== 'echo' && tool.id !== TOOLS[index].id) {
      this.scene.caption(`${TOOLS[index].name}: ${TOOLS[index].description}`);
      return true;
    }
    this.progress += 1;
    this.ready = this.scene.time.now + 650;
    this.wave = 1;
    this.scene.fx.burst(node.x, node.y, TOOLS[index].color, 25, 160);
    this.scene.fx.ring(this.x, this.y, TOOLS[index].color);
    this.scene.app.audio.cue('keeper');
    if (this.progress === this.sequence.length) {
      this.done = true;
      this.status.setText('HARMONY ESTABLISHED');
      this.scene.app.audio.cue('complete');
      this.scene.caption('Not a command. A conversation. The way home is open.');
      for (let index = 0; index < 5; index += 1)
        this.scene.time.delayedCall(index * 160, () =>
          this.scene.fx.burst(this.x + (index - 2) * 70, this.y, 0xf5d895, 18, 200),
        );
    }
    this.scene.app.ui.hud(this.scene);
    return true;
  }
  update(time, delta) {
    this.started = this.scene.relays.every((relay) => relay.active);
    const graphics = this.graphics;
    graphics.clear();
    const phase = this.done ? 3 : Math.floor(this.progress / 2);
    const color = this.done
      ? 0xa5e7c8
      : this.started
        ? TOOLS[this.sequence[this.progress]].color
        : 0x708b91;
    const motion = this.scene.app.store.data.settings.reducedMotion ? 0 : time * 0.00017;
    const rings = this.scene.level.id === 2 ? 5 : this.scene.level.id === 9 ? 7 : 3;
    for (let index = 0; index < rings; index += 1) {
      const radius = 48 + index * 16;
      graphics.lineStyle(index === 0 ? 3 : 1, color, 0.5 - index * 0.045);
      if (this.scene.level.id === 2)
        graphics.strokeEllipse(
          this.x + Math.cos((index / rings) * Math.PI * 2 + motion) * 50,
          this.y + Math.sin((index / rings) * Math.PI * 2 + motion) * 50,
          72,
          72,
        );
      else graphics.strokeCircle(this.x, this.y, radius);
      graphics.fillStyle(color, 0.7);
      graphics.fillCircle(
        this.x + Math.cos(motion + index * 1.6) * radius,
        this.y + Math.sin(motion + index * 1.6) * radius,
        index % 2 ? 4 : 7,
      );
    }
    graphics.fillStyle(color, 0.8);
    graphics.fillCircle(this.x, this.y, 17 + Math.sin(time * 0.003) * 2);
    graphics.lineStyle(1, color, 0.13);
    for (const node of this.nodes) graphics.lineBetween(this.x, this.y, node.x, node.y);
    for (let index = 0; index < this.receivers.length; index += 1)
      this.receivers[index].setAlpha(
        this.done || (this.started && index === this.sequence[this.progress]) ? 1 : 0.25,
      );
    if (this.started && !this.done)
      this.status.setText(
        `${this.progress + 1} / ${this.sequence.length}   ${TOOLS[this.sequence[this.progress]].name.toUpperCase()}`,
      );
    if (this.wave > 0 && !this.done) {
      this.wave += delta * (0.15 + phase * 0.05);
      graphics.lineStyle(3, 0xf4d398, 0.5);
      graphics.strokeEllipse(this.x, 610, this.wave * 2, this.wave * 0.22);
      if (
        Math.abs(Math.abs(this.scene.player.sprite.x - this.x) - this.wave) < 13 &&
        this.scene.player.sprite.y > 590
      )
        this.scene.player.recall();
      if (this.wave > 520) this.wave = 0;
    }
  }
}

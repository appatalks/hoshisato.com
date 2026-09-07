import Phaser from 'phaser';

export class ExpeditionPilot {
  constructor(scene) {
    this.scene = scene;
    this.flight = scene.collection === 'shuttle';
    this.heading = 0;
    this.scanReady = 0;
    this.boostReady = 0;
    this.invulnerable = 0;
    this.stability = 3;
    this.facing = 1;
    this.lastTrail = 0;
    const [left, top] = scene.level.start;
    this.sprite = scene.physics.add
      .sprite(left, top, this.flight ? 'exp-ship' : 'exp-hoshi-0')
      .setDepth(20);
    if (this.flight) {
      this.sprite.setScale(0.55);
      this.sprite.body.setCircle(36, 28, 42).setMaxVelocity(430, 430);
    } else {
      this.sprite.setScale(0.6).setOrigin(0.5, 0.85);
      this.sprite.body.setCircle(22, 18, 70).setMaxVelocity(240, 240);
    }
    this.sprite.body.setAllowGravity(false).setCollideWorldBounds(true);
  }
  update(time, delta, input) {
    const sprite = this.sprite;
    const body = sprite.body;
    const seconds = Math.min(delta, 40) / 1000;
    if (this.flight) {
      const mass = this.scene.towing ? 0.68 : 1;
      this.heading += input.horizontal * 2.55 * seconds * mass;
      const thrust = input.up || input.jump ? 1 : 0;
      const boost = input.jump && time > this.boostReady && !this.scene.towing;
      if (boost) {
        this.boostUntil = time + 350;
        this.boostReady = time + 1800;
        this.scene.app.audio.cue('dash');
      }
      const acceleration = (time < (this.boostUntil || 0) ? 600 : 265) * mass;
      body.setAcceleration(
        Math.sin(this.heading) * acceleration * thrust,
        -Math.cos(this.heading) * acceleration * thrust,
      );
      if (input.down) {
        body.setAcceleration(0, 0);
        body.velocity.scale(Math.exp(-4.8 * seconds));
      } else body.velocity.scale(Math.exp(-0.09 * seconds));
      body.velocity.limit(this.scene.towing ? 220 : 430);
      sprite.rotation = this.heading;
      if (thrust && time - this.lastTrail > 45) {
        this.lastTrail = time;
        this.scene.burst(
          sprite.x - Math.sin(this.heading) * 37,
          sprite.y + Math.cos(this.heading) * 37,
          0x92d8ea,
          2,
        );
      }
    } else {
      const vector = new Phaser.Math.Vector2(input.horizontal, input.vertical).limit(1);
      const sliding = this.scene.level.rule === 'ice';
      const speed = input.down && input.signal ? 115 : 225;
      const factor = Math.min(1, seconds * (sliding ? 2.1 : 13));
      body.velocity.x = Phaser.Math.Linear(body.velocity.x, vector.x * speed, factor);
      body.velocity.y = Phaser.Math.Linear(body.velocity.y, vector.y * speed, factor);
      if (
        (input.dashPressed || input.jumpPressed) &&
        time > this.boostReady &&
        vector.lengthSq() > 0
      ) {
        this.boostReady = time + 1200;
        body.setVelocity(vector.x * 400, vector.y * 400);
        this.scene.app.audio.cue('dash');
      }
      if (Math.abs(vector.x) > 0.1) this.facing = vector.x > 0 ? 1 : -1;
      sprite
        .setFlipX(this.facing > 0)
        .setTexture(`exp-hoshi-${body.speed > 30 ? Math.floor(time / 100) % 6 : 0}`);
    }
    if (input.signal && time > this.scanReady) {
      this.scanReady = time + 1500;
      this.scene.scanUntil = time + 5000;
      this.scene.pulse(sprite.x, sprite.y);
      this.scene.app.audio.cue('prism');
    }
    sprite.alpha = time < this.invulnerable ? 0.6 : 1;
  }
  recall() {
    const scene = this.scene;
    const time = scene.time.now;
    if (time < this.invulnerable) return;
    this.invulnerable = time + 1800;
    this.stability -= 1;
    scene.recalls += 1;
    scene.app.audio.cue('recall');
    scene.burst(this.sprite.x, this.sprite.y, 0xf1c68a, 12);
    if (this.stability <= 0 || scene.app.store.data.settings.difficulty === 'voyager') {
      this.stability = 3;
      const target = scene.lastSafe;
      this.sprite.body.reset(target.x, target.y);
      this.sprite.body.setVelocity(0, 0);
      this.heading = 0;
      scene.caption('Navigation recall. Your completed objectives are safe.');
    } else this.sprite.body.velocity.scale(-0.4);
    scene.renderHud();
  }
}

export class Player {
  constructor(scene, left, top) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(left, top, 'hoshi-0').setOrigin(0.5, 1).setDepth(20);
    this.sprite.body.setSize(26, 112).setOffset(27, 16).setMaxVelocity(700, 850);
    this.facing = 1;
    this.sprite.setFlipX(true);
    this.lastGround = -1000;
    this.jumpBuffer = -1000;
    this.jumps = 0;
    this.dashEnd = 0;
    this.dashReady = 0;
    this.shieldEnd = 0;
    this.shieldReady = 0;
    this.invulnerable = 0;
    this.stability = 3;
    this.dropUntil = 0;
    this.wasGrounded = false;
    this.lastStep = 0;
    this.lastTrail = 0;
  }
  update(time, delta, input) {
    const sprite = this.sprite;
    const body = sprite.body;
    const progress = Math.max(this.scene.app.store.data.unlocked, this.scene.level.id);
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) {
      this.lastGround = time;
      this.jumps = 0;
    }
    if (grounded && !this.wasGrounded) {
      this.scene.app.audio.cue('land');
      this.scene.fx.burst(sprite.x, sprite.y - 3, 0xb5ded3, 5, 65);
    }
    this.wasGrounded = grounded;
    if (input.jumpPressed) this.jumpBuffer = time;
    this.crouching = Boolean(input.down && grounded);
    body.setSize(26, this.crouching ? 64 : 112, false).setOffset(27, this.crouching ? 64 : 16);
    sprite.setScale(1, this.crouching ? 0.65 : 1);
    const onLedge =
      (input.dropPressed || (input.down && input.jumpPressed)) &&
      this.scene.ground
        .getChildren()
        .some(
          (platform) =>
            platform.oneWay &&
            platform.body.enable &&
            Math.abs(sprite.y - platform.body.top) < 9 &&
            sprite.x >= platform.body.left - 10 &&
            sprite.x <= platform.body.right + 10,
        );
    if (onLedge) {
      this.dropUntil = time + 300;
      sprite.y += 9;
      body.setVelocityY(150);
      this.jumpBuffer = -1000;
    }
    const canJump =
      grounded ||
      (time - this.lastGround < 115 && this.jumps === 0) ||
      (progress >= 3 && this.jumps < 2);
    if (time - this.jumpBuffer < 145 && canJump && time >= this.dropUntil) {
      body.setVelocityY(this.scene.level.gravity < 800 ? -465 : -620);
      this.jumps += 1;
      this.lastGround = -1000;
      this.jumpBuffer = -1000;
      this.scene.app.audio.cue('jump');
      this.scene.fx.burst(sprite.x, sprite.y - 6, 0x8ee0d3, 8, 90);
    }
    if (!input.jump && this.jumpHeld && body.velocity.y < -220)
      body.setVelocityY(body.velocity.y * 0.58);
    this.jumpHeld = input.jump;
    if (input.horizontal) this.facing = input.horizontal > 0 ? 1 : -1;
    if (input.dashPressed && progress >= 1 && time > this.dashReady) {
      this.dashEnd = time + 155;
      this.dashReady = time + (this.scene.app.store.data.upgrades.includes('phase') ? 650 : 1050);
      this.scene.app.audio.cue('dash');
    }
    if (input.shieldPressed && progress >= 5 && time > this.shieldReady) {
      this.shieldEnd = time + 1300;
      this.shieldReady = time + 4500;
      this.scene.app.audio.cue('shield');
    }
    if (time < this.dashEnd) {
      body.setAllowGravity(false).setVelocity(this.facing * 700, 0);
      if (time - this.lastTrail > 30) {
        this.lastTrail = time;
        this.scene.fx.burst(sprite.x, sprite.y - 50, 0x8ee0d3, 3, 35);
      }
    } else {
      body.setAllowGravity(true);
      const speed = this.crouching ? 125 : 330;
      const target = input.horizontal * speed;
      const difference = target - body.velocity.x;
      body.setVelocityX(
        body.velocity.x +
          Math.sign(difference) *
            Math.min(Math.abs(difference), ((input.horizontal ? 2300 : 2800) * delta) / 1000),
      );
    }
    sprite.setFlipX(this.facing > 0);
    if (grounded && Math.abs(body.velocity.x) > 35 && time - this.lastStep > 290) {
      this.lastStep = time;
      this.scene.app.audio.cue('step');
    }
    const frame = grounded && Math.abs(body.velocity.x) > 35 ? 1 + (Math.floor(time / 85) % 6) : 0;
    sprite.setTexture(`hoshi-${frame}`);
    sprite.setAlpha(time < this.invulnerable ? 0.45 + Math.sin(time * 0.018) * 0.2 : 1);
    if (time < this.shieldEnd) sprite.setTint(0xb6f6e4);
    else sprite.clearTint();
    sprite.x = Math.max(30, Math.min(this.scene.level.width - 30, sprite.x));
    const fallLimit = this.scene.exploration?.contains(sprite.x) ? this.scene.level.height : 805;
    if (sprite.y > fallLimit) this.recall(true);
  }
  recall(fall = false) {
    const time = this.scene.time.now;
    if (!fall && (time < this.invulnerable || time < this.dashEnd || time < this.shieldEnd)) return;
    this.scene.recalls += 1;
    this.stability -= 1;
    this.invulnerable = time + 1800;
    this.scene.app.audio.cue('recall');
    this.scene.fx.burst(this.sprite.x, this.sprite.y - 50, 0xf1ce91, 18, 160);
    if (
      fall ||
      this.stability <= 0 ||
      this.scene.app.store.data.settings.difficulty === 'voyager'
    ) {
      this.sprite.body.reset(this.scene.checkpointX, this.scene.checkpointY ?? 620);
      this.sprite.body.setVelocity(0, 0);
      this.stability = 3;
      this.scene.caption('A little detour. Your progress is safe.');
    } else this.sprite.body.setVelocity(-this.facing * 220, -220);
    this.scene.fx.shake(0.003, 90);
    this.scene.app.ui.hud(this.scene);
  }
}

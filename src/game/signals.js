import { availableTools } from '../data/campaign.js';

export class Signals {
  constructor(scene) {
    this.scene = scene;
    this.tools = availableTools(scene.app.store.data, scene.level.id);
    this.index = 0;
    this.ready = 0;
    this.pool = scene.physics.add.group({ defaultKey: 'spark', maxSize: 32, allowGravity: false });
  }
  get tool() {
    return this.tools[this.index];
  }
  cycle() {
    this.index = (this.index + 1) % this.tools.length;
    this.scene.app.audio.cue('click');
    this.scene.app.ui.hud(this.scene);
  }
  send(input) {
    const scene = this.scene;
    const time = scene.time.now;
    if (time < this.ready) return;
    const tool = this.tool;
    const player = scene.player;
    this.ready =
      time + tool.cooldown * (scene.app.store.data.upgrades.includes('resonance') ? 0.75 : 1);
    const origin = {
      x: player.sprite.x + player.facing * 24,
      y: player.sprite.y - (player.crouching ? 37 : 60),
    };
    let angle = input.up ? -Math.PI / 2 : player.facing < 0 ? Math.PI : 0;
    if (Math.hypot(input.aimX, input.aimY) > 0.35) angle = Math.atan2(input.aimY, input.aimX);
    else if (!input.up) {
      const targets = [
        ...scene.relays.filter((relay) => !relay.active),
        ...(scene.keeper?.targets() || []),
        ...scene.patrols.filter((patrol) => time > patrol.quietUntil),
      ];
      let closest = 420;
      for (const target of targets) {
        const horizontal = target.x - origin.x;
        const vertical = target.y - origin.y;
        const distance = Math.hypot(horizontal, vertical);
        if (horizontal * player.facing > 0 && Math.abs(vertical) < 110 && distance < closest) {
          closest = distance;
          angle = Math.atan2(vertical, horizontal);
        }
      }
    }
    const spread = tool.id === 'chorus' ? [-0.18, 0, 0.18] : [0];
    for (const offset of spread) {
      const mote = this.pool.get(origin.x, origin.y);
      if (!mote) continue;
      mote
        .enableBody(true, origin.x, origin.y, true, true)
        .setScale(tool.id === 'prism' ? 1.6 : 1.1)
        .setTint(tool.color)
        .setDepth(24);
      mote.body
        .setAllowGravity(false)
        .setVelocity(Math.cos(angle + offset) * tool.speed, Math.sin(angle + offset) * tool.speed);
      mote.expires = time + (tool.range / tool.speed) * 1000;
      mote.tool = tool;
      mote.tuned = new Set();
    }
    scene.app.audio.cue(tool.id);
    scene.fx.burst(origin.x, origin.y, tool.color, 4, 65);
  }
  update(time) {
    for (const mote of this.pool.getChildren()) {
      if (!mote.active) continue;
      if (time > mote.expires) {
        mote.disableBody(true, true);
        continue;
      }
      for (const relay of this.scene.relays) {
        if (
          !relay.active &&
          !mote.tuned.has(relay) &&
          Math.hypot(mote.x - relay.x, mote.y - relay.y) < 29
        ) {
          mote.tuned.add(relay);
          this.scene.tune(relay, mote.tool);
          if (mote.tool.id !== 'prism' && mote.tool.id !== 'echo') {
            mote.disableBody(true, true);
            break;
          }
        }
      }
      if (!mote.active) continue;
      for (const patrol of this.scene.patrols) {
        if (Math.hypot(mote.x - patrol.x, mote.y - patrol.y) < 33) {
          patrol.quiet(time);
          mote.disableBody(true, true);
          break;
        }
      }
      if (mote.active && this.scene.keeper?.receive(mote.x, mote.y, mote.tool))
        mote.disableBody(true, true);
    }
  }
}

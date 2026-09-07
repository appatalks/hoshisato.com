import Phaser from 'phaser';
import { lowerRoute } from '../data/exploration.js';
import { seeded } from '../art/illustration.js';

export class Exploration {
  constructor(scene) {
    this.scene = scene;
    this.route = lowerRoute(scene.level);
    this.wasBelow = false;
    this.entered = false;
    this.open = scene.app.store.data.routes.includes(scene.level.id);
    this.build();
  }
  contains(left) {
    return left >= this.route.left - 20 && left <= this.route.right + 20;
  }
  solid(left, top, width, height, color = 0x26363c) {
    const scene = this.scene;
    const block = scene.add.zone(left + width / 2, top + height / 2, width, height);
    scene.physics.add.existing(block, true);
    scene.ground.add(block);
    block.oneWay = false;
    const image = scene.add
      .rectangle(left, top, width, height, color)
      .setOrigin(0)
      .setStrokeStyle(2, 0x809591, 0.65)
      .setDepth(13);
    return { block, image };
  }
  build() {
    const scene = this.scene;
    const route = this.route;
    const random = seeded(scene.level.id + 1128);
    const cave = ['cave', 'crystal', 'crypt'].includes(route.style);
    const color = Phaser.Display.Color.HexStringToColor(scene.theme.mid).color;
    const accent = Phaser.Display.Color.HexStringToColor(scene.theme.accent).color;
    const back = scene.add.graphics().setDepth(-10);
    back.fillStyle(0x111923);
    back.fillRect(0, 737, scene.level.width, route.bottom - 570);
    back.fillStyle(cave ? 0x243138 : 0x202b38);
    back.fillRect(route.left, 737, route.right - route.left, route.bottom - 570);
    if (cave) {
      for (let index = 0; index < 7; index += 1) {
        const left = route.left + 90 + index * 190;
        back.lineStyle(16, color, 0.16);
        back.strokeEllipse(left, 1130, 230, 550);
        back.lineStyle(2, accent, 0.12);
        back.strokeEllipse(left + 15, 1130, 230, 550);
      }
    }
    for (let layer = 0; layer < 3; layer += 1) {
      for (let index = 0; index < 15; index += 1) {
        const left = route.left + random() * (route.right - route.left);
        const top = 742 + random() * 90;
        if (cave) {
          back.fillStyle(color, 0.12 + layer * 0.07);
          back.fillTriangle(left - 45, 737, left + 45, 737, left + 10, top + 100 + random() * 220);
          back.fillTriangle(
            left - 65,
            route.bottom + 80,
            left + 75,
            route.bottom + 80,
            left,
            route.bottom - 70 - random() * 160,
          );
        } else {
          back.lineStyle(5 + layer * 2, color, 0.2);
          back.lineBetween(left, 740, left, route.bottom);
          back.lineStyle(2, accent, 0.15);
          back.strokeRect(left + 8, top + 120, 46, 180);
        }
      }
    }
    for (let left = route.left + 50; left < route.right; left += 145) {
      back.lineStyle(1, 0xa4b8bd, 0.18);
      back.strokeCircle(left, route.bottom - 420, 40);
      back.lineStyle(1, accent, 0.2);
      back.lineBetween(left, route.bottom - 380, left + 140, route.bottom - 380);
      if (route.style === 'crystal') {
        back.fillStyle(0xae9bca, 0.45);
        back.fillTriangle(
          left,
          route.bottom,
          left + 25,
          route.bottom - 150,
          left + 45,
          route.bottom,
        );
        back.lineStyle(1, 0xe2caed, 0.6);
        back.lineBetween(left + 25, route.bottom - 150, left + 22, route.bottom);
      }
    }
    this.solid(route.left - 32, 734, 32, route.bottom - 600);
    this.solid(route.right, 734, 32, route.bottom - 600);
    const middle = route.left + (route.right - route.left) * 0.54;
    if (route.obstacle === 'bridge') {
      scene.platform(route.left, route.bottom, middle - route.left - 60, 'floor');
      scene.platform(middle + 190, route.bottom, route.right - middle - 190, 'floor');
      scene.platform(middle - 60, route.bottom - 35, 170, 'lift');
      scene.platform(middle + 90, route.bottom - 100, 170, 'phase');
      scene.label(
        middle + 80,
        route.bottom + 135,
        'UNSTABLE TRANSIT / PHASE BRIDGE',
        '#b6c8c0',
        12,
      );
    } else scene.platform(route.left, route.bottom, route.right - route.left, 'floor');
    for (const [left, top, width] of route.ledges) scene.platform(left, top, width);
    if (route.obstacle === 'crawl') {
      this.solid(middle, route.bottom - 400, 160, 318, cave ? 0x3b4350 : 0x4b4550);
      scene.label(
        middle + 80,
        route.bottom - 470,
        cave ? 'NARROW PASSAGE' : 'SERVICE CONDUIT',
        '#efc58d',
        14,
      );
      scene.label(middle - 75, route.bottom - 25, 'S / CROUCH', '#d9d9bc', 12);
    }
    if (route.obstacle === 'gate') {
      this.gate = this.solid(middle, route.bottom - 350, 34, 350, 0x754557);
      if (this.open) this.unlock();
      scene.station(
        middle - 115,
        'Imperial override',
        () => {
          this.open = true;
          this.unlock();
          scene.app.audio.cue('door');
          scene.caption('Imperial access seal accepted. Your authority has its uses.');
        },
        'terminal',
        route.bottom,
      );
    }
    this.curtain = scene.add
      .rectangle(middle + 280, route.bottom - 100, 13, 200, 0xe8b897, 0.12)
      .setDepth(13);
    scene.label(route.left + 190, 760, route.name.toUpperCase(), '#e7c490', 17);
    scene.add
      .text(route.entry, 756, 'V', { fontFamily: 'Rajdhani', fontSize: '25px', color: '#e6c790' })
      .setOrigin(0.5)
      .setDepth(15);
    scene
      .station(
        route.gapLeft - 75,
        'Descend to lower passage',
        () => this.descend(),
        'terminal',
        620,
      )
      .image.setScale(0.62);
    this.cache = scene.station(
      route.cache.x,
      'Read the imperial cache',
      () => {
        scene.app.store.add('routes', scene.level.id);
        scene.app.achievement('depths');
        scene.app.audio.cue('secret');
        this.open = true;
        this.unlock();
        this.cache.image.setTint(0xf3d38a);
        scene.app.ui.message(route.name, route.message);
      },
      'artifact',
      route.cache.y,
    );
    if (this.open) this.cache.image.setTint(0xf3d38a);
    scene.station(
      route.lift.x,
      'Return lift / upper route',
      () => this.returnToSurface(),
      'portal',
      route.bottom,
    );
    scene
      .station(
        route.left + 65,
        'Emergency ascent',
        () => this.returnToSurface(),
        'terminal',
        route.bottom,
      )
      .image.setScale(0.7);
    this.light = scene.add.graphics().setDepth(19);
    this.foreground = scene.add.graphics().setDepth(26);
    this.foreground.fillStyle(0x09131b, 0.5);
    for (let left = route.left; left < route.right; left += 180)
      this.foreground.fillTriangle(
        left - 15,
        route.bottom + 75,
        left + 15,
        route.bottom - 20,
        left + 45,
        route.bottom + 75,
      );
    scene.add.rectangle(route.left + 16, route.bottom - 280, 4, 110, 0xd49f86).setDepth(14);
    scene.add.rectangle(route.right - 16, route.bottom - 280, 4, 110, 0xd49f86).setDepth(14);
  }
  unlock() {
    if (!this.gate) return;
    this.gate.block.body.enable = false;
    this.gate.image.setAlpha(0.15);
  }
  descend() {
    const scene = this.scene;
    const route = this.route;
    scene.player.sprite.body.reset(route.entry, 847);
    scene.player.sprite.body.setVelocity(0, 0);
    scene.player.invulnerable = scene.time.now + 1400;
    scene.app.audio.cue('door');
    scene.caption(
      'Below the official maps. Two memory stars, an imperial cache, and another way through.',
    );
  }
  returnToSurface() {
    const scene = this.scene;
    const route = this.route;
    scene.player.sprite.body.reset(route.exit.x, route.exit.y);
    scene.player.sprite.body.setVelocity(0, 0);
    scene.checkpointX = scene.level.checkpoint;
    scene.checkpointY = 620;
    scene.persist();
    scene.app.audio.cue('door');
    scene.caption('Upper route reached. The passage remains yours to explore.');
  }
  update(time) {
    const scene = this.scene;
    const route = this.route;
    const sprite = scene.player.sprite;
    const below = sprite.y > 785 && this.contains(sprite.x);
    const cycle = (time + scene.level.id * 300) % 4200;
    const active = cycle > 2300 && cycle < 3300;
    this.curtain.setAlpha(active ? 0.6 : cycle > 1800 && cycle < 2300 ? 0.25 : 0.08);
    if (
      below &&
      active &&
      Math.abs(sprite.x - this.curtain.x) < 24 &&
      sprite.y > route.bottom - 190
    )
      scene.player.recall();
    this.light.clear();
    if (below) {
      this.light.fillStyle(0xd3dfb3, 0.04);
      this.light.fillTriangle(
        sprite.x,
        sprite.y - 62,
        sprite.x + scene.player.facing * 300,
        sprite.y - 180,
        sprite.x + scene.player.facing * 300,
        sprite.y + 50,
      );
      if (!this.entered) {
        this.entered = true;
        scene.caption(`${route.name}. The official maps end here.`, 6500);
      }
      if (!this.wasBelow) {
        scene.app.ui.hud(scene);
        scene.app.audio.depth = true;
      }
      if (
        Math.abs(sprite.x - route.checkpoint.x) < 170 &&
        sprite.y >= route.bottom - 10 &&
        scene.checkpointY !== route.bottom
      ) {
        scene.checkpointX = route.checkpoint.x;
        scene.checkpointY = route.bottom;
        scene.player.stability = 3;
        scene.persist();
        scene.caption('Lower passage checkpoint saved.');
        scene.app.audio.cue('relay');
      }
    } else if (this.wasBelow) {
      scene.app.ui.hud(scene);
      scene.app.audio.depth = false;
    }
    this.wasBelow = below;
  }
}

import Phaser from 'phaser';
import { asteroidLayout } from '../art/expeditions.js';

export class ExpeditionEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(5);
    this.patrols = [];
    this.rocks = [];
    this.exposure = 0;
    if (scene.collection === 'away') {
      for (const [left, top, width, height] of scene.level.walls) {
        const wall = scene.add.zone(left + width / 2, top + height / 2, width, height);
        scene.physics.add.existing(wall, true);
        scene.solids.add(wall);
      }
      this.roots = (scene.level.hazards || [])
        .filter((field) => field[4] === 'roots')
        .map(([left, top, width, height]) => {
          const wall = scene.add.zone(left + width / 2, top + height / 2, width, height);
          scene.physics.add.existing(wall, true);
          scene.solids.add(wall);
          return wall;
        });
    } else {
      for (const rock of asteroidLayout(scene.level)) {
        const image = scene.physics.add
          .staticImage(rock.x, rock.y, `exp-rock-${rock.variant}`)
          .setDisplaySize(rock.radius * 2, rock.radius * 2)
          .setDepth(8);
        image.refreshBody();
        image.body.setCircle(rock.radius);
        scene.solids.add(image);
        this.rocks.push({ ...rock, image });
      }
      for (const [left, top] of scene.level.patrols || [])
        this.patrols.push({
          x: left,
          y: top,
          homeX: left,
          homeY: top,
          image: scene.add
            .image(left, top, 'exp-ship')
            .setScale(0.42)
            .setTint(0xd494ac)
            .setDepth(14),
        });
    }
  }
  update(time, delta) {
    const scene = this.scene;
    const mission = scene.level;
    const player = scene.player.sprite;
    const seconds = Math.min(delta, 40) / 1000;
    const graphics = this.graphics;
    graphics.clear();
    if (scene.collection === 'away') {
      let pressure = false;
      for (const [left, top, width, height, kind] of mission.hazards) {
        const cycle = (time + left * 3) % 6000;
        const open = kind === 'roots' ? scene.completed.includes(0) : cycle < 3300;
        const color =
          kind === 'vent'
            ? 0xe8ae8c
            : kind === 'roots'
              ? 0x86ad87
              : kind === 'wind'
                ? 0xbcdfe7
                : 0x89bdd3;
        graphics.fillStyle(color, open ? 0.07 : 0.28);
        graphics.fillRect(left, top, width, height);
        graphics.lineStyle(2, color, 0.6);
        graphics.strokeRect(left, top, width, height);
        for (let line = 0; line < 6; line += 1) {
          const offset = scene.settings.reducedMotion ? 0 : (time * 0.02) % 30;
          graphics.lineStyle(1, color, 0.2);
          graphics.lineBetween(
            left + offset,
            top + (height / 6) * line,
            left + width - 12,
            top + (height / 6) * line + 15,
          );
        }
        const inside =
          player.x > left && player.x < left + width && player.y > top && player.y < top + height;
        if (inside && kind === 'wind') player.body.velocity.x += 100 * seconds;
        else if (inside && !open && kind !== 'roots') pressure = true;
      }
      for (const root of this.roots) root.body.enable = !scene.completed.includes(0);
      this.exposure = pressure ? this.exposure + delta : 0;
      if (this.exposure > 800) {
        scene.player.recall();
        this.exposure = 0;
        scene.caption(
          'The field is changing. Wait for a quiet window or take the long way around.',
        );
      }
      if (mission.rule === 'mirage') {
        for (let index = 0; index < 4; index += 1) {
          graphics.lineStyle(2, 0xe9d3bb, scene.scanUntil > time ? 0.04 : 0.27);
          graphics.strokeCircle(660 + index * 280, 520 + (index % 2) * 350, 36);
        }
      }
      if (mission.rule === 'eclipse') {
        const dark = time % 9000 > 4200;
        graphics.fillStyle(0x12132d, dark ? 0.16 : 0.04);
        graphics.fillRect(0, 0, mission.width, mission.height);
      }
    } else {
      for (const rock of this.rocks) {
        const left = rock.x + Math.sin(time * rock.speed + rock.phase) * 24;
        const top = rock.y + Math.cos(time * rock.speed + rock.phase) * 18;
        rock.image.setPosition(left, top);
        rock.image.body.updateFromGameObject();
        if (!scene.settings.reducedMotion) rock.image.rotation = time * rock.speed * 0.13;
      }
      for (const [left, top, radius, kind] of mission.fields) {
        const distance = Math.hypot(player.x - left, player.y - top);
        const color = kind === 'gravity' ? 0xbfa5dd : kind === 'current' ? 0x89d6dc : 0xb9c9dd;
        for (let ring = 0; ring < 4; ring += 1) {
          graphics.lineStyle(1, color, 0.09 + ring * 0.04);
          graphics.strokeCircle(left, top, radius * (0.3 + ring * 0.23));
        }
        if (kind === 'gravity') {
          graphics.fillStyle(0x0a0d19, 0.85);
          graphics.fillCircle(left, top, radius * 0.22);
          if (distance < radius * 1.7) {
            const force = Phaser.Math.Clamp(10000 / Math.max(distance, 50), 0, 160);
            player.body.velocity.x += ((left - player.x) / Math.max(distance, 1)) * force * seconds;
            player.body.velocity.y += ((top - player.y) / Math.max(distance, 1)) * force * seconds;
          }
          if (distance < radius * 0.24) scene.player.recall();
        } else if (kind === 'current' && distance < radius) {
          player.body.velocity.x += 90 * seconds;
          player.body.velocity.y -= 50 * seconds;
        } else if (kind === 'rift' && distance < radius * 0.45 && time % 6000 > 3500)
          scene.player.recall();
      }
      for (const patrol of this.patrols) {
        const decoy = scene.scanUntil > time;
        const target = decoy ? { x: patrol.homeX - 240, y: patrol.homeY + 100 } : player;
        const detect = Math.hypot(player.x - patrol.x, player.y - patrol.y) < 330;
        const targetX = detect || decoy ? target.x : patrol.homeX + Math.sin(time * 0.0005) * 170;
        const targetY = detect || decoy ? target.y : patrol.homeY + Math.cos(time * 0.0005) * 100;
        patrol.x = Phaser.Math.Linear(patrol.x, targetX, Math.min(1, seconds * 0.35));
        patrol.y = Phaser.Math.Linear(patrol.y, targetY, Math.min(1, seconds * 0.35));
        patrol.image
          .setPosition(patrol.x, patrol.y)
          .setRotation(Math.atan2(targetY - patrol.y, targetX - patrol.x) + Math.PI / 2);
        graphics.lineStyle(1, decoy ? 0x8edcca : 0xe1a3b8, 0.25);
        graphics.strokeCircle(patrol.x, patrol.y, 120);
        if (!decoy && Math.hypot(player.x - patrol.x, player.y - patrol.y) < 65)
          scene.player.recall();
      }
      if (scene.towing && scene.cargo) {
        scene.cargo.x = Phaser.Math.Linear(
          scene.cargo.x,
          player.x - Math.sin(scene.player.heading) * 100,
          0.05,
        );
        scene.cargo.y = Phaser.Math.Linear(
          scene.cargo.y,
          player.y + Math.cos(scene.player.heading) * 100,
          0.05,
        );
        graphics.lineStyle(2, 0x9edcc9, 0.6);
        graphics.lineBetween(player.x, player.y, scene.cargo.x, scene.cargo.y);
      }
      if (scene.escort) {
        const distance = Phaser.Math.Distance.BetweenPoints(scene.escort, player);
        if (distance < 600 && distance > 105) {
          const direction = new Phaser.Math.Vector2(
            player.x - scene.escort.x,
            player.y - scene.escort.y,
          ).normalize();
          scene.escort.x += direction.x * 125 * seconds;
          scene.escort.y += direction.y * 125 * seconds;
          scene.escort.rotation = Math.atan2(direction.y, direction.x) + Math.PI / 2;
        }
        graphics.lineStyle(1, 0xa4d7c8, 0.2);
        graphics.lineBetween(scene.escort.x, scene.escort.y, player.x, player.y);
      }
    }
  }
}

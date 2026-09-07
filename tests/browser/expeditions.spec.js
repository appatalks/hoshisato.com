import { test, expect } from '@playwright/test';

async function launch(page, collection, level = 0) {
  await page.goto('/?qa=1');
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror.scene?.isHub && window.__mirror.scene.player);
  await page.evaluate((mode) => window.__mirror.ui.expeditions.list(mode), collection);
  await expect(page.locator('[data-expedition]:enabled')).toHaveCount(10);
  await page.locator(`[data-expedition="${level}"]`).click();
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    (mode) => window.__mirror.scene?.collection === mode && window.__mirror.scene.nodes?.length > 0,
    collection,
  );
}

test('the two physical Defiant terminals open their own mission catalogs', async ({ page }) => {
  await page.goto('/?qa=1');
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror.scene?.isHub && window.__mirror.scene.player);
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 750);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await expect(page.locator('#panel-title')).toHaveText('Away Missions');
  await expect(page.locator('[data-expedition]')).toHaveCount(10);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1110);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await expect(page.locator('#panel-title')).toHaveText('Shuttle Bay');
  await expect(page.locator('[data-expedition]')).toHaveCount(10);
});

test('Defiant terminals launch distinct away and flight collections without touching Star Chart progress', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await launch(page, 'away');
  expect(await page.evaluate(() => window.__mirror.scene.level.title)).toBe(
    'The Shore That Answers',
  );
  await page.waitForFunction(() => !window.__mirror.scene.cameras.main.fadeEffect.isRunning);
  await page.screenshot({ path: 'test-results/away-review.png' });
  await page.keyboard.down('w');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.y < 1380);
  await page.keyboard.up('w');
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 370);
  await page.keyboard.up('d');
  await page.keyboard.press('m');
  await expect(page.locator('#panel-title')).toHaveText('Planetary Field Survey');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.press('h');
  await page.locator('#skip-travel').click();
  await page.waitForFunction(() => window.__mirror.scene?.isHub && window.__mirror.scene.player);
  const terminals = await page.evaluate(() =>
    window.__mirror.scene.stations.map((station) => station.label),
  );
  expect(terminals).toContain('Away Missions');
  expect(terminals).toContain('Shuttle Bay');
  await page.evaluate(() => window.__mirror.ui.expeditions.list('shuttle'));
  await page.locator('[data-expedition="0"]').click();
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    () =>
      window.__mirror.scene?.collection === 'shuttle' && window.__mirror.scene.nodes?.length > 0,
  );
  await page.keyboard.down('w');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed > 100);
  await page.keyboard.up('w');
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.body.speed)).toBeGreaterThan(
    60,
  );
  await page.keyboard.down('s');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed < 20);
  await page.keyboard.up('s');
  await page.screenshot({ path: 'test-results/shuttle-review.png' });
  expect(await page.evaluate(() => window.__mirror.store.data.completed)).toEqual([]);
  expect(errors).toEqual([]);
});

test('planetary movement reaches a landmark and flight control reaches a navigation ring', async ({
  page,
}) => {
  await launch(page, 'away');
  await page.keyboard.down('w');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.y < 1230);
  await page.keyboard.up('w');
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 620);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.completed.includes(0));
  expect(
    await page.evaluate(() => window.__mirror.store.data.away.checkpoint.objectives),
  ).toContain(0);
  await page.evaluate(() => window.__mirror.launch(0, false, false, 'shuttle'));
  await page.waitForFunction(
    () =>
      window.__mirror.scene?.collection === 'shuttle' && window.__mirror.scene.nodes?.length > 0,
  );
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.heading > 1.05);
  await page.keyboard.up('d');
  await page.keyboard.down('w');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 575);
  await page.keyboard.up('w');
  await page.waitForFunction(() => window.__mirror.scene.completed.includes(0), null, {
    timeout: 7000,
  });
  await page.keyboard.down('s');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed < 20);
  await page.keyboard.up('s');
  expect(
    await page.evaluate(() => window.__mirror.store.data.shuttle.checkpoint.objectives),
  ).toContain(0);
});

test('all twenty expeditions complete with separate records, discoveries and return loops', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    const readbackWarning = /GL Driver Message.*GPU stall due to ReadPixels/.test(message.text());
    if (message.type() === 'error' || (message.type() === 'warning' && !readbackWarning))
      errors.push(message.text());
  });
  await launch(page, 'away');
  for (const collection of ['away', 'shuttle']) {
    for (let level = 0; level < 10; level += 1) {
      if (collection !== 'away' || level !== 0) {
        await page.evaluate(({ mode, id }) => window.__mirror.launch(id, false, false, mode), {
          mode: collection,
          id: level,
        });
        await page.waitForFunction(
          ({ mode, id }) =>
            window.__mirror.scene?.collection === mode &&
            window.__mirror.scene.level.id === id &&
            window.__mirror.scene.nodes?.length > 0,
          { mode: collection, id: level },
        );
      }
      await page.waitForFunction(() => !window.__mirror.scene.cameras.main.fadeEffect.isRunning);
      const initial = await page.evaluate(() => ({
        position: [window.__mirror.scene.player.sprite.x, window.__mirror.scene.player.sprite.y],
        nodes: window.__mirror.scene.nodes.length,
        objects: window.__mirror.scene.children.length,
      }));
      expect(initial.position.every(Number.isFinite)).toBe(true);
      expect(initial.objects).toBeLessThan(160);
      const colors = await page.evaluate(
        () =>
          new Promise((resolve) => {
            window.__mirror.game.renderer.snapshot((image) => {
              const canvas = document.createElement('canvas');
              canvas.width = image.width;
              canvas.height = image.height;
              const context = canvas.getContext('2d');
              context.drawImage(image, 0, 0);
              const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
              const palette = new Set();
              for (let index = 0; index < data.length; index += 2048)
                palette.add(`${data[index]},${data[index + 1]},${data[index + 2]}`);
              resolve(palette.size);
            });
          }),
      );
      expect(colors).toBeGreaterThan(30);
      await page.screenshot({
        path: `test-results/${collection}-${String(level + 1).padStart(2, '0')}.png`,
      });
      for (let index = 0; index < initial.nodes; index += 1) {
        if (collection === 'away' && level === 9 && index === 2)
          await page.waitForFunction(() => window.__mirror.scene.time.now % 9000 > 4300);
        await page.evaluate((objective) => {
          const scene = window.__mirror.scene;
          const node = scene.nodes[objective];
          scene.player.sprite.body.reset(node.x, node.y);
          scene.player.sprite.body.setVelocity(0, 0);
          scene.player.invulnerable = scene.time.now + 1500;
          if (scene.escort) scene.escort.setPosition(node.x - 90, node.y + 50);
        }, index);
        await page.keyboard.press('e');
        await page.waitForFunction(
          (objective) => window.__mirror.scene.completed.includes(objective),
          index,
        );
      }
      await page.evaluate(() => {
        const scene = window.__mirror.scene;
        scene.player.sprite.body.reset(...scene.level.relic);
        scene.player.sprite.body.setVelocity(0, 0);
      });
      await page.keyboard.press('e');
      await expect(page.locator('#panel-title')).toHaveText('An Uncharted Discovery');
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await page.evaluate(() => {
        const scene = window.__mirror.scene;
        scene.player.sprite.body.reset(...scene.level.exit);
        scene.player.sprite.body.setVelocity(0, 0);
      });
      await page.keyboard.press('e');
      await expect(page.locator('#panel-title')).toHaveText('Mission Complete');
      expect(
        await page.evaluate(
          (mode) => window.__mirror.store.data[mode].completed.length,
          collection,
        ),
      ).toBe(level + 1);
      await page.getByRole('button', { name: 'Return to the Defiant', exact: true }).click();
      await page.locator('#skip-travel').click();
      await page.waitForFunction(
        () => window.__mirror.scene?.isHub && window.__mirror.scene.player,
      );
    }
  }
  const records = await page.evaluate(() => ({
    star: window.__mirror.store.data.completed,
    away: window.__mirror.store.data.away,
    shuttle: window.__mirror.store.data.shuttle,
  }));
  expect(records.star).toEqual([]);
  expect(records.away.completed).toHaveLength(10);
  expect(records.shuttle.completed).toHaveLength(10);
  expect(records.away.discoveries).toHaveLength(10);
  expect(records.shuttle.discoveries).toHaveLength(10);
  expect(errors).toEqual([]);
});

test('expedition resume, survey, controls and reset preserve the correct collection', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await launch(page, 'shuttle', 3);
  await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const node = scene.nodes[0];
    scene.player.sprite.body.reset(node.x, node.y);
    scene.interact(node);
  });
  expect(await page.evaluate(() => window.__mirror.scene.towing)).toBe(true);
  await page.reload();
  await page.getByRole('button', { name: 'RESUME YOUR JOURNEY', exact: true }).click();
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.collection === 'shuttle' && window.__mirror.scene.towing,
  );
  expect(await page.evaluate(() => window.__mirror.scene.completed)).toEqual([0]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Controls', exact: true }).click();
  await expect(page.locator('#panel-title')).toHaveText('At the Helm');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.press('m');
  await expect(page.locator('#panel-title')).toHaveText('Navigation Plot');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Options', exact: true }).click();
  await page.locator('[data-action="reset"]').click();
  await page.locator('[data-action="confirm-reset"]').click();
  expect(await page.evaluate(() => window.__mirror.store.data.shuttle.checkpoint)).toBeNull();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      ),
  );
  expect(
    await page.evaluate(
      () => window.__mirror.game.canvas.width > 0 && window.__mirror.game.canvas.height > 0,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('an Away Mission can be completed with only normal movement and interaction keys', async ({
  page,
}) => {
  test.setTimeout(60000);
  await launch(page, 'away');
  async function walk(axis, target) {
    const value = await page.evaluate(
      (coordinate) => window.__mirror.scene.player.sprite[coordinate],
      axis,
    );
    const positive = target > value;
    const key = axis === 'x' ? (positive ? 'd' : 'a') : positive ? 's' : 'w';
    await page.keyboard.down(key);
    await page.waitForFunction(
      ({ coordinate, goal, increasing }) =>
        increasing
          ? window.__mirror.scene.player.sprite[coordinate] > goal - 12
          : window.__mirror.scene.player.sprite[coordinate] < goal + 12,
      { coordinate: axis, goal: target, increasing: positive },
    );
    await page.keyboard.up(key);
    await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed < 10);
  }
  await walk('y', 1220);
  await walk('x', 640);
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.completed.includes(0));
  await walk('y', 790);
  await walk('x', 1490);
  await walk('y', 1150);
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.completed.includes(1));
  await walk('y', 490);
  await walk('x', 1840);
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.completed.includes(2));
  await walk('x', 2110);
  await walk('y', 360);
  await page.keyboard.press('e');
  await expect(page.locator('#panel-title')).toHaveText('Mission Complete');
});

test('flight route completes through pilot inputs without teleporting or editing physics', async ({
  page,
}) => {
  test.setTimeout(90000);
  await launch(page, 'shuttle');
  const result = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const app = window.__mirror;
        const started = performance.now();
        const steer = () => {
          const scene = app.scene;
          if (scene.finished) {
            app.input.clear();
            resolve({ complete: true, recalls: scene.recalls });
            return;
          }
          if (performance.now() - started > 70000) {
            app.input.clear();
            resolve({
              complete: false,
              objectives: scene.completed,
              position: [scene.player.sprite.x, scene.player.sprite.y],
            });
            return;
          }
          const target = scene.nodes.find((node) => !scene.completed.includes(node.index)) || {
            x: scene.level.exit[0],
            y: scene.level.exit[1],
          };
          const sprite = scene.player.sprite;
          const distance = Math.hypot(target.x - sprite.x, target.y - sprite.y);
          const desired = Math.atan2(target.x - sprite.x, -(target.y - sprite.y));
          const error = Math.atan2(
            Math.sin(desired - scene.player.heading),
            Math.cos(desired - scene.player.heading),
          );
          app.input.held.clear();
          if (Math.abs(error) > 0.045) app.input.held.add(error > 0 ? 'right' : 'left');
          const limit = Math.min(195, Math.max(30, distance * 0.9));
          if (
            sprite.body.speed > limit ||
            (Math.abs(error) > 0.65 && sprite.body.speed > 60) ||
            distance < 70
          )
            app.input.held.add('down');
          else if (Math.abs(error) < 0.3 && distance > 45) app.input.held.add('up');
          if (distance < 85 && sprite.body.speed < 65) app.input.pressed.add('interact');
          requestAnimationFrame(steer);
        };
        requestAnimationFrame(steer);
      }),
  );
  expect(result.complete).toBe(true);
  await expect(page.locator('#panel-title')).toHaveText('Mission Complete');
});

test('touch controls and vertical gamepad input work in the new modes', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await launch(page, 'away');
  await expect(page.locator('#expedition-touch')).toBeVisible();
  await expect(page.locator('#touch-controls')).not.toBeVisible();
  const up = page.locator('#expedition-touch [data-touch="up"]');
  await up.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch' });
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.y < 1400);
  await up.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch' });
  await page.screenshot({ path: 'test-results/away-mobile.png' });
  const screenY = await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const camera = scene.cameras.main;
    return (
      (scene.player.sprite.y - camera.scrollY - camera.height / 2) * camera.zoom + camera.height / 2
    );
  });
  expect(screenY).toBeLessThan(590);
  await page.evaluate(() => window.__mirror.launch(0, false, false, 'shuttle'));
  await page.waitForFunction(
    () =>
      window.__mirror.scene?.collection === 'shuttle' && window.__mirror.scene.nodes?.length > 0,
  );
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForFunction(() => window.__mirror.scene.scale.width === 844);
  await expect(page.locator('#expedition-touch [data-touch="interact"]')).toBeInViewport();
  await page.evaluate(() => {
    window.expeditionPad = {
      connected: true,
      mapping: 'standard',
      axes: [0, -1, 0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    };
    Object.defineProperty(navigator, 'getGamepads', { value: () => [window.expeditionPad] });
  });
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed > 90);
  await page.evaluate(() => {
    window.expeditionPad.axes[1] = 1;
  });
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.speed < 20);
  await page.screenshot({ path: 'test-results/shuttle-mobile.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await context.close();
});

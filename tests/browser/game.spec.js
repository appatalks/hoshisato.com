import { test, expect } from '@playwright/test';

async function launch(page) {
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'BEGIN YOUR JOURNEY', exact: true }).click();
  await page.waitForFunction(
    () => window.__mirror?.scene?.player && window.__mirror.scene.time.now > 150,
  );
}

test('fresh title, genuine autograph, credits, settings and desktop pixels', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?qa=1');
  await expect(page.getByRole('heading', { name: 'HOSHI SATO.' })).toBeVisible();
  const colors = await page.evaluate(() => {
    const canvas = document.querySelector('#title-art');
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    const samples = new Set();
    for (let index = 0; index < pixels.length; index += 1024)
      samples.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`);
    return samples.size;
  });
  expect(colors).toBeGreaterThan(60);
  await page.screenshot({ path: 'test-results/title-desktop.png' });
  await page.locator('.autograph-link').click();
  await expect(page.locator('.autograph-original')).toBeVisible();
  expect(
    await page
      .locator('.autograph-original')
      .evaluate((image) => image.complete && image.naturalWidth === 300),
  ).toBe(true);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Options', exact: true }).click();
  await page.getByRole('slider', { name: 'Music volume' }).fill('0');
  await page.getByLabel('Reduced motion', { exact: true }).check();
  await page.reload();
  expect(await page.evaluate(() => window.__mirror.store.data.settings.music)).toBe(0);
  await page.getByRole('button', { name: 'Credits', exact: true }).click();
  await expect(page.locator('#panel-content')).toContainText('not affiliated with or endorsed');
  for (const link of await page.locator('#panel a[target="_blank"]').all())
    await expect(link).toHaveAttribute('rel', 'noopener');
  expect(errors).toEqual([]);
});

test('keyboard movement, jump, signal, pause, checkpoints and resume', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await launch(page);
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 390);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await expect(page.getByRole('heading', { name: 'Ten Worlds. One Channel.' })).toBeVisible();
  await page.locator('[data-level="0"]').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 0 && window.__mirror.scene.player.sprite.y >= 615,
  );
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 320);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 550);
  await page.keyboard.up('d');
  await page.keyboard.up('Space');
  await page.keyboard.down('f');
  await page.waitForFunction(() => window.__mirror.scene.relays[0].active);
  await page.keyboard.up('f');
  expect(await page.evaluate(() => window.__mirror.store.data.crystals.length)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'A Moment Between Stars' })).toBeVisible();
  const before = await page.evaluate(() => window.__mirror.scene.player.sprite.x);
  await page.keyboard.press('d');
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.x)).toBe(before);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.evaluate(() => {
    const scene = window.__mirror.scene;
    scene.player.sprite.body.reset(scene.level.checkpoint, 610);
  });
  await page.waitForFunction(() => window.__mirror.scene.checkpointX === 1720);
  await page.evaluate(() => window.__mirror.scene.player.recall(true));
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.x)).toBe(1720);
  await page.reload();
  await page.getByRole('button', { name: 'RESUME YOUR JOURNEY', exact: true }).click();
  await page.waitForFunction(() => window.__mirror.scene?.player?.sprite.x >= 1720);
  expect(await page.evaluate(() => window.__mirror.scene.relays[0].active)).toBe(true);
  expect(errors).toEqual([]);
});

test('every world, every keeper, finale, evolving hub and bounded objects', async ({ page }) => {
  test.setTimeout(150000);
  const errors = [];
  const broken = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) broken.push(response.url());
  });
  await launch(page);
  const counts = [];
  for (let level = 0; level < 10; level += 1) {
    await page.evaluate((id) => {
      const app = window.__mirror;
      app.store.data.unlocked = id;
      app.store.data.checkpoint = null;
      app.startLevel(id);
    }, level);
    await page.waitForFunction(
      (id) => window.__mirror.scene?.level.id === id && window.__mirror.scene?.player,
      level,
    );
    const layout = await page.evaluate(() => {
      const scene = window.__mirror.scene;
      return {
        floor: scene.ground.getLength(),
        patrols: scene.patrols.length,
        relays: scene.relays.length,
        textures: scene.textures.getTextureKeys().length,
      };
    });
    expect(layout.floor).toBeGreaterThan(6);
    expect(layout.patrols).toBeGreaterThan(0);
    counts.push(layout.textures);
    await page.waitForFunction(() => !window.__mirror.scene.cameras.main.fadeEffect.isRunning);
    const colors = await page.evaluate(
      () =>
        new Promise((resolve) => {
          window.__mirror.game.renderer.snapshot((image) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            const samples = new Set();
            for (let index = 0; index < pixels.length; index += 2048)
              samples.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`);
            resolve(samples.size);
          });
        }),
    );
    expect(colors).toBeGreaterThan(40);
    await page.screenshot({ path: `test-results/world-${String(level + 1).padStart(2, '0')}.png` });
    await page.evaluate(() => {
      const scene = window.__mirror.scene;
      for (const relay of scene.relays) {
        const tool = scene.signals.tools.find(
          (entry) => entry.id === ['pulse', 'prism', 'chorus'][relay.tool],
        );
        scene.tune(relay, tool);
      }
    });
    if ([2, 5, 7, 9].includes(level)) {
      await page.waitForFunction(() => window.__mirror.scene.keeper.started);
      const phases = await page.evaluate(() => window.__mirror.scene.keeper.sequence.length);
      for (let phase = 0; phase < phases; phase += 1) {
        await page.waitForFunction(
          () => window.__mirror.scene.time.now >= window.__mirror.scene.keeper.ready,
        );
        await page.evaluate(() => {
          const scene = window.__mirror.scene;
          const keeper = scene.keeper;
          const index = keeper.sequence[keeper.progress];
          const node = keeper.nodes[index];
          const tool = scene.signals.tools.find(
            (entry) => entry.id === ['pulse', 'prism', 'chorus'][index],
          );
          keeper.receive(node.x, node.y, tool);
        });
      }
      expect(await page.evaluate(() => window.__mirror.scene.keeper.done)).toBe(true);
    }
    await page.evaluate(() => {
      const scene = window.__mirror.scene;
      scene.player.sprite.body.reset(scene.level.width - 100, 620);
    });
    await page.keyboard.press('e');
    await expect(page.locator('#panel')).toBeVisible();
    await expect(page.locator('#panel-title')).toHaveText(
      level === 9 ? 'A Universe to Share' : 'Another Light in the Dark',
    );
    await page.getByRole('button', { name: 'Return to the Defiant', exact: true }).click();
    await page.waitForFunction(() => window.__mirror.scene?.isHub && window.__mirror.scene?.player);
    expect(await page.evaluate(() => window.__mirror.store.data.completed.length)).toBe(level + 1);
    if (level >= 2)
      expect(await page.evaluate(() => window.__mirror.scene.level.width)).toBeGreaterThan(2000);
  }
  expect(Math.max(...counts) - Math.min(...counts)).toBeLessThan(40);
  expect(
    await page.evaluate(() => window.__mirror.store.data.achievements.includes('finale')),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      window.__mirror.scene.stations.some((station) => station.label === 'The observation room'),
    ),
  ).toBe(true);
  await page.waitForFunction(() => !window.__mirror.scene.cameras.main.fadeEffect.isRunning);
  await page.screenshot({ path: 'test-results/hub-complete.png' });
  expect(errors).toEqual([]);
  expect(broken).toEqual([]);
});

test('phone title and touch controls stay usable in portrait and landscape', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173/?qa=1');
  await expect(page.locator('.autograph-link')).toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'BEGIN YOUR JOURNEY', exact: true }),
  ).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/title-mobile.png' });
  await page.getByRole('button', { name: 'BEGIN YOUR JOURNEY', exact: true }).click();
  await page.waitForFunction(() => window.__mirror.scene?.player);
  await expect(page.locator('#touch-controls [data-touch="jump"]')).toBeVisible();
  const right = page.locator('#touch-controls [data-touch="right"]');
  await right.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch' });
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 160);
  await right.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch' });
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('#touch-controls [data-touch="jump"]')).toBeInViewport();
  await page.waitForFunction(
    () =>
      window.__mirror.scene.scale.width === 844 &&
      !window.__mirror.scene.cameras.main.fadeEffect.isRunning,
  );
  const position = await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const camera = scene.cameras.main;
    return {
      left:
        (scene.player.sprite.x - camera.scrollX - camera.width / 2) * camera.zoom +
        camera.width / 2,
      foot:
        (scene.player.sprite.y - camera.scrollY - camera.height / 2) * camera.zoom +
        camera.height / 2,
    };
  });
  expect(position.left).toBeGreaterThan(5);
  expect(position.foot).toBeLessThan(380);
  await page.screenshot({ path: 'test-results/game-mobile-landscape.png' });
  await context.close();
});

test('first journey is completable with keyboard input alone', async ({ page }) => {
  await launch(page);
  await page.keyboard.press('m');
  await page.locator('[data-level="0"]').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 0 && window.__mirror.scene.player.sprite.y >= 615,
  );
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 320);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 550);
  await page.keyboard.up('d');
  await page.keyboard.up('Space');
  await page.keyboard.down('f');
  await page.waitForFunction(() => window.__mirror.scene.relays[0].active);
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1400);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1710);
  await page.keyboard.up('d');
  await page.keyboard.up('Space');
  await page.waitForFunction(
    () =>
      window.__mirror.scene.player.sprite.body.blocked.down ||
      window.__mirror.scene.player.sprite.body.touching.down,
  );
  await page.keyboard.down('d');
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1910);
  await page.keyboard.up('d');
  await page.keyboard.up('Space');
  await page.waitForFunction(() => window.__mirror.scene.relays[1].active);
  await page.keyboard.up('f');
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 3080);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await expect(page.locator('#panel-title')).toHaveText('Another Light in the Dark');
  await page.getByRole('button', { name: 'Return to the Defiant', exact: true }).click();
  await page.waitForFunction(() => window.__mirror.scene?.isHub && window.__mirror.scene.player);
  expect(await page.evaluate(() => window.__mirror.store.data.completed)).toEqual([0]);
  expect(await page.evaluate(() => window.__mirror.store.data.unlocked)).toBe(1);
});

test('standard controller moves, pauses, navigates and resumes', async ({ page }) => {
  await page.addInitScript(() => {
    window.testPad = {
      connected: true,
      mapping: 'standard',
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    };
    Object.defineProperty(navigator, 'getGamepads', { value: () => [window.testPad] });
  });
  await launch(page);
  await page.evaluate(() => {
    window.testPad.axes[0] = 1;
  });
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 220);
  await page.evaluate(() => {
    window.testPad.axes[0] = 0;
    window.testPad.buttons[9].pressed = true;
  });
  await expect(page.locator('#panel-title')).toHaveText('A Moment Between Stars');
  await page.evaluate(() => {
    window.testPad.buttons[9].pressed = false;
    window.testPad.buttons[13].pressed = true;
  });
  await page.waitForFunction(() => document.activeElement?.dataset.action === 'close');
  await page.evaluate(() => {
    window.testPad.buttons[13].pressed = false;
    window.testPad.buttons[0].pressed = true;
  });
  await expect(page.locator('#panel')).not.toBeVisible();
  expect(await page.evaluate(() => window.__mirror.scene.scene.isActive())).toBe(true);
});

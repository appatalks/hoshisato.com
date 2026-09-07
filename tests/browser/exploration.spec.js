import { test, expect } from '@playwright/test';

async function destination(page, level) {
  await page.goto('/?qa=1');
  await page.locator('[data-action="missions"]').click();
  await page.locator(`[data-level="${level}"]`).click();
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.exploration && window.__mirror.scene.player,
  );
}

test('a lower passage supports descent, a saved checkpoint, a gate, cache and return route', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await destination(page, 0);
  await page.evaluate(() => window.__mirror.scene.exploration.descend());
  await page.waitForFunction(
    () =>
      window.__mirror.scene.player.sprite.body.touching.down ||
      window.__mirror.scene.player.sprite.body.blocked.down,
  );
  for (let step = 0; step < 3; step += 1) {
    const before = await page.evaluate(() => window.__mirror.scene.player.sprite.y);
    await page.keyboard.down('s');
    await page.keyboard.press('Space');
    await page.keyboard.up('s');
    await page.waitForFunction((top) => window.__mirror.scene.player.sprite.y > top + 40, before);
    await page.waitForFunction(
      () =>
        window.__mirror.scene.player.sprite.body.touching.down ||
        window.__mirror.scene.player.sprite.body.blocked.down,
    );
  }
  await page.waitForFunction(
    () => window.__mirror.scene.checkpointY === window.__mirror.scene.exploration.route.bottom,
  );
  expect(await page.evaluate(() => window.__mirror.scene.cameras.main.scrollY)).toBeGreaterThan(
    450,
  );
  await page.reload();
  await page.getByRole('button', { name: 'RESUME YOUR JOURNEY', exact: true }).click();
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.checkpointY === 1310 && window.__mirror.scene.player,
  );
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.y)).toBeGreaterThan(1200);
  await page.keyboard.press('Escape');
  await page.locator('[data-action="survey"]').click();
  await expect(page.locator('.survey-map')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1780);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.exploration.open);
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 1980);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 2190);
  await page.keyboard.up('d');
  await page.keyboard.up('Space');
  await page.waitForFunction(
    () =>
      window.__mirror.scene.player.sprite.body.touching.down ||
      window.__mirror.scene.player.sprite.body.blocked.down,
  );
  await page.keyboard.press('e');
  await expect(page.locator('#panel-title')).toHaveText('The Unlisted Deck');
  expect(await page.evaluate(() => window.__mirror.store.data.routes)).toContain(0);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 2340);
  await page.keyboard.up('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.y > 1290);
  await page.keyboard.press('e');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.y < 700);
  expect(errors).toEqual([]);
});

test('a low tunnel blocks standing movement and permits crouched movement', async ({ page }) => {
  await destination(page, 1);
  const middle = await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const route = scene.exploration.route;
    const left = route.left + (route.right - route.left) * 0.54;
    scene.player.sprite.body.reset(left - 55, route.bottom);
    return left;
  });
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.blocked.right);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.x)).toBeLessThan(middle);
  await page.keyboard.down('s');
  await page.waitForFunction((left) => window.__mirror.scene.player.sprite.x > left + 170, middle);
  await page.keyboard.up('d');
  await page.keyboard.up('s');
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.y)).toBeLessThan(1500);
});

test('every world has a rendered lower chamber, restorable checkpoint and exit', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await destination(page, 0);
  for (let level = 0; level < 10; level += 1) {
    if (level > 0) await page.evaluate((id) => window.__mirror.launch(id, false, false), level);
    await page.waitForFunction(
      (id) => window.__mirror.scene?.level.id === id && window.__mirror.scene.exploration,
      level,
    );
    await page.evaluate(() => {
      const scene = window.__mirror.scene;
      const checkpoint = scene.exploration.route.checkpoint;
      scene.player.sprite.body.reset(checkpoint.x, checkpoint.y);
    });
    await page
      .waitForFunction(
        () =>
          window.__mirror.scene.checkpointY > 1200 &&
          !window.__mirror.scene.cameras.main.fadeEffect.isRunning,
        null,
        { timeout: 7000 },
      )
      .catch(async () => {
        throw new Error(
          JSON.stringify(
            await page.evaluate(() => {
              const scene = window.__mirror.scene;
              return {
                level: scene.level.id,
                position: [scene.player.sprite.x, scene.player.sprite.y],
                checkpoint: [scene.checkpointX, scene.checkpointY],
                route: scene.exploration.route.checkpoint,
                camera: [scene.cameras.main.scrollX, scene.cameras.main.scrollY],
                active: scene.scene.isActive(),
                time: scene.time.now,
                fade: scene.cameras.main.fadeEffect.isRunning,
              };
            }),
          ) + JSON.stringify(errors),
        );
      });
    await page.waitForFunction(() => window.__mirror.scene.cameras.main.scrollY > 450);
    await page.screenshot({ path: `test-results/lower-${level + 1}.png` });
    await page.evaluate(() => window.__mirror.scene.player.recall(true));
    expect(await page.evaluate(() => window.__mirror.scene.player.sprite.y)).toBeGreaterThan(1200);
    await page.evaluate(() => window.__mirror.scene.exploration.returnToSurface());
    expect(await page.evaluate(() => window.__mirror.scene.player.sprite.y)).toBe(620);
  }
  expect(errors).toEqual([]);
});

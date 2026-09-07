import { test, expect } from '@playwright/test';

test('phone travel and lower-chamber framing remain usable after rotation', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173/?qa=1');
  await page.locator('[data-action="missions"]').click();
  await page.locator('[data-level="2"]').click();
  await expect(page.locator('#skip-travel')).toBeInViewport();
  await expect(page.locator('#travel-destination')).toBeInViewport();
  await page.screenshot({ path: 'test-results/travel-mobile.png' });
  await page.locator('#skip-travel').click();
  await page.waitForFunction(() => window.__mirror.scene?.exploration);
  await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const checkpoint = scene.exploration.route.checkpoint;
    scene.player.sprite.body.reset(checkpoint.x, checkpoint.y);
  });
  await page.waitForFunction(
    () =>
      window.__mirror.scene.checkpointY > 1200 &&
      !window.__mirror.scene.cameras.main.fadeEffect.isRunning,
  );
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForFunction(() => window.__mirror.scene.scale.width === 844);
  await expect(page.locator('#touch-controls [data-touch="jump"]')).toBeInViewport();
  const foot = await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const camera = scene.cameras.main;
    return (
      (scene.player.sprite.y - camera.scrollY - camera.height / 2) * camera.zoom + camera.height / 2
    );
  });
  expect(foot).toBeGreaterThan(80);
  expect(foot).toBeLessThan(390);
  await page.screenshot({ path: 'test-results/lower-mobile-landscape.png' });
  await context.close();
});

test('all destinations are available, travel is skippable, and later missions have their equipment', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/?qa=1');
  await page.locator('[data-action="missions"]').click();
  await expect(page.locator('[data-level]:enabled')).toHaveCount(10);
  await expect(page.locator('.mission-status').first()).toHaveText('AVAILABLE / NOT COMPLETED');
  await page.locator('[data-level="9"]').click();
  await expect(page.locator('#travel-screen')).toBeVisible();
  await expect(page.locator('#travel-destination')).toHaveText('A Crown of Quiet Stars');
  await page.screenshot({ path: 'test-results/travel.png' });
  await page.locator('#skip-travel').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 9 && window.__mirror.scene.player,
  );
  expect(
    await page.evaluate(() => window.__mirror.scene.signals.tools.map((tool) => tool.id)),
  ).toEqual(['pulse', 'prism', 'chorus']);
  await page.keyboard.press('m');
  await expect(page.locator('[data-level="9"] .mission-status')).toHaveText('IN PROGRESS / RESUME');
  await page.evaluate(() => {
    window.__mirror.store.complete(2);
    window.__mirror.ui.missions();
  });
  await expect(page.locator('[data-level="2"] .mission-status')).toHaveText('COMPLETED / REVISIT');
  await expect(page.locator('[data-level]:enabled')).toHaveCount(10);
  expect(errors).toEqual([]);
});

test('reduced-motion travel arrives automatically and can also be skipped by keyboard', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?qa=1');
  await page.locator('[data-action="missions"]').click();
  await page.locator('[data-level="4"]').click();
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 4 && window.__mirror.scene.player,
  );
  expect(await page.evaluate(() => window.__mirror.travel.reduced)).toBe(true);
  await page.keyboard.press('m');
  await page.locator('[data-level="0"]').click();
  await expect(page.locator('#travel-screen')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 0 && window.__mirror.scene.player,
  );
});

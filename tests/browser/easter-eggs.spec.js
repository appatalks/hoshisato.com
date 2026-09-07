import { test, expect } from '@playwright/test';
import { KONAMI_CODE, EASTER_EGGS } from '../../src/data/easter-eggs.js';

async function enterCode(page) {
  for (const code of KONAMI_CODE) await page.keyboard.press(code);
}

async function expectEffect(page, location) {
  await expect(page.locator('#easter-egg')).toHaveAttribute('data-egg', location);
  await expect(page.locator('#easter-egg')).toBeVisible();
  await page.waitForFunction(() => {
    const canvas = document.querySelector('#easter-egg canvas');
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let visible = 0;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] > 0) visible += 1;
    return visible > 100;
  });
  expect(
    await page.evaluate(
      (id) => window.__mirror.store.data.achievements.includes(id),
      EASTER_EGGS[location].achievement,
    ),
  ).toBe(true);
}

test('achievements and Linda Instagram are discoverable on the title and pause menus', async ({
  page,
}) => {
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Achievements', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Achievements', exact: true })).toBeVisible();
  await expect(page.locator('[data-achievement="konami"]')).toContainText('LOCKED');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  const titleLink = page.locator('#title-screen').getByRole('link', { name: "Linda's Instagram" });
  await expect(titleLink).toHaveAttribute('href', 'https://www.instagram.com/reallindapark');
  await expect(titleLink).toHaveAttribute('target', '_blank');
  await expect(titleLink).toHaveAttribute('rel', 'noopener noreferrer');
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror?.scene?.isHub && window.__mirror.scene.player);
  await page.keyboard.press('Escape');
  await expect(
    page.locator('#panel').getByRole('link', { name: "Linda's Instagram" }),
  ).toHaveAttribute('target', '_blank');
  await page.locator('#panel').getByRole('button', { name: 'Achievements', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Achievements', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__mirror.scene.scene.isPaused())).toBe(true);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  expect(await page.evaluate(() => window.__mirror.scene.scene.isActive())).toBe(true);
});

test('the code produces six distinct visual surprises without granting mission progress or navigating away', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?qa=1');
  await enterCode(page);
  await expectEffect(page, 'title');
  await page.screenshot({ path: 'test-results/secret-title.png' });
  const origin = page.url();
  for (const location of ['hub', 'star', 'underground', 'away', 'shuttle']) {
    await page.evaluate(
      (place) =>
        window.__mirror.launch(
          0,
          place === 'hub',
          false,
          ['away', 'shuttle'].includes(place) ? place : 'star',
        ),
      location,
    );
    await page.waitForFunction((place) => {
      const scene = window.__mirror.scene;
      return (
        scene?.player &&
        scene.scene.isActive() &&
        (place === 'hub'
          ? scene.isHub
          : scene.collection === (['away', 'shuttle'].includes(place) ? place : 'star'))
      );
    }, location);
    if (location === 'underground') {
      await page.evaluate(() => {
        const scene = window.__mirror.scene;
        const { x, y } = scene.exploration.route.checkpoint;
        scene.player.sprite.body.reset(x, y);
      });
      await page.waitForFunction(() => window.__mirror.scene.checkpointY > 1200);
    }
    await page.waitForFunction(() => !window.__mirror.scene.cameras.main.fadeEffect.isRunning);
    await page.keyboard.press('Escape');
    await expect(page.locator('#panel')).toBeVisible();
    const progress = await page.evaluate(() => {
      const { achievements, ...progress } = window.__mirror.store.data;
      return JSON.stringify(progress);
    });
    await enterCode(page);
    await expect(page.locator('.secret-menu-note')).toContainText(EASTER_EGGS[location].title);
    expect(await page.evaluate(() => window.__mirror.scene.scene.isPaused())).toBe(true);
    await expectEffect(page, location);
    expect(
      await page.evaluate(() => {
        const { achievements, ...progress } = window.__mirror.store.data;
        return JSON.stringify(progress);
      }),
    ).toBe(progress);
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.screenshot({ path: `test-results/secret-${location}.png` });
  }
  expect(page.url()).toBe(origin);
  expect(
    await page.evaluate(
      () => window.__mirror.store.data.achievements.filter((id) => id.startsWith('konami')).length,
    ),
  ).toBe(7);
  await page.reload();
  await page.getByRole('button', { name: 'Achievements', exact: true }).click();
  for (const egg of Object.values(EASTER_EGGS))
    await expect(page.locator(`[data-achievement="${egg.achievement}"]`)).toContainText('EARNED');
  expect(errors).toEqual([]);
});

test('repeat codes stay bounded, invalid input does not unlock, and transitions clear effects', async ({
  page,
}) => {
  await page.goto('/?qa=1');
  for (const code of [...KONAMI_CODE.slice(0, 5), 'KeyX', ...KONAMI_CODE.slice(5)])
    await page.keyboard.press(code);
  await expect(page.locator('#easter-egg')).toBeHidden();
  await enterCode(page);
  await expectEffect(page, 'title');
  await enterCode(page);
  await expectEffect(page, 'title');
  await expect(page.locator('#easter-egg')).toHaveCount(1);
  expect(
    await page.evaluate(
      () => window.__mirror.store.data.achievements.filter((id) => id === 'konami-title').length,
    ),
  ).toBe(1);
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror.scene?.player);
  await expect(page.locator('#easter-egg')).toBeHidden();
  await enterCode(page);
  await expectEffect(page, 'hub');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.velocity.x === 0);
  expect(await page.evaluate(() => window.__mirror.input.held.size)).toBe(0);
  await expect(page.locator('#easter-egg')).toBeHidden({ timeout: 10000 });
});

test('settings inputs do not trigger secrets, while paused menus can display earned achievements', async ({
  page,
}) => {
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Options', exact: true }).click();
  await page.getByRole('slider', { name: 'Music volume' }).focus();
  await enterCode(page);
  expect(await page.evaluate(() => window.__mirror.store.data.achievements)).not.toContain(
    'konami',
  );
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Achievements', exact: true }).click();
  await enterCode(page);
  await expect(page.locator('[data-achievement="konami-title"]')).toContainText('EARNED');
  await expect(page.locator('.secret-menu-note')).toHaveCount(1);
  await enterCode(page);
  await expect(page.locator('.secret-menu-note')).toHaveCount(1);
});

test('Instagram opens only after an explicit menu click in a separate tab', async ({
  page,
  context,
}) => {
  await context.route('https://www.instagram.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>Instagram test destination</title>',
    }),
  );
  await page.goto('/?qa=1');
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.linda-social').click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe('https://www.instagram.com/reallindapark');
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await expect(page.locator('#title-screen')).toBeVisible();
  await popup.close();
});

test('mobile menus fit and reduced-motion Easter eggs remain still', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173/?qa=1');
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 360, height: 640 },
    { width: 320, height: 640 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole('button', { name: 'Achievements', exact: true })).toBeInViewport();
    await expect(page.locator('.linda-social')).toBeInViewport();
    await expect(page.locator('.autograph-link')).toBeInViewport();
    const menu = await page.locator('.title-secondary').boundingBox();
    const social = await page.locator('.linda-social').boundingBox();
    const autograph = await page.locator('.autograph-link').boundingBox();
    const overlaps = (first, second) =>
      first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y;
    expect(overlaps(menu, social)).toBe(false);
    expect(overlaps(social, autograph)).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await enterCode(page);
  await expectEffect(page, 'title');
  const initial = await page.locator('#easter-egg canvas').evaluate((canvas) => canvas.toDataURL());
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let remaining = 12;
        const next = () => {
          remaining -= 1;
          if (remaining) requestAnimationFrame(next);
          else resolve();
        };
        requestAnimationFrame(next);
      }),
  );
  expect(await page.locator('#easter-egg canvas').evaluate((canvas) => canvas.toDataURL())).toBe(
    initial,
  );
  await page.screenshot({ path: 'test-results/secret-mobile.png' });
  await page.getByRole('button', { name: 'Achievements', exact: true }).click();
  await expect(page.locator('[data-achievement="konami-title"]')).toContainText('EARNED');
  await context.close();
});

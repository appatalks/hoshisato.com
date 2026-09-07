import { test, expect } from '@playwright/test';

test('distinct signals, peaceful drone response, hidden tool and workshop persist', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/?qa=1');
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror.scene?.player);
  await page.evaluate(() => {
    const app = window.__mirror;
    app.store.data.unlocked = 5;
    app.startLevel(5);
  });
  await page.waitForFunction(
    () => window.__mirror.scene?.level.id === 5 && window.__mirror.scene.player,
  );
  await page.evaluate(() => window.__mirror.scene.player.sprite.body.reset(770, 378));
  await page.keyboard.press('q');
  await page.waitForFunction(() => window.__mirror.scene.signals.index === 1);
  await page.keyboard.press('q');
  await page.waitForFunction(() => window.__mirror.scene.signals.index === 2);
  await page.keyboard.down('f');
  await page.waitForFunction(() => window.__mirror.scene.relays[0].active);
  await page.keyboard.up('f');
  await page.evaluate(() => window.__mirror.scene.player.sprite.body.reset(2020, 333));
  await page.keyboard.press('q');
  await page.waitForFunction(() => window.__mirror.scene.signals.index === 0);
  await page.keyboard.press('q');
  await page.waitForFunction(() => window.__mirror.scene.signals.index === 1);
  await page.keyboard.down('f');
  await page.waitForFunction(() => window.__mirror.scene.relays[1].active);
  await page.keyboard.up('f');
  await page.evaluate(() => {
    const scene = window.__mirror.scene;
    const patrol = scene.patrols[0];
    scene.player.sprite.body.reset(patrol.x - 85, patrol.y + 60);
    scene.player.facing = 1;
  });
  await page.keyboard.down('f');
  await page.waitForFunction(
    () => window.__mirror.scene.patrols[0].quietUntil > window.__mirror.scene.time.now,
  );
  await page.keyboard.up('f');
  for (let level = 0; level < 3; level += 1) {
    await page.evaluate((id) => {
      window.__mirror.store.data.checkpoint = null;
      window.__mirror.startLevel(id);
    }, level);
    await page.waitForFunction(
      (id) => window.__mirror.scene?.level.id === id && window.__mirror.scene?.secret,
      level,
    );
    await page.evaluate(() => {
      const scene = window.__mirror.scene;
      scene.player.sprite.body.reset(scene.secret.x, scene.secret.y + 50);
    });
    await page.waitForFunction(
      (count) => window.__mirror.store.data.secrets.length === count,
      level + 1,
    );
  }
  expect(await page.evaluate(() => window.__mirror.scene.signals.tools.at(-1).id)).toBe('echo');
  await page.evaluate(() => {
    const app = window.__mirror;
    app.store.data.crystals = Array.from(
      { length: 25 },
      (_, index) => `${Math.floor(index / 5)}:${index % 5}`,
    );
    app.ui.workshop();
  });
  await page.locator('[data-buy="resonance"]').click();
  await expect(page.locator('[data-buy="resonance"]')).toHaveText('Installed');
  await page.reload();
  expect(await page.evaluate(() => window.__mirror.store.data.upgrades)).toContain('resonance');
  expect(await page.evaluate(() => window.__mirror.store.data.secrets.length)).toBe(3);
  await page.getByRole('button', { name: 'Options', exact: true }).click();
  await page.getByRole('slider', { name: 'Music volume' }).fill('0');
  await page.locator('[data-action="reset"]').click();
  await expect(page.locator('#panel-title')).toHaveText('A Fresh Frequency');
  await page.locator('[data-action="confirm-reset"]').click();
  expect(await page.evaluate(() => window.__mirror.store.data.checkpoint)).toBeNull();
  expect(await page.evaluate(() => window.__mirror.store.data.secrets)).toEqual([]);
  expect(await page.evaluate(() => window.__mirror.store.data.settings.music)).toBe(0);
  expect(errors).toEqual([]);
});

test('denied browser storage keeps a playable, clearly marked session', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Options', exact: true }).click();
  await expect(page.locator('#panel-content')).toContainText('Storage is blocked');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror.scene?.player);
  expect(await page.evaluate(() => window.__mirror.store.persistent)).toBe(false);
  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 200);
  await page.keyboard.up('d');
  expect(errors).toEqual([]);
});

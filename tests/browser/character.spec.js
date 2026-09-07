import { test, expect } from '@playwright/test';

test('left-facing artwork follows movement, retains idle direction, and turns before a dash', async ({
  page,
}) => {
  await page.goto('/?qa=1');
  await page.locator('[data-action="play"]').click();
  await page.waitForFunction(() => window.__mirror?.scene?.player);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.flipX)).toBe(true);

  await page.keyboard.down('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.x > 230);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.flipX)).toBe(true);
  await page.keyboard.up('d');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.velocity.x === 0);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.flipX)).toBe(true);

  await page.keyboard.down('a');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.velocity.x < -200);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.flipX)).toBe(false);
  await page.keyboard.up('a');
  await page.waitForFunction(() => window.__mirror.scene.player.sprite.body.velocity.x === 0);
  expect(await page.evaluate(() => window.__mirror.scene.player.sprite.flipX)).toBe(false);

  const dash = await page.evaluate(() => {
    const scene = window.__mirror.scene;
    scene.app.store.data.unlocked = 1;
    scene.player.dashReady = -1;
    scene.player.update(scene.time.now, 16, { horizontal: 1, dashPressed: true });
    return {
      facing: scene.player.facing,
      velocity: scene.player.sprite.body.velocity.x,
      flip: scene.player.sprite.flipX,
    };
  });
  expect(dash).toEqual({ facing: 1, velocity: 700, flip: true });
});

import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';

const name = process.env.BROWSER || 'chrome';
const type = name === 'firefox' ? firefox : name === 'webkit' ? webkit : chromium;
const browser = await type.launch({ headless: true, ...(['chrome', 'msedge'].includes(name) ? { channel: name } : {}) });
const base = 'http://127.0.0.1:3100';
const cases = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile portrait', width: 390, height: 844 },
  { label: 'compact portrait', width: 360, height: 640 },
  { label: 'small portrait', width: 320, height: 568 },
  { label: 'landscape', width: 844, height: 390 },
  { label: 'reduced motion', width: 390, height: 844, reducedMotion: 'reduce' },
];

async function runCase(config) {
  const { label, width, height, reducedMotion } = config;
  const mobile = width < 700;
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: reducedMotion || 'no-preference', ...(mobile && name !== 'firefox' ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const check = async (description, fn) => { await fn(); console.log(`PASS ${name} / ${label}: ${description}`); };
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    await check('content renders without horizontal overflow', async () => {
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('#projects').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.equal(await page.locator('canvas').count(), 1);
    });
    await check('skip link moves keyboard focus to main', async () => {
      await page.getByRole('link', { name: 'Skip to content' }).press('Enter');
      await page.waitForFunction(() => document.activeElement?.id === 'main');
    });
    if (width < 768) await check('mobile navigation opens, Escape restores focus, and anchor focuses projects', async () => {
      const open = page.getByRole('button', { name: 'Open menu' });
      await open.click();
      const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
      await menu.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open menu');
      await open.click();
      await menu.getByRole('link', { name: 'Projects', exact: true }).click();
      await menu.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.id === 'projects');
    });
    const cardNames = await page.locator('.motion-gallery-card h3').allTextContents();
    assert.equal(cardNames.length, 3);
    assert.match(cardNames[0], /Tri-Apex/);
    assert.match(cardNames[1], /Merbolo/);
    assert.match(cardNames[2], /ApplyTrail/);
    const staticMode = reducedMotion === 'reduce' || height <= 520 || width <= 359;
    if (!staticMode) await check('scroll transitions select each card in the correct order and reverse', async () => {
      for (const index of [0, 1, 2, 1, 0]) {
        await page.evaluate(index => {
          const scene = document.querySelector('.motion-gallery-scene');
          const start = scene.getBoundingClientRect().top + scrollY;
          const range = scene.offsetHeight - scene.firstElementChild.clientHeight;
          window.scrollTo({ top: start + range * index / 2, behavior: 'instant' });
        }, index);
        await page.waitForFunction(index => {
          const cards = [...document.querySelectorAll('.motion-gallery-card')];
          return cards.every((card, i) => card.inert === (i !== index)) && getComputedStyle(cards[index]).visibility === 'visible';
        }, index);
        const card = page.locator('.motion-gallery-card').nth(index);
        assert.ok(await card.evaluate(element => element.scrollHeight <= element.clientHeight + 1), `Card ${index + 1} content is clipped at ${width}×${height}`);
      }
    });
    if (staticMode) await check('small viewport/reduced motion exposes every unclipped static project', async () => {
      await page.waitForFunction(() => [...document.querySelectorAll('.motion-gallery-card')].every(card => !card.inert && getComputedStyle(card).position === 'relative' && getComputedStyle(card).visibility === 'visible'));
      assert.ok(await page.locator('.motion-gallery-card').evaluateAll(cards => cards.every(card => card.scrollHeight <= card.clientHeight + 1)), 'Static card content is clipped');
    });
    await check('manual pause exposes all cards and resume restores correct mode', async () => {
      const toggle = page.getByRole('button', { name: 'Pause showcase motion' });
      await toggle.click();
      await page.waitForFunction(() => [...document.querySelectorAll('.motion-gallery-card')].every(card => !card.inert && getComputedStyle(card).position === 'relative'));
      await toggle.click();
      await page.waitForFunction(staticMode => [...document.querySelectorAll('.motion-gallery-card')].every(card => getComputedStyle(card).position === (staticMode ? 'relative' : 'absolute')), staticMode);
    });
    await check('CV downloads and contact form validates without sending email', async () => {
      const cv = await context.request.get(`${base}/cv/aung-kyaw-hein-cv.pdf`);
      assert.ok(cv.ok());
      assert.match(cv.headers()['content-type'], /pdf/);
      await page.getByRole('button', { name: 'Prepare Email' }).click();
      await page.waitForFunction(() => document.activeElement?.id === 'name');
      assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
      await page.getByLabel('Name', { exact: true }).fill('Browser test');
      await page.getByLabel('Email', { exact: true }).fill('test@example.com');
      await page.getByLabel('Message', { exact: true }).fill('A test draft only. No email will be sent.');
      await page.getByRole('button', { name: 'Prepare Email' }).click();
      const draft = page.getByRole('link', { name: 'Open it in your email app' });
      await draft.waitFor();
      assert.match(await draft.getAttribute('href'), /^mailto:/);
    });
    assert.deepEqual(errors, [], `Browser errors: ${errors.join('; ')}`);
  } finally { await context.close(); }
}

let failures = 0;
try {
  for (const config of cases) {
    try { await runCase(config); }
    catch (error) { failures++; console.error(`FAIL ${name} / ${config.label}:`, error); }
  }
} finally { await browser.close(); }
if (failures) process.exitCode = 1;
else console.log(`All ${cases.length} viewport/motion scenarios passed for ${name}.`);

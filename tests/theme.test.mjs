import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const root = css.match(/:root\s*\{([^}]+)\}/)[1];
const colors = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(m => [m[1], m[2]]));
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
test('Midnight & lime text, buttons and error states meet AA contrast', () => {
  for (const [foreground, background] of [
    ['ink','shell'], ['ink','surface'], ['ink-soft','shell'], ['ink-soft','surface'],
    ['ink-faint','surface'], ['lagoon','surface-soft'], ['on-accent','lagoon'],
    ['on-accent','accent-hover'], ['error','surface'], ['error','shell'],
  ]) {
    const a = luminance(colors[foreground]);
    const b = luminance(colors[background]);
    const contrast = (Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05);
    assert.ok(contrast >= 4.5, `${foreground} on ${background}: ${contrast.toFixed(2)}`);
  }
});

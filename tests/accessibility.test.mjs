import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('keyboard skip, disclosure and focus contracts remain explicit', () => {
  const page = read('../src/app/page.tsx');
  const nav = read('../src/components/Navbar/Navbar.tsx');
  assert.match(page, /href="#main"/);
  assert.match(page, /<main id="main" tabIndex=\{-1\}/);
  assert.match(nav, /aria-controls="mobile-menu"/);
  assert.match(nav, /hidden=\{!open\}/);
  assert.match(nav, /Escape.*menuButton\.current\?\.focus/);
});

test('motion showcase supports manual pause and an accessible static layout', () => {
  const gallery = read('../src/components/MotionGallery/MotionGallery.tsx');
  const css = read('../src/app/globals.css');
  assert.match(gallery, /aria-pressed=\{paused\}/);
  assert.match(gallery, /paused \|\| staticLayout\.matches/);
  assert.match(gallery, /card\.inert = false/);
  assert.match(css, /\.motion-paused \.motion-gallery-card[^\n]*visibility:visible/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/components/MotionGallery/motionMath.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
vm.runInNewContext(outputText, { exports });
const { smoothProgress, cardOpacity, stackedCardPose } = exports;

test('smoothing converges identically over the same elapsed time at 60, 90, 120 and 144Hz', () => {
  const results = [60, 90, 120, 144].map(hz => {
    let current = 0;
    for (let frame = 0; frame < hz / 2; frame++) current = smoothProgress(current, 1, 1000 / hz);
    return current;
  });
  assert.ok(results.every(value => Math.abs(value - results[0]) < 1e-9));
  assert.equal(results[0], 1);
  assert.ok(Math.abs(smoothProgress(0, 1, 100) - (1 - Math.exp(-100 / 65))) < 1e-9);
  assert.equal(smoothProgress(.8, .2, 1000), .2);
});

test('mobile cards slide over an opaque outgoing card without blank midpoints', () => {
  for (let i = 0; i < 100; i++) {
    const progress = i / 100;
    const outgoing = stackedCardPose(progress);
    const incoming = stackedCardPose(progress - 1);
    assert.equal(outgoing.visible, true);
    assert.equal(outgoing.translateY, 0);
    assert.ok(incoming.translateY >= 0 && incoming.translateY <= 100);
    if (i > 0) {
      assert.equal(incoming.visible, true);
      assert.ok(incoming.translateY < 100);
    }
  }
  assert.equal(stackedCardPose(.5).translateY, 0);
  assert.equal(stackedCardPose(-.5).translateY, 50);
  assert.equal(stackedCardPose(1).visible, false);
  assert.equal(stackedCardPose(0).visible, true);
});

test('touch smoothing converges faster without depending on refresh frequency', () => {
  assert.ok(smoothProgress(0, 1, 100, 45) > smoothProgress(0, 1, 100));
  const samples = [60, 90, 120, 144].map(hz => {
    let value = 0;
    for (let frame = 0; frame < hz / 2; frame++) value = smoothProgress(value, 1, 1000 / hz, 45);
    return value;
  });
  assert.ok(samples.every(value => value === 1));
});

test('adjacent card surfaces crossfade while text does not overlap', () => {
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    const outgoing = cardOpacity(p), incoming = cardOpacity(p - 1);
    assert.ok(Math.abs(outgoing.surface + incoming.surface - 1) < 1e-9);
    assert.ok(outgoing.content === 0 || incoming.content === 0);
  }
  assert.equal(cardOpacity(0).content, 1);
  assert.equal(cardOpacity(1).surface, 0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/components/MotionGallery/motionMath.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
vm.runInNewContext(outputText, { exports });
const { smoothProgress, stackedCardPose, frameStats } = exports;

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

test('desktop and mobile cards slide over an opaque outgoing card without blank midpoints', () => {
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
  assert.equal(stackedCardPose(-.5).tilt, 3.5);
  assert.equal(stackedCardPose(.5).tilt, 0);
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

test('frame metrics distinguish normal intervals from missed refresh slots', () => {
  const result = frameStats([10, 10, 20, 30, 10], 10);
  assert.equal(result.frames, 5);
  assert.equal(result.missed, 3);
  assert.equal(result.fps, 62.5);
  assert.equal(result.p95, 30);
  assert.equal(result.max, 30);
});

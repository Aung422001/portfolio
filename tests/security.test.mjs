import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(relative, env = {}) {
  const source = fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, process: { env }, __dirname: '.' });
  return exports;
}

test('contact delivery requires explicit activation, rate limit readiness and credentials', () => {
  const { contactDeliveryEnabled } = load('../src/lib/contact-config.ts');
  const config = { CONTACT_SEND_ENABLED: 'true', CONTACT_RATE_LIMIT_READY: 'true', RESEND_API_KEY: 'unit-test-only', CONTACT_FROM: 'sender@example.com' };
  assert.equal(contactDeliveryEnabled(config), true);
  for (const key of Object.keys(config)) assert.equal(contactDeliveryEnabled({ ...config, [key]: '' }), false);
});

test('production config applies baseline browser protections', async () => {
  const { default: config } = load('../next.config.ts', { NODE_ENV: 'production' });
  const [rule] = await config.headers();
  const headers = Object.fromEntries(rule.headers.map(h => [h.key, h.value]));
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.doesNotMatch(headers['Content-Security-Policy'], /unsafe-eval/);
  assert.ok(headers['Referrer-Policy'] && headers['Permissions-Policy']);
});

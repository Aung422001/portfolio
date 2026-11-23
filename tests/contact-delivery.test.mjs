import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const enabled = { CONTACT_SEND_ENABLED: 'true', CONTACT_RATE_LIMIT_READY: 'true', RESEND_API_KEY: 'mock-only', CONTACT_FROM: 'Portfolio <sender@example.com>' };
const valid = { name: 'Example Visitor', email: 'visitor@example.com', message: 'A portfolio enquiry for the delivery test.', website: '' };
const owner = 'owner@example.com';

function load(relative, context = {}) {
  const source = fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, ...context });
  return exports;
}

function route(provider, env = enabled) {
  const contact = load('../src/lib/contact.ts');
  const config = load('../src/lib/contact-config.ts', { process: { env } });
  const modules = { 'next/server': { NextResponse: { json: Response.json } }, '@/lib/contact': contact, '@/data/profile': { profile: { email: owner } }, '@/lib/contact-config': config };
  return load('../src/app/api/contact/route.ts', { require: name => { assert.ok(modules[name]); return modules[name]; }, process: { env }, URL, TextDecoder, AbortSignal, fetch: provider }).POST;
}

function request(fields = valid) {
  return new Request('https://preview.example.com/api/contact', { method: 'POST', headers: { Origin: 'https://preview.example.com', 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
}

test('contact route remains disabled without configured delivery', async () => {
  const post = route(() => assert.fail('Provider must not be called'), { ...enabled, CONTACT_SEND_ENABLED: 'false' });
  const result = await post(request());
  assert.equal(result.status, 503);
  assert.equal((await result.json()).sent, false);
});

test('contact route submits only to the owner and confirms a provider receipt', async () => {
  let calls = 0;
  const post = route(async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.method, 'POST');
    const payload = JSON.parse(options.body);
    assert.deepEqual(payload.to, [owner]);
    assert.equal(payload.from, enabled.CONTACT_FROM);
    assert.equal(payload.reply_to, valid.email);
    assert.match(payload.text, /A portfolio enquiry/);
    return Response.json({ id: 'mock-receipt' });
  });
  const response = await post(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
  assert.equal(calls, 1);
});

test('contact route reports unconfirmed delivery on provider error or absent receipt', async () => {
  for (const provider of [() => Response.json({ message: 'provider rejected' }, { status: 422 }), () => Response.json({}), () => { throw new Error('mock network failure'); }]) {
    const result = await route(provider)(request());
    assert.equal(result.status, 502);
    assert.equal((await result.json()).sent, false);
  }
});

test('invalid fields are rejected before making an email provider call', async () => {
  const post = route(() => assert.fail('Provider must not be called'));
  const result = await post(request({ ...valid, email: '' }));
  assert.equal(result.status, 400);
  assert.equal((await result.json()).sent, false);
});

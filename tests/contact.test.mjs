import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/lib/contact.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
vm.runInNewContext(outputText, { exports });
const { validateContact, parseContact } = exports;

test('validates contact fields and keeps malformed submissions out of delivery', () => {
  const valid = { name: 'Example Visitor', email: 'visitor@example.com', message: 'Hello, I would like to discuss a project.', website: '' };
  assert.equal(Object.keys(validateContact(valid)).length, 0);
  assert.equal(parseContact(valid).email, valid.email);
  assert.equal(parseContact({ ...valid, website: 'spam' }), null);
  assert.equal(parseContact({ ...valid, email: 'not-email' }), null);
  assert.equal(parseContact({ ...valid, message: 'x'.repeat(3001) }), null);
  assert.equal(parseContact({ ...valid, name: [] }), null);
});

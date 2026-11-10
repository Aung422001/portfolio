import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const root = path.resolve(import.meta.dirname, '..');
function readData(name) {
  const source = fs.readFileSync(path.join(root, 'src/data', name + '.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports });
  return exports;
}
const { projects, featuredProject, otherProjects } = readData('projects');
const { navItems, profile } = readData('profile');

test('every project has a unique identity, valid links and existing local images', () => {
  assert.equal(new Set(projects.map(p => p.slug)).size, projects.length);
  assert.equal(projects.filter(p => p.featured).length, 1);
  assert.equal(featuredProject.slug, 'applytrail');
  assert.equal(otherProjects.length, projects.length - 1);
  for (const project of projects) {
    assert.ok(project.title && project.description && project.stack.length);
    assert.ok(Object.keys(project.links).length);
    for (const href of Object.values(project.links)) assert.equal(new URL(href).protocol, 'https:');
    if (project.image) assert.ok(fs.existsSync(path.join(root, 'public', project.image)), project.image);
  }
});

test('ApplyTrail is discoverable without advertising its private repository', () => {
  const project = projects.find(p => p.slug === 'applytrail');
  assert.ok(project);
  assert.equal(project.links.live, 'https://applytrail-km2o.onrender.com');
  assert.equal(project.links.github, undefined);
  assert.match(project.description, /browser extension|companion extension/i);
  assert.match(project.demoNote, /Guest/);
});

test('navigation targets remain unique and a downloadable CV cannot be missing', () => {
  assert.equal(new Set(navItems.map(n => n.id)).size, navItems.length);
  for (const item of navItems) assert.equal(item.href, '#' + item.id);
  if (profile.cvAvailable) assert.ok(fs.existsSync(path.join(root, 'public', profile.cvPath)));
});

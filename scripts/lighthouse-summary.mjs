import { appendFileSync, readdirSync, readFileSync } from 'node:fs';

const reports = readdirSync('.lighthouseci')
  .filter(name => /^lhr-.*\.json$/.test(name))
  .map(name => JSON.parse(readFileSync(`.lighthouseci/${name}`, 'utf8')));
if (reports.length !== 3) throw new Error(`Expected 3 reports, got ${reports.length}`);

const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const lines = ['## Lighthouse results (median of 3 runs)', '', '| Metric | Median |', '| --- | ---: |'];
for (const key of ['performance', 'accessibility', 'best-practices', 'seo']) {
  lines.push(`| ${key} | ${Math.round(100 * median(reports.map(report => report.categories[key].score)))} |`);
}
for (const key of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index']) {
  const value = median(reports.map(report => report.audits[key].numericValue));
  lines.push(`| ${key} | ${key === 'cumulative-layout-shift' ? value.toFixed(3) : `${Math.round(value)} ms`} |`);
}
lines.push('', '### Audits needing review', '');
const representative = [...reports].sort((a, b) => a.categories.performance.score - b.categories.performance.score)[1];
for (const audit of Object.values(representative.audits)) {
  if (typeof audit.score === 'number' && audit.score < 0.9 && ['binary', 'numeric'].includes(audit.scoreDisplayMode)) {
    lines.push(`- ${audit.title}: ${audit.displayValue || audit.description}`);
  }
}
const summary = lines.join('\n') + '\n';
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);

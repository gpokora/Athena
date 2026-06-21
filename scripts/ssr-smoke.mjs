// Renders <Athena/> through the real template runtime via Vite SSR to catch
// render-time exceptions and confirm the markup resolves. Not a browser — effects
// (componentDidMount, pdf.js) don't run, but renderVals()/buildSubmittal()/dcx do.
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const k of ['window', 'document', 'DOMParser', 'HTMLElement', 'Node', 'getComputedStyle', 'Element']) {
  try { globalThis[k] = dom.window[k]; } catch {}
}
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { Athena } = await vite.ssrLoadModule('/src/athena.tsx');

  const props = { accentColor: '#3fb950', density: 'compact', showThumbnails: true };
  const html = renderToString(React.createElement(Athena, props));

  const checks = [
    ['ATHENA wordmark', /ATHENA/],
    ['library tab', /LIBRARY/],
    ['submittals tab', /SUBMITTALS/],
    ['a known datasheet', /NFS2-3030/],
    ['preview metadata', /METADATA/],
    ['sidebar categories', /CATEGORIES/],
  ];
  let ok = true;
  for (const [name, re] of checks) {
    const hit = re.test(html);
    if (!hit) ok = false;
    console.log((hit ? 'PASS ' : 'FAIL ') + name);
  }
  console.log('HTML length:', html.length);
  console.log(ok ? 'SMOKE_OK' : 'SMOKE_FAIL');
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error('RENDER_THREW:', e && e.stack ? e.stack : e);
  process.exitCode = 2;
} finally {
  await vite.close();
}

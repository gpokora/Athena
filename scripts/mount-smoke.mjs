// Mounts <Athena/> into jsdom via react-dom/client so componentDidMount and effects
// actually run (localStorage seeding, listeners, lib/collection init). Catches
// mount-time crashes the SSR pass can't.
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'DOMParser', 'HTMLElement', 'Node', 'Element', 'getComputedStyle', 'Event', 'CustomEvent', 'MouseEvent', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  try { globalThis[k] = w[k]; } catch {}
}
const store = {};
globalThis.localStorage = w.localStorage || {
  getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; },
};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const errors = [];
w.addEventListener('error', (e) => errors.push(String(e.error || e.message)));
const origErr = console.error;
console.error = (...a) => { errors.push(a.map(String).join(' ')); origErr(...a); };

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { Athena } = await vite.ssrLoadModule('/src/athena.tsx');
  const container = w.document.getElementById('root');
  const root = createRoot(container);
  root.render(React.createElement(Athena, { accentColor: '#3fb950', density: 'compact', showThumbnails: true }));
  await new Promise((r) => setTimeout(r, 200)); // flush effects

  const html = container.innerHTML;
  const mounted = html.length > 1000 && /ATHENA/.test(html) && /NFS2-3030/.test(html);
  // collections should have been seeded by componentDidMount → category <option>s exist
  const seeded = /Initiating Devices|Control & Annunciation/.test(html);

  console.log('mounted:', mounted, '| html length:', html.length);
  console.log('collections seeded at mount:', seeded);
  const realErrors = errors.filter((e) => !/not wrapped in act|Warning:/.test(e));
  if (realErrors.length) { console.log('ERRORS:'); realErrors.slice(0, 8).forEach((e) => console.log('  - ' + e.slice(0, 300))); }
  const ok = mounted && realErrors.length === 0;
  console.log(ok ? 'MOUNT_OK' : 'MOUNT_FAIL');
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error('MOUNT_THREW:', e && e.stack ? e.stack : e);
  process.exitCode = 2;
} finally {
  await vite.close();
}

// Drives real clicks through React's event system in jsdom to confirm the renderer's
// event wiring (onClick/onChange casing, handler resolution) works end-to-end.
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const w = dom.window;
for (const k of ['window', 'document', 'DOMParser', 'HTMLElement', 'Node', 'Element', 'getComputedStyle', 'Event', 'CustomEvent', 'MouseEvent', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  try { globalThis[k] = w[k]; } catch {}
}
globalThis.localStorage = w.localStorage;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const flush = () => new Promise((r) => setTimeout(r, 60));
const clickByText = (root, txt) => {
  const btn = [...root.querySelectorAll('button')].find((b) => (b.textContent || '').trim().includes(txt));
  if (!btn) throw new Error('button not found: ' + txt);
  btn.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
};

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const results = [];
try {
  const { Athena } = await vite.ssrLoadModule('/src/athena.tsx');
  const container = w.document.getElementById('root');
  createRoot(container).render(React.createElement(Athena, { accentColor: '#3fb950', density: 'compact', showThumbnails: true }));
  await flush();

  // 1) switch to Projects view
  clickByText(container, 'PROJECTS'); await flush();
  results.push(['Projects view opens', /in repository/.test(container.innerHTML)]);

  // 2) switch to Submittals view
  clickByText(container, 'SUBMITTALS'); await flush();
  results.push(['Submittals view opens', /saved versions/.test(container.innerHTML)]);

  // 3) back to Library, then open the submittal generator via New Submittal
  clickByText(container, 'LIBRARY'); await flush();
  results.push(['Library view returns', /METADATA/.test(container.innerHTML)]);

  // 4) open Add Document modal
  clickByText(container, '+ ADD'); await flush();
  results.push(['Add Document modal opens', /ADD DOCUMENT/.test(container.innerHTML)]);
  clickByText(container, 'Cancel'); await flush();

  // 5) open account dropdown
  const avatar = [...container.querySelectorAll('button[title="account"]')][0];
  avatar.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); await flush();
  results.push(['Account menu opens', /Account settings/.test(container.innerHTML)]);

  let ok = true;
  for (const [name, pass] of results) { if (!pass) ok = false; console.log((pass ? 'PASS ' : 'FAIL ') + name); }
  console.log(ok ? 'INTERACTION_OK' : 'INTERACTION_FAIL');
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error('INTERACTION_THREW:', e && e.stack ? e.stack : e);
  process.exitCode = 2;
} finally {
  await vite.close();
}

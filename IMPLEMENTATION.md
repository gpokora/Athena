# Athena — implementation notes

This is the real **React + Vite + TypeScript** implementation of the Athena design
that was handed off from Claude Design (see `README.md`, `chats/`, and the original
prototype under `project/Athena.dc.html`).

Athena is a dark, terminal-styled (JetBrains Mono) technical document library and
**fire-alarm submittal generator**. It is a fully client-side app — all projects,
submittals, settings, documents, tags, and account data persist in `localStorage`,
exactly as in the prototype.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run smoke      # SSR + jsdom mount + interaction smoke tests
```

## Architecture

The prototype was a Claude Design Component: an `<x-dc>` template (`{{ holes }}`,
`<sc-if>`, `<sc-for>`, `style-hover`) plus a `class Component extends DCLogic`
(state / `setState` / lifecycle / `renderVals()`), rendered by a React-based runtime.
Because `DCLogic` *is* the React component contract, the port stays extremely faithful:

| File | Role |
| --- | --- |
| `src/template.html` | The design markup, **verbatim** from the prototype (extracted byte-for-byte). Imported as a raw string. |
| `src/athena.tsx` | The prototype's logic class, ported almost unchanged to `React.Component`. `render()` feeds `renderVals()` to the template runtime. |
| `src/dcx.tsx` | A small, purpose-built runtime that renders the verbatim template against `renderVals()` — resolves `{{ holes }}`, `<sc-if>`/`<sc-for>`, `style`/`style-hover`, refs, and maps HTML-lowercased attributes back to React casing. |
| `src/pdf.tsx` | Real PDF rendering via **pdf.js** — accurate page counts for the Add Document flow and on-canvas rendering of attached datasheets in the viewer and submittal pages. |
| `src/main.tsx` | Entry point. Mounts `<Athena/>` with the design's default props. |
| `src/styles.css` | The prototype's `<helmet>` styles (scrollbars, animations, find-highlight). |

Keeping the template verbatim guarantees pixel-fidelity; the renderer reproduces only
the handful of template features the design uses.

## Real PDF rendering

Per the handoff decision, datasheet rendering is wired to **pdf.js** (`pdfjs-dist`):

- **Add Document** reads the *real* page count from an attached PDF (with a regex
  fallback) and keeps the file so it can be rendered later.
- The **full-screen viewer** and **submittal datasheet pages** render the attached
  PDF onto a canvas when a document has one; otherwise they show the design's
  placeholder. Built-in sample documents ship without files, so they show placeholders.

As noted in the chats, the final *binary* merge of datasheet PDFs into one downloadable
file is a server-side step; the in-app Export/Download dialogs model that flow.

## Verification

There is no browser in this environment, so the app is validated headlessly:

- `scripts/ssr-smoke.mjs` — renders `<Athena/>` through the real template runtime (no
  render-time exceptions; expected content present).
- `scripts/mount-smoke.mjs` — mounts in jsdom so `componentDidMount` runs (localStorage
  seeding, collection/lib init) with no errors.
- `scripts/interaction-smoke.mjs` — drives real clicks through React's event system
  (view switching, Add Document modal, account menu).

Browser-only behaviors (drag-and-drop reorder animation, the CSS Custom Highlight find,
pdf.js canvas, wheel-zoom) use the prototype's exact logic and are best checked in a
real browser via `npm run dev`.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Athena — Vite + React build. The verbatim design template is imported as a raw
// string (src/template.html) and rendered by the lightweight runtime in src/dcx.tsx.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { target: 'es2020', chunkSizeWarningLimit: 2000 },
});

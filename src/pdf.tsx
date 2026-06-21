// Real PDF rendering via pdf.js — accurate page counts for the Add Document flow
// and on-canvas rendering of attached datasheets in the viewer and submittal pages.
// pdf.js is loaded lazily so importing the app stays side-effect-free.
import * as React from 'react';

let _pdfjs: Promise<any> | null = null;
function pdfjs(): Promise<any> {
  if (!_pdfjs) {
    _pdfjs = (async () => {
      const lib: any = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      lib.GlobalWorkerOptions.workerSrc = workerUrl;
      return lib;
    })();
  }
  return _pdfjs;
}

const docCache = new Map<string, Promise<any>>();

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',');
  const bin = atob(dataUrl.slice(comma + 1));
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function loadDoc(src: string): Promise<any> {
  let p = docCache.get(src);
  if (!p) {
    p = (async () => {
      const lib = await pdfjs();
      const data = src.startsWith('data:') ? dataUrlToUint8(src) : src;
      return lib.getDocument({ data }).promise;
    })();
    docCache.set(src, p);
  }
  return p;
}

// Count pages of a freshly attached PDF (ArrayBuffer).
export async function pdfPageCount(buffer: ArrayBuffer): Promise<number> {
  try {
    const lib = await pdfjs();
    const doc = await lib.getDocument({ data: new Uint8Array(buffer.slice(0)) }).promise;
    return doc.numPages || 0;
  } catch {
    return 0;
  }
}

// Renders one page of an attached PDF onto a canvas, scaled to `width`.
export function PdfPage(props: { src: string; pageNumber: number; width: number; style?: React.CSSProperties }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    loadDoc(props.src)
      .then((doc) => doc.getPage(Math.min(props.pageNumber, doc.numPages)))
      .then((page: any) => {
        if (cancelled || !ref.current) return;
        const scale = props.width / page.getViewport({ scale: 1 }).width;
        const vp = page.getViewport({ scale });
        const canvas = ref.current;
        canvas.width = vp.width;
        canvas.height = vp.height;
        page.render({ canvasContext: canvas.getContext('2d'), viewport: vp });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [props.src, props.pageNumber, props.width]);
  return <canvas ref={ref} style={{ display: 'block', width: '100%', height: 'auto', ...props.style }} />;
}

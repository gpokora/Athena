// Lightweight runtime that renders the Athena design template (kept verbatim in
// template.html) against the flat `renderVals()` object — a small reimplementation
// of the handful of `{{ hole }}`, <sc-if>, <sc-for>, style/style-hover and ref
// features the design uses, so the markup stays byte-for-byte faithful.
import * as React from 'react';

type Scope = Record<string, any>;

// ----- hole resolution -----
const HOLE_RE = /\{\{\s*([^}]+?)\s*\}\}/g;

function resolvePath(path: string, scope: Scope): any {
  const t = path.trim();
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null') return null;
  const parts = t.split('.');
  let cur: any = scope;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

// Whole-string hole, e.g. "{{ d.rowStyle }}" -> raw value (may be fn/element/etc.)
function wholeHole(s: string): string | null {
  const m = /^\{\{\s*([^}]+?)\s*\}\}$/.exec(s);
  return m ? m[1] : null;
}

// Substitute holes inside a string, coercing each to text.
function substStr(s: string, scope: Scope): string {
  return s.replace(HOLE_RE, (_, p) => {
    const v = resolvePath(p, scope);
    return v == null ? '' : String(v);
  });
}

// Split a text node into strings + element children (icons resolve to elements).
function renderText(s: string, scope: Scope, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  HOLE_RE.lastIndex = 0;
  let i = 0;
  while ((m = HOLE_RE.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const v = resolvePath(m[1], scope);
    if (v == null || v === false || v === true) {
      // nothing
    } else if (React.isValidElement(v)) {
      out.push(<React.Fragment key={keyBase + '_' + i}>{v}</React.Fragment>);
    } else {
      out.push(String(v));
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

// ----- style parsing -----
function camel(prop: string): string {
  const p = prop.trim();
  if (p.startsWith('--')) return p; // custom property
  if (p.startsWith('-')) {
    // -webkit-foo -> WebkitFoo
    const seg = p.slice(1).split('-');
    return seg.map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1))).join('');
  }
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseStyle(css: string): React.CSSProperties {
  const out: any = {};
  if (!css) return out;
  for (const decl of css.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop) continue;
    out[camel(prop)] = val;
  }
  return out;
}

// ----- attribute name mapping (HTML parser lowercases everything) -----
const EVENT_MAP: Record<string, string> = {
  onclick: 'onClick', ondoubleclick: 'onDoubleClick', onchange: 'onChange',
  oninput: 'onChange', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onkeypress: 'onKeyPress',
  onfocus: 'onFocus', onblur: 'onBlur', onmousedown: 'onMouseDown', onmouseup: 'onMouseUp',
  onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onmousemove: 'onMouseMove',
  ondragstart: 'onDragStart', ondragenter: 'onDragEnter', ondragover: 'onDragOver',
  ondrop: 'onDrop', ondragend: 'onDragEnd', onsubmit: 'onSubmit', onscroll: 'onScroll',
  onwheel: 'onWheel',
};
const PROP_MAP: Record<string, string> = {
  class: 'className', for: 'htmlFor', readonly: 'readOnly', spellcheck: 'spellCheck',
  tabindex: 'tabIndex', maxlength: 'maxLength', minlength: 'minLength',
  autocomplete: 'autoComplete', colspan: 'colSpan', rowspan: 'rowSpan',
  contenteditable: 'contentEditable', autofocus: 'autoFocus', crossorigin: 'crossOrigin',
};
const BOOL_ATTRS = new Set(['readonly', 'disabled', 'checked', 'selected', 'multiple', 'required', 'autofocus']);

let keyCounter = 0;

function buildElement(el: Element, scope: Scope): React.ReactNode {
  const tag = el.tagName.toLowerCase();

  // ---- control-flow tags ----
  if (tag === 'sc-if') {
    const cond = resolvePath(wholeHole(el.getAttribute('value') || '') || '', scope);
    if (!cond) return null;
    return <React.Fragment>{renderChildren(el, scope)}</React.Fragment>;
  }
  if (tag === 'sc-for') {
    const listHole = wholeHole(el.getAttribute('list') || '') || '';
    const as = el.getAttribute('as') || 'item';
    const list = resolvePath(listHole, scope);
    if (!Array.isArray(list)) return null;
    return (
      <>
        {list.map((item, i) => (
          <React.Fragment key={i}>{renderChildren(el, { ...scope, [as]: item, $index: i })}</React.Fragment>
        ))}
      </>
    );
  }

  // ---- regular element ----
  const props: any = {};
  let hoverStyle: React.CSSProperties | null = null;
  let key: any = undefined;

  for (const attr of Array.from(el.attributes)) {
    const name = attr.name; // lowercased by HTML parser
    const raw = attr.value;
    if (name.startsWith('hint-placeholder')) continue;

    if (name === 'style') {
      props.style = parseStyle(substStr(raw, scope));
      continue;
    }
    if (name === 'style-hover') {
      hoverStyle = parseStyle(substStr(raw, scope));
      continue;
    }
    if (name === 'ref') {
      const h = wholeHole(raw);
      props.ref = h ? resolvePath(h, scope) : undefined;
      continue;
    }
    if (name === 'key') {
      key = substStr(raw, scope);
      continue;
    }
    if (EVENT_MAP[name]) {
      const h = wholeHole(raw);
      const fn = h ? resolvePath(h, scope) : undefined;
      if (typeof fn === 'function') props[EVENT_MAP[name]] = fn;
      continue;
    }

    const reactName = PROP_MAP[name] || name;
    const whole = wholeHole(raw);

    if (BOOL_ATTRS.has(name)) {
      props[reactName] = whole ? !!resolvePath(whole, scope) : true;
      continue;
    }
    if (name === 'spellcheck') {
      const v = whole ? resolvePath(whole, scope) : raw;
      props[reactName] = !(v === false || v === 'false');
      continue;
    }

    let value: any;
    if (whole) value = resolvePath(whole, scope);
    else if (raw.indexOf('{{') !== -1) value = substStr(raw, scope);
    else value = raw;

    if (value === undefined) continue; // omit absent attrs (e.g. missing href)
    props[reactName] = value;
  }

  // Controlled inputs: ensure onChange exists when a value is bound.
  const isFormEl = tag === 'input' || tag === 'textarea' || tag === 'select';
  if (isFormEl && props.value !== undefined && !props.onChange) {
    props.onChange = () => {};
  }

  const VOID = tag === 'input' || tag === 'br' || tag === 'img' || tag === 'hr';
  const children = VOID ? undefined : renderChildren(el, scope);

  if (hoverStyle) {
    return (
      <Hoverable key={key} as={tag} baseStyle={props.style} hoverStyle={hoverStyle} elProps={props}>
        {children}
      </Hoverable>
    );
  }
  if (key !== undefined) props.key = key;
  return React.createElement(tag, props, children as any);
}

function renderChildren(el: Element, scope: Scope): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  el.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      // text
      const txt = node.nodeValue || '';
      if (txt.indexOf('{{') !== -1) {
        out.push(...renderText(txt, scope, 't' + keyCounter++));
      } else {
        out.push(txt);
      }
    } else if (node.nodeType === 1) {
      const child = buildElement(node as Element, scope);
      if (child != null) out.push(<React.Fragment key={keyCounter++}>{child}</React.Fragment>);
    }
    // comments (8) ignored
  });
  return out;
}

// Element wrapper that swaps in hover styles on mouse over.
function Hoverable(props: { as: string; baseStyle: any; hoverStyle: any; elProps: any; children: any }) {
  const [hov, setHov] = React.useState(false);
  const { as, baseStyle, hoverStyle, elProps, children } = props;
  const merged = hov ? { ...baseStyle, ...hoverStyle } : baseStyle;
  const onEnter = (e: any) => { elProps.onMouseEnter && elProps.onMouseEnter(e); setHov(true); };
  const onLeave = (e: any) => { elProps.onMouseLeave && elProps.onMouseLeave(e); setHov(false); };
  return React.createElement(
    as,
    { ...elProps, style: merged, onMouseEnter: onEnter, onMouseLeave: onLeave },
    children
  );
}

// ----- public API: parse once, render against scope -----
const cache = new Map<string, Element>();
function getRoot(html: string): Element | null {
  let root = cache.get(html);
  if (!root) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const first = Array.from(doc.body.children)[0];
    if (!first) return null;
    cache.set(html, first);
    root = first;
  }
  return root;
}

export function renderTemplate(html: string, vals: Scope): React.ReactElement | null {
  const root = getRoot(html);
  if (!root) return null;
  keyCounter = 0;
  return <>{buildElement(root, vals)}</>;
}

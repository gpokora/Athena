// @ts-nocheck
// Ported verbatim from the Athena design's <script data-dc-script> (class Component
// extends DCLogic). DCLogic === React component contract (state/setState/lifecycle/
// renderVals), so the logic carries over unchanged; render() feeds renderVals() to the
// template runtime, and a few methods are extended for real pdf.js rendering.
import * as React from 'react';
import { renderTemplate } from './dcx';
import TEMPLATE from './template.html?raw';
import { pdfPageCount, PdfPage } from './pdf';

export class Athena extends React.Component {
  state = {
    selectedId: 'NFS2-3030',
    query: '',
    collection: 'All',
    kinds: [],
    statuses: [],
    tags: [],
    favOnly: false,
    favorites: ['NFS2-3030', 'FCPS-24S8'],
    recent: ['NFS2-3030', '2WB-B', 'P2RL'],
    sort: 'recent',
    viewerOpen: false,
    viewerZoom: 1,
    vPage: 1,
    findOpen: false,
    findScope: 'sub',
    viewMode: 'scroll',
    findQuery: '',
    findCount: 0,
    findIdx: 0,
    menuOpen: false,
    subOpen: false,
    settingsOpen: false,
    settingsTab: 'repo',
    repo: { name: 'Athena Library', location: '/Volumes/Shared/Athena/Library', defaultColl: 'Initiating Devices', autoIndex: true, dedupe: true },
    account: { name: 'Kelsey Owens', email: 'k.owens@athena.io', role: 'Fire Protection Engineer', phone: '(312) 555-0147', color: '#3fb950', twoFactor: true, accountRole: 'Engineer' },
    accountTypes: [
      { id: 1, name: 'Administrator', access: 'Full access' },
      { id: 2, name: 'Engineer', access: 'Create & edit' },
      { id: 3, name: 'Reviewer', access: 'Review & comment' },
      { id: 4, name: 'Viewer', access: 'Read-only' },
    ],
    accountTypeDraft: '',
    accountTab: 'profile',
    browseOpen: false,
    browsePath: '/',
    connectOpen: false,
    connectKey: null,
    connectForm: {},
    connectError: '',
    shareOpen: false,
    shareMode: 'user',
    shareRecipient: '',
    sharePermission: 'view',
    shareMsg: '',
    shareError: '',
    shareSent: false,
    downloadOpen: false,
    downloadFormat: 'pdf',
    downloadCover: true,
    downloadStarted: false,
    downloadProtect: false,
    downloadPassword: '',
    downloadAllowPrint: true,
    downloadAllowCopy: false,
    pwOpen: false,
    pw: { current: '', next: '', confirm: '' },
    pwError: '',
    pwChanged: false,
    accountOpen: false,
    accountModalOpen: false,
    docSaved: false,
    mdDraft: null,
    docMeta: {},
    newTag: '',
    docTagInput: '',
    docTagFocus: false,
    userDocs: [],
    removedCodes: [],
    collections: [],
    collRenames: {},
    collDraft: '',
    editingColl: null,
    lib: { types: [], mfrs: [], tags: [] },
    libDraft: { types: '', mfrs: '', tags: '' },
    docFormOpen: false,
    docDraft: { code: '', title: '', manufacturer: '', collection: 'Initiating Devices', pages: 0, status: 'Approved', tags: '', pdfName: '', size: '' },
    mainView: 'library',
    subTab: 'project',
    versions: [],
    versionsOpen: false,
    currentVersionId: null,
    saveMenuOpen: false,
    subExpanded: {},
    projExpanded: {},
    dragCat: null,
    dragOverCat: null,
    colW: { sub: [220, 130, 64, 96, 92], proj: [190, 84, 180, 120, 120] },
    projects: [],
    projDraft: { id: null, name: '', number: '', address: '', city: '', state: '', zip: '', manager: '', designer: '', csv: '' },
    projFormOpen: false,
    subSort: { key: null, dir: 'asc' },
    projSort: { key: null, dir: 'asc' },
    subQuery: '',
    subFilterStatus: 'all',
    projQuery: '',
    savedFlash: false,
    previewZoom: 1,
    curPage: 1,
    logo: null,
    company: {
      name: 'Power Design Incorporated',
      addr1: '11600 Ninth Street North',
      addr2: 'St. Petersburg, FL 33716',
      phone: '727.210.0492',
      web: 'powerdesigninc.us',
    },
    sub: {
      project: 'St. Regis Residences',
      address: '1809 Brickell Ave',
      city: 'Miami', state: 'FL', zip: '33129',
      projectNumber: '24-118',
      projectManager: '',
      designer: '',
      title: 'FIRE ALARM PRODUCT SUBMITTAL',
      submittalNo: '26-0118',
      revision: '0',
      status: 'For Approval',
      date: '2025-11-21',
      font: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      fontSize: 10,
      coverFont: '',
      coverTitleSize: 27,
      indexFont: '',
      indexHeadingSize: 21,
      indexItemSize: 10,
      indexGroupFont: '',
      indexGroupSize: 11,
      coverBold: false, coverItalic: false, coverUnder: false, coverAlign: 'center',
      indexBold: false, indexItalic: false, indexUnder: false, indexAlign: 'left',
      docBold: false, docItalic: false, docUnder: false, docAlign: 'left',
      pageSize: 'Letter',
      orientation: 'Portrait',
      margin: 0.5,
      preparedName: 'Grzegorz Pokora, Senior FA Designer I',
      preparedEmail: 'gpokora@powerdesigninc.us',
      groupBy: 'category',
      includeIndex: true,
      includeBom: true,
      csv: "Manufacturer,Model,Description,Qty\nNotifier,NFS2-3030,Addressable Fire Alarm Control Panel,1\nNotifier,ANN-80,Remote LCD Annunciator,2\nSystem Sensor,2WB-B,Photoelectric Smoke Detector,140\nSystem Sensor,5601P,Fixed/ROR Heat Detector,24\nSystem Sensor,DNR,Duct Smoke Detector,12\nNotifier,NBG-12LX,Addressable Manual Pull Station,18\nSystem Sensor,P2RL,Horn/Strobe Red Ceiling,96\nSystem Sensor,SRL,Strobe Red Ceiling,40\nSystem Sensor,SPSCWL,Speaker/Strobe White Wall,60\nNotifier,FCPS-24S8,Booster Power Supply 8A,6\nPower-Sonic,PS-12180,12V 18Ah SLA Battery,14\nNotifier,FMM-1,Addressable Monitor Module,30\nNotifier,FRM-1,Addressable Relay Module,16\nNotifier,ISO-X,Fault Isolator Module,22\nWheelock,MT-24-R,Multitone Notification Appliance,8",
    },
  };

  componentDidMount() {
    this._onKey = (e) => {
      if ((e.key === 'f' || e.key === 'F') && (e.ctrlKey || e.metaKey) && (this.state.subOpen || this.state.viewerOpen)) {
        e.preventDefault();
        this.openFind(this.state.subOpen ? 'sub' : 'viewer');
        return;
      }
      if (e.key === 'Escape') {
        if (this.state.findOpen) this.closeFind();
        else if (this.state.subOpen) this.setState({ subOpen: false });
        else if (this.state.viewerOpen) this.setState({ viewerOpen: false });
      }
    };
    window.addEventListener('keydown', this._onKey);
    this.loadVersions();
    this.loadProjects();
    this.loadLib();
    try { const c = JSON.parse(localStorage.getItem('athena_company') || 'null'); if (c) this.setState({ company: c }); } catch (e) {}
    try { const r = JSON.parse(localStorage.getItem('athena_repo') || 'null'); if (r) this.setState(s => ({ repo: { ...s.repo, ...r } })); } catch (e) {}
    try { const ac = JSON.parse(localStorage.getItem('athena_account') || 'null'); if (ac) this.setState(s => ({ account: { ...s.account, ...ac } })); } catch (e) {}
    try { const at = JSON.parse(localStorage.getItem('athena_accounttypes') || 'null'); if (at && Array.isArray(at)) this.setState({ accountTypes: at }); } catch (e) {}
    try { const dm = JSON.parse(localStorage.getItem('athena_docmeta') || 'null'); if (dm) this.setState({ docMeta: dm }); } catch (e) {}
    try { const ud = JSON.parse(localStorage.getItem('athena_userdocs') || 'null'); if (ud) this.setState({ userDocs: ud }); } catch (e) {}
    try { const rc = JSON.parse(localStorage.getItem('athena_collrenames') || 'null') || {}; let cl = JSON.parse(localStorage.getItem('athena_collections') || 'null'); if (!cl) { const seen = {}; cl = []; this.data().forEach(d => { const c = rc[d.collection] || d.collection; if (!seen[c]) { seen[c] = 1; cl.push(c); } }); } this.setState({ collections: cl, collRenames: rc }); } catch (e) {}
  }
  componentWillUnmount() { window.removeEventListener('keydown', this._onKey); }
  componentDidUpdate(prevProps, prevState) {
    this.applyViewMode();
    if (prevState && prevState.logo !== this.state.logo) { try { if (this.state.logo) localStorage.setItem('athena_logo', this.state.logo); else localStorage.removeItem('athena_logo'); } catch (e) {} }
  }

  setViewMode = (m) => this.setState({ viewMode: m }, this.applyViewMode);
  applyViewMode = () => {
    const single = this.state.viewMode === 'single';
    const jc = single ? 'safe center' : 'flex-start';
    const sp = document.getElementById('subPreview');
    if (sp) {
      sp.style.justifyContent = jc;
      sp.querySelectorAll('.subpage').forEach((p, i) => { p.style.display = (single && (i + 1) !== this.state.curPage) ? 'none' : ''; });
      [...sp.children].forEach(c => { if (!c.classList || !c.classList.contains('subpage')) c.style.display = single ? 'none' : ''; });
    }
    const dv = document.getElementById('dsViewer');
    if (dv) {
      dv.style.justifyContent = jc;
      dv.querySelectorAll('.dspage').forEach((p, i) => { p.style.display = (single && (i + 1) !== this.state.vPage) ? 'none' : ''; });
    }
  };

  openViewer = (id) => this.setState(s => ({ selectedId: id, viewerOpen: true, vPage: 1, recent: [id, ...s.recent.filter(r => r !== id)].slice(0, 6) }));
  closeViewer = () => this.setState({ viewerOpen: false });
  stop = (e) => { if (e) e.stopPropagation(); };

  // ----- viewer page nav + zoom -----
  vScroller = () => document.getElementById('dsViewer');
  setViewerRef = (el) => {
    if (el === this.viewerEl) return;
    if (this.viewerEl) { this.viewerEl.removeEventListener('scroll', this.vScroll); this.viewerEl.removeEventListener('wheel', this.vWheel); }
    this.viewerEl = el || null;
    if (el) { el.addEventListener('scroll', this.vScroll); el.addEventListener('wheel', this.vWheel, { passive: false }); }
  };
  vScroll = () => {
    if (this.state.viewMode === 'single' || this._vRaf) return;
    this._vRaf = requestAnimationFrame(() => {
      this._vRaf = null;
      const el = this.vScroller(); if (!el) return;
      const pages = el.querySelectorAll('.dspage');
      const mid = el.getBoundingClientRect().top + el.clientHeight / 2;
      let cur = 1;
      pages.forEach((p, i) => { if (p.getBoundingClientRect().top <= mid) cur = i + 1; });
      if (cur !== this.state.vPage) this.setState({ vPage: cur });
    });
  };
  vGoto = (n) => {
    const el = this.vScroller(); if (!el) return;
    const pages = el.querySelectorAll('.dspage'); if (!pages.length) return;
    const idx = Math.max(1, Math.min(pages.length, n || 1)) - 1;
    if (this.state.viewMode === 'single') { this.setState({ vPage: idx + 1 }, () => { this.applyViewMode(); const e = this.vScroller(); if (e) e.scrollTop = 0; }); return; }
    const t = pages[idx];
    el.scrollTop = Math.max(0, t.offsetTop - 18);
    this.setState({ vPage: idx + 1 });
  };
  vPrev = () => this.vGoto(this.state.vPage - 1);
  vNext = () => this.vGoto(this.state.vPage + 1);
  vGotoInput = (e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) this.vGoto(n); };
  vWheel = (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const d = e.deltaY < 0 ? 0.1 : -0.1; this.setState(s => ({ viewerZoom: Math.min(2, Math.max(0.5, +(s.viewerZoom + d).toFixed(2))) })); return; }
    if (this.state.viewMode === 'single') this.wheelPage(e, this.vScroller(), 'vPage', this.vGoto);
  };
  wheelPage = (e, el, key, gotoFn) => {
    if (!el) return;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    const now = Date.now();
    if (now - (this._lastFlip || 0) < 380) { if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) e.preventDefault(); return; }
    if (e.deltaY > 0 && atBottom) { e.preventDefault(); this._lastFlip = now; gotoFn(this.state[key] + 1); }
    else if (e.deltaY < 0 && atTop) { e.preventDefault(); this._lastFlip = now; gotoFn(this.state[key] - 1); }
  };
  vZoomIn = () => this.setState(s => ({ viewerZoom: Math.min(2, +(s.viewerZoom + 0.1).toFixed(2)) }));
  vZoomOut = () => this.setState(s => ({ viewerZoom: Math.max(0.5, +(s.viewerZoom - 0.1).toFixed(2)) }));
  vZoomReset = () => this.setState({ viewerZoom: 1 });

  // ----- find / highlight (shared) -----
  findContainerId = () => this.state.findScope === 'viewer' ? 'dsViewer' : 'subPreview';
  clearHi = () => { if (window.CSS && CSS.highlights) { CSS.highlights.delete('sf-all'); CSS.highlights.delete('sf-cur'); } this._findRanges = []; };
  openFind = (scope) => this.setState({ findOpen: true, findScope: scope }, () => { const i = document.getElementById('findInput'); if (i) { i.focus(); i.select(); } if (this.state.findQuery) this.runFind(this.state.findQuery); });
  closeFind = () => { this.clearHi(); this.setState({ findOpen: false, findCount: 0, findIdx: 0 }); };
  runFind = (q) => {
    this.clearHi();
    const query = (q || '').trim();
    if (!query || !(window.CSS && CSS.highlights && window.Highlight)) { this.setState({ findCount: 0, findIdx: 0 }); return; }
    const el = document.getElementById(this.findContainerId());
    if (!el) { this.setState({ findCount: 0, findIdx: 0 }); return; }
    const lc = query.toLowerCase();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const ranges = []; let node;
    while ((node = walker.nextNode())) {
      const v = node.nodeValue; if (!v) continue;
      const t = v.toLowerCase(); let i = t.indexOf(lc);
      while (i !== -1) { const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + query.length); ranges.push(r); i = t.indexOf(lc, i + query.length); }
    }
    this._findRanges = ranges;
    if (ranges.length) CSS.highlights.set('sf-all', new Highlight(...ranges));
    this.setState({ findCount: ranges.length, findIdx: ranges.length ? 1 : 0 }, this.showFindCurrent);
  };
  onFindInput = (e) => { const q = e.target.value; this.setState({ findQuery: q }); this.runFind(q); };
  showFindCurrent = () => {
    if (!(window.CSS && CSS.highlights)) return;
    CSS.highlights.delete('sf-cur');
    const ranges = this._findRanges || []; const idx = this.state.findIdx;
    if (!ranges.length || idx < 1) return;
    const r = ranges[idx - 1];
    CSS.highlights.set('sf-cur', new Highlight(r));
    const cont = document.getElementById(this.findContainerId());
    if (!cont) return;
    if (this.state.viewMode === 'single') {
      const cls = this.state.findScope === 'viewer' ? '.dspage' : '.subpage';
      const start = r.startContainer.nodeType === 3 ? r.startContainer.parentElement : r.startContainer;
      const host = start && start.closest ? start.closest(cls) : null;
      if (host) {
        const pages = [...cont.querySelectorAll(cls)];
        const pi = pages.indexOf(host) + 1;
        const key = this.state.findScope === 'viewer' ? 'vPage' : 'curPage';
        if (pi > 0 && this.state[key] !== pi) { this.setState({ [key]: pi }, () => { this.applyViewMode(); this.centerOnRange(r); }); return; }
      }
    }
    this.centerOnRange(r);
  };
  centerOnRange = (r) => {
    const cont = document.getElementById(this.findContainerId()); if (!cont) return;
    const z = parseFloat(cont.style.zoom) || 1;
    const rb = r.getBoundingClientRect(); const cb = cont.getBoundingClientRect();
    const rel = cont.scrollTop + (rb.top - cb.top) / z;
    cont.scrollTop = Math.max(0, rel - cont.clientHeight / 2 + (rb.height / z) / 2);
  };
  findNext = () => { const c = this.state.findCount; if (!c) return; this.setState({ findIdx: (this.state.findIdx % c) + 1 }, this.showFindCurrent); };
  findPrev = () => { const c = this.state.findCount; if (!c) return; this.setState({ findIdx: ((this.state.findIdx - 2 + c) % c) + 1 }, this.showFindCurrent); };
  toggleMenu = (e) => { if (e) e.stopPropagation(); this.setState(s => ({ menuOpen: !s.menuOpen })); };
  fileUrl = (doc) => 'file:///Library/Documents/' + doc.code + '_' + doc.version + '.pdf';
  openDesktop = (doc) => {
    this.setState({ menuOpen: false });
    // Hands off to the OS default PDF handler (file:// for the synced local copy,
    // falling back to the server copy which the browser routes to the desktop app).
    try { window.open(this.fileUrl(doc), '_blank'); } catch (e) {}
  };

  // ----- submittal generator -----
  openSubmittal = () => this.setState({ subOpen: true, menuOpen: false, currentVersionId: null });
  closeSubmittal = () => this.setState({ subOpen: false });
  setSub = (key, val) => this.setState(s => ({ sub: { ...s.sub, [key]: val } }));
  setTab = (t) => this.setState({ subTab: t });
  _catOrder = () => { const sub = this.state.sub; const o = (sub.categoryOrder || []).filter(c => this.state.collections.includes(c)); return [...o, ...this.state.collections.filter(c => !o.includes(c))]; };
  moveCategory = (i, dir) => { const order = this._catOrder(); const j = i + dir; if (j < 0 || j >= order.length) return; const a = [...order]; const t = a[i]; a[i] = a[j]; a[j] = t; this.setSub('categoryOrder', a); };
  moveCategoryTo = (from, to) => { if (from == null || from === to) { this.setState({ dragCat: null, dragOverCat: null }); return; } const order = this._catOrder(); const a = [...order]; const [m] = a.splice(from, 1); a.splice(to, 0, m); this.setSub('categoryOrder', a); this.setState({ dragCat: null, dragOverCat: null }); };
  loadVersions = () => { try { const v = JSON.parse(localStorage.getItem('athena_submittals') || '[]'); this.setState({ versions: Array.isArray(v) ? v : [] }); } catch (e) { this.setState({ versions: [] }); } };
  persistVersions = (list) => { try { localStorage.setItem('athena_submittals', JSON.stringify(list)); } catch (e) { try { localStorage.setItem('athena_submittals', JSON.stringify(list.map(v => ({ ...v, logo: null })))); } catch (_) {} } };
  _verName = () => 'Rev ' + (this.state.sub.revision || '0') + ' · ' + (this.state.sub.status || '') + ' · ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  _flashSaved = () => { clearTimeout(this._flash); this.setState({ savedFlash: true }); this._flash = setTimeout(() => this.setState({ savedFlash: false }), 1600); };
  _createVersion = () => {
    const t = Date.now();
    const entry = { id: t, createdAt: t, modifiedAt: t, name: this._verName(), sub: this.state.sub, company: this.state.company, logo: this.state.logo };
    const list = [entry, ...this.state.versions].slice(0, 30);
    this.persistVersions(list);
    this.setState({ versions: list, currentVersionId: entry.id });
  };
  saveVersion = () => {
    const cur = this.state.currentVersionId;
    if (cur && this.state.versions.some(v => v.id === cur)) {
      const list = this.state.versions.map(v => v.id === cur ? { ...v, modifiedAt: Date.now(), name: this._verName(), sub: this.state.sub, company: this.state.company, logo: this.state.logo } : v);
      this.persistVersions(list); this.setState({ versions: list });
    } else { this._createVersion(); }
    this._flashSaved();
  };
  saveAsNew = () => { this._createVersion(); this.setState({ saveMenuOpen: false, versionsOpen: true }); this._flashSaved(); };
  toggleSaveMenu = () => this.setState(s => ({ saveMenuOpen: !s.saveMenuOpen }));
  applyVersion = (id) => { const v = this.state.versions.find(x => x.id === id); if (!v) return; this.setState({ sub: { ...this.state.sub, ...v.sub }, currentVersionId: id, versionsOpen: false }); };
  deleteVersion = (id) => { const list = this.state.versions.filter(x => x.id !== id); this.persistVersions(list); this.setState({ versions: list }); };
  toggleVersions = () => this.setState(s => ({ versionsOpen: !s.versionsOpen }));
  setMainView = (v) => this.setState({ mainView: v });
  loadProjects = () => { try { const p = JSON.parse(localStorage.getItem('athena_projects') || '[]'); this.setState({ projects: Array.isArray(p) ? p : [] }); } catch (e) { this.setState({ projects: [] }); } };
  persistProjects = (list) => { try { localStorage.setItem('athena_projects', JSON.stringify(list)); } catch (e) {} };
  setDraft = (key, val) => this.setState(s => ({ projDraft: { ...s.projDraft, [key]: val } }));
  saveProject = () => {
    const d = this.state.projDraft;
    if (!d.name.trim()) return;
    let list;
    if (d.id) { list = this.state.projects.map(p => p.id === d.id ? { ...d } : p); }
    else { list = [{ ...d, id: Date.now() }, ...this.state.projects]; }
    this.persistProjects(list);
    this.setState({ projects: list, projFormOpen: false, projDraft: { id: null, name: '', number: '', address: '', city: '', state: '', zip: '', manager: '', designer: '', csv: '' } });
  };
  openProjForm = () => this.setState({ projFormOpen: true, projDraft: { id: null, name: '', number: '', address: '', city: '', state: '', zip: '', manager: '', designer: '', csv: '' } });
  cancelProjForm = () => this.setState({ projFormOpen: false });
  editProject = (id) => { const p = this.state.projects.find(x => x.id === id); if (p) this.setState({ projDraft: { ...p }, projFormOpen: true }); };
  setSubSort = (key) => this.setState(s => ({ subSort: { key, dir: s.subSort.key === key && s.subSort.dir === 'asc' ? 'desc' : 'asc' } }));
  onSubQuery = (e) => this.setState({ subQuery: e.target.value });
  onSubFilterStatus = (e) => this.setState({ subFilterStatus: e.target.value });
  onProjQuery = (e) => this.setState({ projQuery: e.target.value });
  setProjSort = (key) => this.setState(s => ({ projSort: { key, dir: s.projSort.key === key && s.projSort.dir === 'asc' ? 'desc' : 'asc' } }));
  _sortInd = (which, key) => { const st = which === 'sub' ? this.state.subSort : this.state.projSort; if (st.key !== key) return ''; return this.ic(st.dir === 'asc' ? 'chevUp' : 'chevDown', 10); };
  _projSorted = () => { const { key, dir } = this.state.projSort; const q = (this.state.projQuery || '').trim().toLowerCase(); let a = [...this.state.projects]; if (q) a = a.filter(p => [p.name, p.number, p.address, p.city, p.manager, p.designer].some(v => String(v || '').toLowerCase().includes(q))); if (!key) return a; const val = (p) => ({ project: p.name, number: p.number, address: p.address, manager: p.manager, designer: p.designer }[key] || ''); a.sort((x, y) => { const r = String(val(x)).localeCompare(String(val(y)), undefined, { numeric: true, sensitivity: 'base' }); return dir === 'asc' ? r : -r; }); return a; };
  deleteProject = (id) => { const list = this.state.projects.filter(x => x.id !== id); this.persistProjects(list); this.setState({ projects: list }); };
  applyProject = (p) => this.setState(s => ({ sub: { ...s.sub, project: p.name, address: p.address, city: p.city, state: p.state, zip: p.zip, projectNumber: p.number, projectManager: p.manager, designer: p.designer } }));
  onImportCBOM = (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => this.setSub('csv', r.result); r.readAsText(f); e.target.value = ''; };
  downloadTemplate = () => {
    const csv = 'Manufacturer,Model,Description,Qty\nNotifier,NFS2-3030,Addressable Fire Alarm Control Panel,1\nNotifier,ANN-80,Remote LCD Annunciator,2\nSystem Sensor,2WB-B,Photoelectric Smoke Detector,140\nSystem Sensor,5601P,Fixed/ROR Heat Detector,24\nSystem Sensor,DNR,Duct Smoke Detector,12\nNotifier,NBG-12LX,Addressable Manual Pull Station,18\nSystem Sensor,P2RL,Horn/Strobe Red Ceiling,96\nSystem Sensor,SRL,Strobe Red Ceiling,40\nSystem Sensor,SPSCWL,Speaker/Strobe White Wall,60\nNotifier,FCPS-24S8,Booster Power Supply 8A,6\nPower-Sonic,PS-12180,12V 18Ah SLA Battery,14\nNotifier,FMM-1,Addressable Monitor Module,30\nNotifier,FRM-1,Addressable Relay Module,16\nNotifier,ISO-X,Fault Isolator Module,22\n';
    try { const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'athena-submittal-data-template.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (err) {}
  };
  newSubmittalFromProject = (id) => { const p = this.state.projects.find(x => x.id === id); if (p) this.applyProject(p); this.setState({ subOpen: true, currentVersionId: null }); };
  pickProject = (id) => { const p = this.state.projects.find(x => x.id === String(id) || x.id === Number(id)); if (p) this.applyProject(p); };
  toggleExpand = (p) => this.setState(s => ({ subExpanded: { ...s.subExpanded, [p]: !s.subExpanded[p] } }));
  toggleProjExpand = (id) => this.setState(s => ({ projExpanded: { ...s.projExpanded, [id]: !s.projExpanded[id] } }));
  startResize = (table, idx, e) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX; const startW = this.state.colW[table][idx];
    const move = (ev) => { const w = Math.max(46, startW + (ev.clientX - startX)); this.setState(s => { const arr = [...s.colW[table]]; arr[idx] = w; return { colW: { ...s.colW, [table]: arr } }; }); };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.style.cursor = ''; document.body.style.userSelect = ''; };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  };
  openVersionInEditor = (id) => { const v = this.state.versions.find(x => x.id === id); if (!v) return; this.setState({ sub: { ...this.state.sub, ...v.sub }, currentVersionId: id, subOpen: true, versionsOpen: false }); };
  _updateDocMeta = (code, patch) => this.setState(s => { const docMeta = { ...s.docMeta, [code]: { ...(s.docMeta[code] || {}), ...patch } }; try { localStorage.setItem('athena_docmeta', JSON.stringify(docMeta)); } catch (e) {} return { docMeta }; });
  setDocStatus = (code, status) => this._updateDocMeta(code, { status });
  setDocCollection = (code, collection) => this._updateDocMeta(code, { collection });
  _effectiveDoc = (code) => { const d = this.allDocs().find(x => x.code === code) || {}; const o = this.state.docMeta[code]; return o ? { ...d, ...o } : d; };
  _mdBase = (code) => { const d = this._effectiveDoc(code); return { status: d.status, collection: d.collection, kind: d.kind, author: d.author, version: d.version, partNumber: d.model || d.code }; };
  _md = (code, key) => { const base = this._mdBase(code); const dr = this.state.mdDraft; const eff = (dr && dr.code === code) ? { ...base, ...dr } : base; return eff[key]; };
  _mdDirty = (code) => { const base = this._mdBase(code); const dr = this.state.mdDraft; if (!dr || dr.code !== code) return false; const eff = { ...base, ...dr }; return ['status','collection','kind','author','version','partNumber'].some(k => eff[k] !== base[k]); };
  setMd = (key) => (e) => { const v = e.target.value; this.setState(s => { const code = s.selectedId; const cur = (s.mdDraft && s.mdDraft.code === code) ? s.mdDraft : { code }; return { mdDraft: { ...cur, code, [key]: v } }; }); };
  loadLib = () => { try { const l = JSON.parse(localStorage.getItem('athena_lib') || 'null'); if (l) { this.setState({ lib: { types: l.types || [], mfrs: l.mfrs || [], tags: l.tags || [] } }); } else { const d = this.data(); this.setState({ lib: { types: [...new Set(d.map(x => x.kind))], mfrs: [...new Set(d.map(x => x.manufacturer))], tags: [...new Set(d.flatMap(x => x.tags || []))] } }); } } catch (e) {} };
  persistLib = (lib) => { try { localStorage.setItem('athena_lib', JSON.stringify(lib)); } catch (e) {} };
  setLibDraft = (k, e) => this.setState(s => ({ libDraft: { ...s.libDraft, [k]: e.target.value } }));
  addLibItem = (k) => { const v = (this.state.libDraft[k] || '').trim(); if (!v || this.state.lib[k].includes(v)) return; const lib = { ...this.state.lib, [k]: [...this.state.lib[k], v] }; this.persistLib(lib); this.setState(s => ({ lib, libDraft: { ...s.libDraft, [k]: '' } })); };
  removeLibItem = (k, v) => { const lib = { ...this.state.lib, [k]: this.state.lib[k].filter(x => x !== v) }; this.persistLib(lib); this.setState({ lib }); };
  allDocs = () => { const removed = this.state.removedCodes || []; const rc = (d) => ({ ...d, collection: this.resolveColl(d.collection) }); const base = this.data().filter(d => !removed.includes(d.code)).map(rc); return [...(this.state.userDocs || []).map(rc), ...base]; };
  resolveColl = (c) => { const m = this.state.collRenames || {}; let s = 0; while (m[c] && s < 10) { c = m[c]; s++; } return c; };
  persistColl = (collections, collRenames) => { try { localStorage.setItem('athena_collections', JSON.stringify(collections)); localStorage.setItem('athena_collrenames', JSON.stringify(collRenames)); } catch (e) {} };
  onCollDraft = (e) => this.setState({ collDraft: e.target.value });
  addCollection = () => { const n = (this.state.collDraft || '').trim(); if (!n || this.state.collections.includes(n)) return; const collections = [...this.state.collections, n]; this.persistColl(collections, this.state.collRenames); this.setState({ collections, collDraft: '' }); };
  deleteCollection = (name) => { const collections = this.state.collections.filter(c => c !== name); this.persistColl(collections, this.state.collRenames); this.setState(s => ({ collections, collection: s.collection === name ? 'All' : s.collection })); };
  startEditColl = (name) => this.setState({ editingColl: { original: name, value: name } });
  setEditCollVal = (e) => this.setState(s => ({ editingColl: { ...s.editingColl, value: e.target.value } }));
  cancelEditColl = () => this.setState({ editingColl: null });
  saveEditColl = () => {
    const ed = this.state.editingColl; if (!ed) { return; }
    const o = ed.original, n = (ed.value || '').trim();
    if (!n || n === o) { this.setState({ editingColl: null }); return; }
    const collections = this.state.collections.map(c => c === o ? n : c);
    const collRenames = { ...this.state.collRenames, [o]: n };
    const userDocs = this.state.userDocs.map(d => d.collection === o ? { ...d, collection: n } : d);
    this.persistColl(collections, collRenames);
    try { localStorage.setItem('athena_userdocs', JSON.stringify(userDocs)); } catch (e) {}
    this.setState({ collections, collRenames, userDocs, editingColl: null });
  };
  openDocForm = () => this.setState({ docFormOpen: true, docTagInput: '', docDraft: { code: '', title: '', manufacturer: '', collection: this.state.repo.defaultColl || 'Initiating Devices', pages: 0, status: 'Approved', tags: '', pdfName: '', size: '' } });
  closeDocForm = () => this.setState({ docFormOpen: false });
  setDocDraft = (k, v) => this.setState(s => ({ docDraft: { ...s.docDraft, [k]: v } }));
  _fmtBytes = (b) => { if (!b && b !== 0) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(0) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; };
  onDocPDF = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    this.setState(s => ({ docDraft: { ...s.docDraft, pdfName: f.name, size: this._fmtBytes(f.size) } }));
    const r = new FileReader();
    r.onload = async () => {
      const buf = r.result;
      // Real page count via pdf.js, with a lightweight regex fallback.
      let n = 0;
      try { n = await pdfPageCount(buf); } catch (err) {}
      if (!n) {
        try {
          const t = new TextDecoder('latin1').decode(new Uint8Array(buf));
          n = (t.match(/\/Type\s*\/Page[^s]/g) || []).length;
          if (!n) { const m = [...t.matchAll(/\/Count\s+(\d+)/g)]; if (m.length) n = Math.max.apply(null, m.map(x => +x[1])); }
        } catch (e2) {}
      }
      // Keep the file so it can actually be rendered later in the viewer/submittal.
      const dr = new FileReader();
      dr.onload = () => this.setState(s => ({ docDraft: { ...s.docDraft, pages: n || s.docDraft.pages, pdfName: f.name, pdfDataUrl: dr.result } }));
      dr.readAsDataURL(f);
    };
    r.readAsArrayBuffer(f); e.target.value = '';
  };
  addDoc = () => {
    const d = this.state.docDraft; const code = (d.code || '').trim(); if (!code) return;
    const doc = { id: code, code: code, model: code, partNo: code, title: (d.title || code).trim(), manufacturer: (d.manufacturer || '').trim(), author: (d.manufacturer || '').trim(), collection: d.collection, kind: 'Datasheet', status: d.status, specSection: '28 31 00', date: new Date().toISOString().slice(0, 10), version: 'v1.0', size: d.size || '—', pages: parseInt(d.pages, 10) || 1, tags: (d.tags || '').split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean), abstract: '', pdfDataUrl: d.pdfDataUrl || null };
    const userDocs = [doc, ...this.state.userDocs.filter(x => x.code !== code)];
    try { localStorage.setItem('athena_userdocs', JSON.stringify(userDocs)); } catch (e) {}
    this.setState({ userDocs, docFormOpen: false, selectedId: code });
  };
  deleteDoc = (code) => {
    const isUser = this.state.userDocs.some(x => x.code === code);
    let userDocs = this.state.userDocs, removedCodes = this.state.removedCodes;
    if (isUser) userDocs = userDocs.filter(x => x.code !== code);
    else removedCodes = [...removedCodes, code];
    try { localStorage.setItem('athena_userdocs', JSON.stringify(userDocs)); localStorage.setItem('athena_removed', JSON.stringify(removedCodes)); } catch (e) {}
    const remaining = [...userDocs, ...this.data().filter(d => !removedCodes.includes(d.code))];
    this.setState({ userDocs, removedCodes, selectedId: remaining[0] ? remaining[0].code : null });
  };
  _docTags = (code) => { const b = this.state.docMeta[code]; const doc = this.data().find(d => d.code === code); return (b && b.tags) || (doc && doc.tags) || []; };
  addDocTag = (code, tag) => { tag = (tag || '').trim().replace(/^#/, ''); if (!tag) return; const cur = this._docTags(code); if (cur.includes(tag)) return; this._updateDocMeta(code, { tags: [...cur, tag] }); };
  removeDocTag = (code, tag) => this._updateDocMeta(code, { tags: this._docTags(code).filter(x => x !== tag) });
  onNewTagInput = (e) => this.setState({ newTag: e.target.value });
  onNewTagKey = (e) => { if (e.key === 'Enter') { this.addDocTag(this.state.selectedId, e.target.value); this.setState({ newTag: '' }); } };
  setCompany = (key, val) => this.setState(s => { const company = { ...s.company, [key]: val }; try { localStorage.setItem('athena_company', JSON.stringify(company)); } catch (e) {} return { company }; });
  openSettings = () => this.setState({ settingsOpen: true });
  closeSettings = () => this.setState({ settingsOpen: false });
  saveSettings = () => { this.setState({ settingsSaved: true }); clearTimeout(this._setFlash); this._setFlash = setTimeout(() => this.setState({ settingsSaved: false }), 1400); };
  setSettingsTab = (t) => this.setState({ settingsTab: t });
  setRepo = (patch) => this.setState(s => { const repo = { ...s.repo, ...patch }; try { localStorage.setItem('athena_repo', JSON.stringify(repo)); } catch (e) {} return { repo }; });
  onBrowseLocation = () => { if (this._browseInput) this._browseInput.click(); };
  setBrowseInput = (el) => { this._browseInput = el; };
  onBrowsePicked = (e) => { const f = e.target.files && e.target.files[0]; if (f) this.setRepo({ location: f.name }); e.target.value = ''; };
  _fs() { return { '/': ['Volumes', 'Users'], '/Volumes': ['Shared Drive', 'Macintosh HD', 'Backup'], '/Volumes/Shared Drive': ['Athena', 'Projects', 'Archive'], '/Volumes/Shared Drive/Athena': ['Library', 'Submittals', 'Templates'], '/Volumes/Macintosh HD': ['Applications', 'Library', 'System'], '/Volumes/Backup': ['Snapshots'], '/Users': ['kowens'], '/Users/kowens': ['Documents', 'Desktop', 'Downloads'], '/Users/kowens/Documents': ['Athena Library', 'Specs'] }; }
  browseInto = (name) => this.setState(s => ({ browsePath: (s.browsePath === '/' ? '' : s.browsePath) + '/' + name }));
  browseUp = () => this.setState(s => { const parts = s.browsePath.split('/').filter(Boolean); parts.pop(); return { browsePath: '/' + parts.join('/') }; });
  browseSelect = () => { this.setRepo({ location: this.state.browsePath }); this.setState({ browseOpen: false }); };
  closeBrowse = () => this.setState({ browseOpen: false });
  toggleConnection = (key) => this.setState(s => { const connections = { ...(s.repo.connections || {}), [key]: !((s.repo.connections || {})[key]) }; const repo = { ...s.repo, connections }; try { localStorage.setItem('athena_repo', JSON.stringify(repo)); } catch (e) {} return { repo }; });
  _providerMeta() { return {
    s3: { name: 'Amazon S3', fields: [{ k: 'accessKey', label: 'Access key ID' }, { k: 'secret', label: 'Secret access key', type: 'password' }, { k: 'bucket', label: 'Bucket name' }, { k: 'region', label: 'Region', placeholder: 'us-east-1' }] },
    gdrive: { name: 'Google Drive', fields: [{ k: 'email', label: 'Google account email', placeholder: 'name@company.com' }, { k: 'folder', label: 'Drive folder', placeholder: 'Athena Library' }] },
    dropbox: { name: 'Dropbox', fields: [{ k: 'email', label: 'Dropbox account email', placeholder: 'name@company.com' }, { k: 'folder', label: 'Folder path', placeholder: '/Athena' }] },
    smb: { name: 'Network share (SMB)', fields: [{ k: 'server', label: 'Server address', placeholder: '\\\\fileserver\\share' }, { k: 'share', label: 'Share name' }, { k: 'user', label: 'Username' }, { k: 'pass', label: 'Password', type: 'password' }] },
  }; }
  openConnect = (key) => this.setState({ connectOpen: true, connectKey: key, connectForm: {}, connectError: '' });
  closeConnect = () => this.setState({ connectOpen: false });
  setConnectField = (k, v) => this.setState(s => ({ connectForm: { ...s.connectForm, [k]: v }, connectError: '' }));
  submitConnect = () => {
    const key = this.state.connectKey; const meta = this._providerMeta()[key]; if (!meta) return;
    const missing = meta.fields.filter(f => !((this.state.connectForm[f.k] || '').trim()));
    if (missing.length) return this.setState({ connectError: 'Please fill in all fields.' });
    this.setState(s => { const connections = { ...(s.repo.connections || {}), [key]: true }; const connConfig = { ...(s.repo.connConfig || {}), [key]: s.connectForm }; const repo = { ...s.repo, connections, connConfig }; try { localStorage.setItem('athena_repo', JSON.stringify(repo)); } catch (e) {} return { repo, connectOpen: false }; });
  };
  openShare = (label) => this.setState({ shareOpen: true, shareLabel: typeof label === 'string' ? label : null, shareMode: 'user', shareRecipient: '', sharePermission: 'view', shareMsg: '', shareError: '', shareSent: false });
  closeShare = () => this.setState({ shareOpen: false });
  setShareMode = (m) => this.setState({ shareMode: m, shareRecipient: '', shareError: '' });
  setShareField = (k, v) => this.setState({ [k]: v, shareError: '' });
  submitShare = () => { const r = (this.state.shareRecipient || '').trim(); if (!r) return this.setState({ shareError: this.state.shareMode === 'email' ? 'Enter an email address.' : 'Choose a team member.' }); if (this.state.shareMode === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r)) return this.setState({ shareError: 'Enter a valid email address.' }); this.setState({ shareSent: true }); clearTimeout(this._shareT); this._shareT = setTimeout(() => this.setState({ shareOpen: false, shareSent: false }), 1100); };
  openDownload = (label) => this.setState({ downloadOpen: true, downloadLabel: typeof label === 'string' ? label : null, downloadFormat: 'pdf', downloadCover: true, downloadStarted: false, downloadProtect: false, downloadPassword: '', downloadError: '' });
  closeDownload = () => this.setState({ downloadOpen: false });
  doDownload = () => { if (this.state.downloadProtect && !(this.state.downloadPassword || '').trim()) return this.setState({ downloadError: 'Enter a password or turn off protection.' }); this.setState({ downloadStarted: true, downloadError: '' }); clearTimeout(this._dlT); this._dlT = setTimeout(() => this.setState({ downloadOpen: false, downloadStarted: false }), 1100); };
  _initials = (name) => ((name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || 'U');
  toggleAccount = (e) => { if (e) e.stopPropagation(); this.setState(s => ({ accountOpen: !s.accountOpen })); };
  closeAccount = () => this.setState({ accountOpen: false });
  openAccountModal = () => this.setState({ accountModalOpen: true, accountOpen: false, accountTab: 'profile' });
  setAccountTab = (t) => this.setState({ accountTab: t });
  openPw = () => this.setState({ pwOpen: true, pw: { current: '', next: '', confirm: '' }, pwError: '' });
  closePw = () => this.setState({ pwOpen: false, pwError: '' });
  setPw = (k, v) => this.setState(s => ({ pw: { ...s.pw, [k]: v }, pwError: '' }));
  submitPw = () => {
    const { current, next, confirm } = this.state.pw;
    if (!current) return this.setState({ pwError: 'Enter your current password.' });
    if ((next || '').length < 8) return this.setState({ pwError: 'New password must be at least 8 characters.' });
    if (next !== confirm) return this.setState({ pwError: 'New passwords do not match.' });
    this.setState({ pwOpen: false, pw: { current: '', next: '', confirm: '' }, pwError: '', pwChanged: true });
    clearTimeout(this._pwFlash); this._pwFlash = setTimeout(() => this.setState({ pwChanged: false }), 4000);
  };
  closeAccountModal = () => this.setState({ accountModalOpen: false });
  setAccount = (patch) => this.setState(s => { const account = { ...s.account, ...patch }; try { localStorage.setItem('athena_account', JSON.stringify(account)); } catch (e) {} return { account }; });
  signOut = () => this.setState({ accountOpen: false, accountModalOpen: false });
  persistTypes = (list) => { try { localStorage.setItem('athena_accounttypes', JSON.stringify(list)); } catch (e) {} };
  setTypeAccess = (id, access) => this.setState(s => { const accountTypes = s.accountTypes.map(t => t.id === id ? { ...t, access } : t); this.persistTypes(accountTypes); return { accountTypes }; });
  addAccountType = () => { const n = (this.state.accountTypeDraft || '').trim(); if (!n || this.state.accountTypes.some(t => t.name.toLowerCase() === n.toLowerCase())) return; const accountTypes = [...this.state.accountTypes, { id: Date.now(), name: n, access: 'Read-only' }]; this.persistTypes(accountTypes); this.setState({ accountTypes, accountTypeDraft: '' }); };
  removeAccountType = (id) => this.setState(s => { const accountTypes = s.accountTypes.filter(t => t.id !== id); this.persistTypes(accountTypes); return { accountTypes }; });
  onAccountTypeDraft = (e) => this.setState({ accountTypeDraft: e.target.value });
  togglePill = (on) => `flex:none;min-width:48px;height:25px;border-radius:13px;border:1px solid ${on ? '#2a4a32' : '#2a302d'};background:${on ? '#13211a' : '#161a18'};color:${on ? '#5fd06f' : '#9ea69f'};font-size:9.5px;font-weight:700;letter-spacing:.5px;cursor:pointer;font-family:inherit;`;
  tagChipStyle = (a) => `display:inline-flex;align-items:center;gap:4px;font-size:11px;font-family:inherit;cursor:pointer;border-radius:5px;padding:5px 10px;background:${a ? '#13211a' : '#121614'};border:1px solid ${a ? '#2a4a32' : '#262c28'};color:${a ? '#5fd06f' : '#a7aea8'};`;
  toggleDocTag = (name) => this.setState(s => { const cur = (s.docDraft.tags || '').split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean); const has = cur.includes(name); const next = has ? cur.filter(x => x !== name) : [...cur, name]; return { docDraft: { ...s.docDraft, tags: next.join(', ') } }; });
  onDocTagInput = (e) => this.setState({ docTagInput: e.target.value, docTagFocus: true });
  onDocTagFocus = () => this.setState({ docTagFocus: true });
  onDocTagBlur = () => { clearTimeout(this._tagBlur); this._tagBlur = setTimeout(() => this.setState({ docTagFocus: false }), 140); };
  _docTagSuggest = () => { const added = (this.state.docDraft.tags || '').split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean); const q = (this.state.docTagInput || '').trim().toLowerCase().replace(/^#/, ''); return this.state.lib.tags.filter(t => !added.includes(t) && (!q || t.toLowerCase().includes(q))); };
  onDocTagKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); this.addDocDraftTag(e.target.value); } };
  addDocDraftTag = (name) => { name = (name || '').trim().replace(/^#/, ''); if (!name) return; this.setState(s => { const cur = (s.docDraft.tags || '').split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean); if (cur.includes(name)) return { docTagInput: '' }; return { docDraft: { ...s.docDraft, tags: [...cur, name].join(', ') }, docTagInput: '' }; }); };
  removeDocDraftTag = (name) => this.setState(s => { const cur = (s.docDraft.tags || '').split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean); return { docDraft: { ...s.docDraft, tags: cur.filter(x => x !== name).join(', ') } }; });
  onSaveDoc = () => { const s = this.state; const code = s.selectedId; const dr = s.mdDraft; if (!dr || dr.code !== code) return; this._updateDocMeta(code, { status: dr.status, collection: dr.collection, kind: dr.kind, manufacturer: dr.author, author: dr.author, version: dr.version, model: dr.partNumber, partNo: dr.partNumber }); this.setState({ mdDraft: null, docSaved: true }); clearTimeout(this._stSave); this._stSave = setTimeout(() => this.setState({ docSaved: false }), 1600); };
  tabStyle = (active) => `flex:none;padding:10px 14px;background:transparent;border:none;border-bottom:2px solid ${active ? '#3fb950' : 'transparent'};color:${active ? '#dfe4e1' : '#9ea69f'};font-family:inherit;font-size:11px;font-weight:${active ? 700 : 400};letter-spacing:.3px;cursor:pointer;`;
  onLogoFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const isTiff = /\.tiff?$/i.test(f.name) || /tiff/i.test(f.type);
    if (isTiff && window.UTIF) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const buf = r.result;
          const ifds = window.UTIF.decode(buf);
          window.UTIF.decodeImage(buf, ifds[0]);
          const rgba = window.UTIF.toRGBA8(ifds[0]);
          const w = ifds[0].width, h = ifds[0].height;
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          const ctx = c.getContext('2d');
          const id = ctx.createImageData(w, h);
          id.data.set(rgba);
          ctx.putImageData(id, 0, 0);
          this.setState({ logo: c.toDataURL('image/png') });
        } catch (err) {
          const r2 = new FileReader();
          r2.onload = () => this.setState({ logo: r2.result });
          r2.readAsDataURL(f);
        }
      };
      r.readAsArrayBuffer(f);
    } else {
      const r = new FileReader();
      r.onload = () => this.setState({ logo: r.result });
      r.readAsDataURL(f);
    }
  };
  clearLogo = () => this.setState({ logo: null });
  zoomIn = () => this.setState(s => ({ previewZoom: Math.min(2, +(s.previewZoom + 0.1).toFixed(2)) }));
  zoomOut = () => this.setState(s => ({ previewZoom: Math.max(0.5, +(s.previewZoom - 0.1).toFixed(2)) }));
  zoomReset = () => this.setState({ previewZoom: 1 });
  setPreviewRef = (el) => {
    if (el === this.previewEl) return;
    if (this.previewEl) {
      this.previewEl.removeEventListener('scroll', this.onScrollPreview);
      this.previewEl.removeEventListener('wheel', this.onWheelZoom);
    }
    this.previewEl = el || null;
    if (el) {
      el.addEventListener('scroll', this.onScrollPreview);
      el.addEventListener('wheel', this.onWheelZoom, { passive: false });
    }
  };
  onWheelZoom = (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const d = e.deltaY < 0 ? 0.1 : -0.1; this.setState(s => ({ previewZoom: Math.min(2, Math.max(0.5, +(s.previewZoom + d).toFixed(2))) })); return; }
    if (this.state.viewMode === 'single') this.wheelPage(e, this._scroller(), 'curPage', this.gotoPage);
  };
  _scroller = () => document.getElementById('subPreview');
  onScrollPreview = () => {
    if (this.state.viewMode === 'single' || this._navRaf) return;
    this._navRaf = requestAnimationFrame(() => {
      this._navRaf = null;
      const el = this._scroller(); if (!el) return;
      const pages = el.querySelectorAll('.subpage');
      const mid = el.getBoundingClientRect().top + el.clientHeight / 2;
      let cur = 1;
      pages.forEach((p, i) => { if (p.getBoundingClientRect().top <= mid) cur = i + 1; });
      if (cur !== this.state.curPage) this.setState({ curPage: cur });
    });
  };
  gotoPage = (n) => {
    const el = this._scroller(); if (!el) return;
    const pages = el.querySelectorAll('.subpage');
    if (!pages.length) return;
    const idx = Math.max(1, Math.min(pages.length, n || 1)) - 1;
    if (this.state.viewMode === 'single') { this.setState({ curPage: idx + 1 }, () => { this.applyViewMode(); const e = this._scroller(); if (e) e.scrollTop = 0; }); return; }
    const t = pages[idx];
    el.scrollTop = Math.max(0, t.offsetTop - 18);
    this.setState({ curPage: idx + 1 });
  };
  prevPage = () => this.gotoPage(this.state.curPage - 1);
  gotoPageCentered = (n) => {
    const el = this._scroller(); if (!el) return;
    const pages = el.querySelectorAll('.subpage'); if (!pages.length) return;
    const idx = Math.max(1, Math.min(pages.length, n || 1)) - 1;
    if (this.state.viewMode === 'single') { this.setState({ curPage: idx + 1 }, () => { this.applyViewMode(); const e = this._scroller(); if (e) e.scrollTop = 0; }); return; }
    const t = pages[idx];
    const fits = t.offsetHeight <= el.clientHeight;
    el.scrollTop = Math.max(0, fits ? (t.offsetTop - (el.clientHeight - t.offsetHeight) / 2) : (t.offsetTop - 20));
    this.setState({ curPage: idx + 1 });
  };
  nextPage = () => this.gotoPage(this.state.curPage + 1);
  onGotoInput = (e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) this.gotoPageCentered(n); };
  titleCase = (s) => (s || '').toLowerCase().replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
  formatDate = (d) => { if (/^\d{4}-\d{2}-\d{2}$/.test(d || '')) { const p = d.split('-'); return (+p[1]) + '/' + (+p[2]) + '/' + p[0].slice(2); } return d || ''; };

  splitCSVLine(line) {
    const out = []; let cur = ''; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else { if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c; }
    }
    out.push(cur);
    return out.map(s => s.trim());
  }

  parseCBOM(csv) {
    const lines = (csv || '').split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    const first = this.splitCSVLine(lines[0]).join(' ').toLowerCase();
    const hasHeader = /manufacturer|model|datasheet|qty|tag/.test(first);
    const rows = hasHeader ? lines.slice(1) : lines;
    return rows.map(l => {
      const c = this.splitCSVLine(l);
      return {
        tag: '', manufacturer: c[0] || '', model: c[1] || '',
        description: c[2] || '', qty: parseInt(c[3], 10) || 0,
        dsId: c[4] || c[1] || '',
      };
    });
  }

  matchDoc(row, all) {
    return all.find(d => d.code === row.dsId) ||
           all.find(d => d.model && row.model && d.model.toLowerCase() === row.model.toLowerCase()) ||
           null;
  }

  buildSubmittal() {
    const sub = this.state.sub;
    const all = this.allDocs();
    const rows = this.parseCBOM(sub.csv);
    const items = rows.map((r, i) => {
      const doc = this.matchDoc(r, all);
      return { ...r, doc, matched: !!doc, n: i + 1 };
    });
    const matched = items.filter(x => x.matched);
    const unmatched = items.filter(x => !x.matched);
    const totalQty = items.reduce((a, x) => a + (x.qty || 0), 0);

    const keyOf = (x) => sub.groupBy === 'manufacturer' ? (x.doc ? x.doc.manufacturer : '—') : (x.doc ? x.doc.collection : 'Unmatched');
    const corder = (sub.categoryOrder || []);
    const oIdx = (k) => { const i = corder.indexOf(k); return i === -1 ? 999 : i; };
    const catCmp = (a, b) => { if (sub.groupBy === 'category') { const d = oIdx(a) - oIdx(b); if (d !== 0) return d; } return a.localeCompare(b); };

    // pagination (cover not numbered) — index now carries the bill of material; datasheets follow
    let page = 1;
    const indexPage = sub.includeIndex ? page : 0; if (sub.includeIndex) page += 1;

    // datasheet pages: matched items grouped + sorted, page numbers assigned
    const gmap = {};
    matched.forEach(x => { const k = keyOf(x); (gmap[k] = gmap[k] || []).push(x); });
    const gkeys = Object.keys(gmap).sort(catCmp);
    const sections = gkeys.map(k => {
      const its = gmap[k].map(x => {
        const start = page; page += (x.doc.pages || 1);
        x._start = start;
        return {
          tag: x.tag, qty: x.qty,
          model: x.doc.model, manufacturer: x.doc.manufacturer,
          title: x.doc.title, abstract: x.doc.abstract, pages: x.doc.pages || 1,
          code: x.doc.code, startPage: start,
          desc: x.description, pdfDataUrl: x.doc.pdfDataUrl || null,
        };
      });
      return { label: k, items: its };
    });
    const totalPages = page - 1;

    // preview navigation pages (one nav entry per rendered sheet)
    const navPages = ['Cover'];
    if (sub.includeIndex) navPages.push('Index');
    sections.forEach(s => s.items.forEach(it => navPages.push(it.model)));
    const navItems = navPages.map((l, i) => ({ label: (i + 1) + '.  ' + l, idx: i + 1 }));
    const curPage = Math.min(this.state.curPage, navPages.length);

    const footerText = 'Power Design Incorporated      ·      ' + sub.project + ' — ' + sub.title;
    const pf = (n) => 'Page ' + n + ' of ' + totalPages;

    // combined index + bill of material: ALL items grouped (unmatched listed last with no page)
    const allByGroup = {};
    items.forEach(x => { const k = x.matched ? keyOf(x) : 'Not in library — no datasheet'; (allByGroup[k] = allByGroup[k] || []).push(x); });
    const allKeys = Object.keys(allByGroup).sort((a, b) => {
      const ua = /Not in library/.test(a), ub = /Not in library/.test(b);
      if (ua !== ub) return ua ? 1 : -1;
      return catCmp(a, b);
    });
    let dsSeq = 0;
    const navBase = 1 + (sub.includeIndex ? 1 : 0);
    const indexGroups = allKeys.map(k => ({
      label: k,
      items: allByGroup[k].map(x => {
        const navIdx = x.matched ? navBase + (++dsSeq) : 0;
        return {
          part: x.matched ? x.doc.model : x.model,
          mfr: x.matched ? x.doc.manufacturer : x.manufacturer,
          desc: x.description,
          qty: x.qty,
          matched: x.matched,
          page: x.matched ? (x.doc.pages > 1 ? (x._start + '–' + (x._start + x.doc.pages - 1)) : ('' + x._start)) : '—',
          href: x.matched ? ('#subpg-' + navIdx) : undefined,
          onClick: x.matched ? (e) => { if (e) e.preventDefault(); this.gotoPageCentered(navIdx); } : undefined,
          rowStyle: 'display:grid;grid-template-columns:92px 84px 1fr 34px 52px;gap:8px;padding:2px 4px;border-bottom:1px solid #eeeee8;font-size:1em;color:#2a2a26;text-decoration:none;align-items:center;cursor:' + (x.matched ? 'pointer' : 'default') + ';',
          pageStyle: x.matched ? 'text-align:right;color:#2A6FDB;font-weight:600;text-decoration:underline;text-underline-offset:2px;' : 'text-align:right;color:#9a9a90;font-weight:600;',
        };
      }),
    }));
    // datasheet pages with footers
    let dsNav = 0;
    const dsSections = sections.map(s => ({
      label: s.label,
      items: s.items.map(it => ({
        tag: it.tag, manufacturer: it.manufacturer, model: it.model,
        title: it.title, abstract: it.abstract, qty: it.qty,
        pages: it.pages, code: it.code,
        pageId: 'subpg-' + (navBase + (++dsNav)),
        footer: pf(it.startPage), section: s.label,
        pagesNote: it.pages > 1 ? (it.pages + ' pp · drop manufacturer PDF') : 'drop manufacturer PDF',
        hasPdf: !!it.pdfDataUrl, noPdf: !it.pdfDataUrl,
        canvas: it.pdfDataUrl ? React.createElement(PdfPage, { src: it.pdfDataUrl, pageNumber: 1, width: 612 }) : null,
      })),
    }));

    return {
      sub,
      subOpen: this.state.subOpen,
      onOpenSubmittal: this.openSubmittal,
      onCloseSubmittal: this.closeSubmittal,
      onExport: () => { const ss = this.state.sub; this.openDownload((ss.project || 'Submittal').replace(/\s+/g, '_') + '_Rev' + (ss.revision || '0') + '.pdf'); },
      onSaveVersion: this.saveVersion,
      onSaveAsNew: this.saveAsNew,
      onToggleSaveMenu: this.toggleSaveMenu,
      saveMenuOpen: this.state.saveMenuOpen,
      mainView: this.state.mainView,
      libView: this.state.mainView === 'library',
      subMgrView: this.state.mainView === 'submittals',
      onViewLibrary: () => this.setMainView('library'),
      onViewSubmittals: () => this.setMainView('submittals'),
      viewLibStyle: this.segStyleC(this.state.mainView === 'library'),
      viewSubStyle: this.segStyleC(this.state.mainView === 'submittals'),
      onNewSubmittal: this.openSubmittal,
      subHeaderStyle: 'display:grid;grid-template-columns:' + this.state.colW.sub.map(w => w + 'px').join(' ') + ' 92px 1fr;gap:12px;padding:9px 16px;background:#0e110f;border-bottom:1px solid #1f2421;font-size:9px;letter-spacing:1px;color:#a4aba5;font-weight:600;',
      projHeaderStyle: 'display:grid;grid-template-columns:' + this.state.colW.proj.map(w => w + 'px').join(' ') + ' 120px 1fr;gap:12px;padding:9px 16px;background:#0e110f;border-bottom:1px solid #1f2421;font-size:9px;letter-spacing:1px;color:#a4aba5;font-weight:600;',
      res: { sub0: e => this.startResize('sub', 0, e), sub1: e => this.startResize('sub', 1, e), sub2: e => this.startResize('sub', 2, e), sub3: e => this.startResize('sub', 3, e), sub4: e => this.startResize('sub', 4, e), proj0: e => this.startResize('proj', 0, e), proj1: e => this.startResize('proj', 1, e), proj2: e => this.startResize('proj', 2, e), proj3: e => this.startResize('proj', 3, e), proj4: e => this.startResize('proj', 4, e) },
      projView: this.state.mainView === 'projects',
      onViewProjects: () => this.setMainView('projects'),
      viewProjStyle: this.segStyleC(this.state.mainView === 'projects'),
      projDraft: this.state.projDraft,
      projFormOpen: this.state.projFormOpen,
      projGridCols: 'flex:1;overflow-y:auto;min-height:0;display:grid;grid-template-columns:' + (this.state.projFormOpen ? '340px 1fr' : '1fr') + ';gap:0;',
      onAddProject: this.openProjForm,
      onCancelProject: this.cancelProjForm,
      draftEditing: !!this.state.projDraft.id,
      projFormTitle: this.state.projDraft.id ? 'EDIT PROJECT' : 'ADD PROJECT',
      projSaveLabel: this.state.projDraft.id ? 'Update project' : 'Add project',
      onDraftName: e => this.setDraft('name', e.target.value),
      onDraftNumber: e => this.setDraft('number', e.target.value),
      onDraftAddress: e => this.setDraft('address', e.target.value),
      onDraftCity: e => this.setDraft('city', e.target.value),
      onDraftState: e => this.setDraft('state', e.target.value),
      onDraftZip: e => this.setDraft('zip', e.target.value),
      onDraftManager: e => this.setDraft('manager', e.target.value),
      onDraftDesigner: e => this.setDraft('designer', e.target.value),
      onSaveProject: this.saveProject,
      onImportCBOM: this.onImportCBOM,
      onDownloadTemplate: this.downloadTemplate,
      cbomLabel: (() => { const c = this.state.projDraft.csv; const n = c ? c.split(/\r?\n/).filter(l => l.trim()).length : 0; return n ? (Math.max(0, n - 1) + ' line items loaded') : 'No submittal data imported'; })(),
      projectCount: this.state.projects.length,
      projectCountLabel: '(' + this.state.projects.length + ')',
      hasProjects: this.state.projects.length > 0,
      subQuery: this.state.subQuery, onSubQuery: this.onSubQuery,
      projQuery: this.state.projQuery, onProjQuery: this.onProjQuery,
      subFilterStatus: this.state.subFilterStatus, onSubFilterStatus: this.onSubFilterStatus,
      subStatusOptions: [{ value: 'all', label: 'All statuses' }, { value: 'Draft', label: 'Draft' }, { value: 'For Approval', label: 'For Approval' }, { value: 'Approved', label: 'Approved' }, { value: 'Revise & Resubmit', label: 'Revise & Resubmit' }],
      sortSub: { project: () => this.setSubSort('project'), status: () => this.setSubSort('status'), rev: () => this.setSubSort('rev'), date: () => this.setSubSort('date'), versions: () => this.setSubSort('versions') },
      sortSubInd: { project: this._sortInd('sub', 'project'), status: this._sortInd('sub', 'status'), rev: this._sortInd('sub', 'rev'), date: this._sortInd('sub', 'date'), versions: this._sortInd('sub', 'versions') },
      sortProj: { project: () => this.setProjSort('project'), number: () => this.setProjSort('number'), address: () => this.setProjSort('address'), manager: () => this.setProjSort('manager'), designer: () => this.setProjSort('designer') },
      sortProjInd: { project: this._sortInd('proj', 'project'), number: this._sortInd('proj', 'number'), address: this._sortInd('proj', 'address'), manager: this._sortInd('proj', 'manager'), designer: this._sortInd('proj', 'designer') },
      noProjects: this.state.projects.length === 0,
      projectRows: this._projSorted().map(p => {
        const exp = !!this.state.projExpanded[p.id];
        const subs = this.state.versions.filter(v => ((v.sub && v.sub.project) || '') === p.name);
        return {
        name: p.name || '—', number: p.number || '—', address: p.address || '', manager: p.manager || '—', designer: p.designer || '—',
        expanded: exp, hasSubs: subs.length > 0, noSubs: subs.length === 0,
        chevron: exp ? this.ic('chevDown', 13) : this.ic('chevRight', 13),
        rowStyle: 'display:grid;grid-template-columns:' + this.state.colW.proj.map(w => w + 'px').join(' ') + ' 120px 1fr;gap:12px;padding:10px 16px;border-bottom:1px solid #14181666;align-items:center;font-size:11px;color:#cdd3cf;cursor:pointer;background:' + (exp ? '#101413' : 'transparent') + ';',
        onSelect: () => this.toggleProjExpand(p.id),
        onUse: (e) => { if (e) e.stopPropagation(); this.newSubmittalFromProject(p.id); },
        onEdit: (e) => { if (e) e.stopPropagation(); this.editProject(p.id); },
        onDelete: (e) => { if (e) e.stopPropagation(); this.deleteProject(p.id); },
        submittals: subs.map(v => ({
          rev: 'Rev ' + ((v.sub && v.sub.revision) || '0'),
          dateLabel: this.formatDate((v.sub && v.sub.date) || ''),
          status: (v.sub && v.sub.status) || '—',
          created: new Date(v.createdAt || v.id).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          onOpen: (e) => { if (e) e.stopPropagation(); this.openVersionInEditor(v.id); },
          onDelete: (e) => { if (e) e.stopPropagation(); this.deleteVersion(v.id); },
        })),
      }; }),
      projectOptions: this.state.projects.map(p => ({ id: p.id, name: p.name + (p.number ? ('  ·  ' + p.number) : '') })),
      projectSelectValue: (() => { const m = this.state.projects.find(p => p.name === this.state.sub.project); return m ? String(m.id) : ''; })(),
      onPickProject: e => { if (e.target.value) this.pickProject(e.target.value); },
      submittalGroups: (() => {
        const groups = {};
        this.state.versions.forEach(v => { const p = (v.sub && v.sub.project) || 'Untitled'; (groups[p] = groups[p] || []).push(v); });
        const fq = (this.state.subQuery || '').trim().toLowerCase();
        const fst = this.state.subFilterStatus || 'all';
        const { key: sk, dir: sd } = this.state.subSort;
        const sval = (p) => { const sv = (groups[p][0].sub) || {}; return sk === 'status' ? (sv.status || '') : sk === 'rev' ? (parseFloat(sv.revision || '0') || 0) : sk === 'date' ? (new Date(sv.date || 0).getTime() || 0) : sk === 'versions' ? groups[p].length : p; };
        let gkeys = Object.keys(groups).filter(p => { if (fq && !(p.toLowerCase().includes(fq) || ((groups[p][0].sub && groups[p][0].sub.title) || '').toLowerCase().includes(fq))) return false; if (fst !== 'all' && ((groups[p][0].sub && groups[p][0].sub.status) || '') !== fst) return false; return true; });
        if (sk) gkeys.sort((a, b) => { const va = sval(a), vb = sval(b); const r = (typeof va === 'number') ? va - vb : String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' }); return sd === 'asc' ? r : -r; });
        return gkeys.map(p => {
          const vs = groups[p]; const latest = vs[0]; const sv = latest.sub || {};
          const exp = !!this.state.subExpanded[p];
          return {
            project: p,
            statusLabel: sv.status || '—',
            rev: 'Rev ' + (sv.revision || '0'),
            dateLabel: this.formatDate(sv.date || ''),
            countLabel: vs.length + (vs.length === 1 ? ' ver' : ' vers'),
            expanded: exp, collapsed: !exp, chevron: exp ? this.ic('chevDown', 14) : this.ic('chevRight', 14),
            rowBg: exp ? '#101413' : 'transparent',
            rowStyle: 'display:grid;grid-template-columns:' + this.state.colW.sub.map(w => w + 'px').join(' ') + ' 92px 1fr;gap:12px;padding:11px 16px;align-items:center;font-size:11.5px;color:#cdd3cf;cursor:pointer;background:' + (exp ? '#101413' : 'transparent') + ';',
            onToggle: () => this.toggleExpand(p),
            onOpenLatest: (e) => { if (e) e.stopPropagation(); this.openVersionInEditor(latest.id); },
            versions: vs.map(v => ({
              rev: 'Rev ' + ((v.sub && v.sub.revision) || '0'),
              dateLabel: this.formatDate((v.sub && v.sub.date) || ''),
              created: new Date(v.createdAt || v.id).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              modified: new Date(v.modifiedAt || v.id).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              wasModified: !!(v.modifiedAt && v.createdAt && v.modifiedAt !== v.createdAt),
              onOpen: (e) => { if (e) e.stopPropagation(); this.openVersionInEditor(v.id); },
              onDelete: (e) => { if (e) e.stopPropagation(); this.deleteVersion(v.id); },
            })),
          };
        });
      })(),
      onToggleVersions: this.toggleVersions,
      onCloseVersions: () => this.setState({ versionsOpen: false }),
      versionsOpen: this.state.versionsOpen,
      versionCount: this.state.versions.length,
      hasVersions: this.state.versions.length > 0,
      noVersions: this.state.versions.length === 0,
      savedFlash: this.state.savedFlash,
      saveLabel: this.state.savedFlash ? 'SAVED' : 'SAVE',
      saveIcon: this.state.savedFlash ? this.ic('check', 14) : this.ic('download', 14),
      versionCountLabel: '(' + this.state.versions.length + ')',
      versionList: this.state.versions.map(v => ({ name: v.name, onLoad: () => this.applyVersion(v.id), onDelete: (e) => { if (e) e.stopPropagation(); this.deleteVersion(v.id); } })),
      previewZoom: this.state.previewZoom,
      previewZoomPct: Math.round(this.state.previewZoom * 100) + '%',
      onZoomIn: this.zoomIn,
      onZoomOut: this.zoomOut,
      onZoomReset: this.zoomReset,
      setPreviewRef: this.setPreviewRef,
      navItems,
      navCount: navPages.length,
      navCurLabel: navPages[curPage - 1] || '',
      curPage,
      onPrevPage: this.prevPage,
      onNextPage: this.nextPage,
      onGotoPage: (e) => this.gotoPageCentered(parseInt(e.target.value, 10)),
      onGotoInput: this.onGotoInput,
      hasLogo: !!this.state.logo,
      noLogo: !this.state.logo,
      logoSrc: this.state.logo || '',
      logoFooter: this.state.logo ? React.createElement('img', { src: this.state.logo, style: { maxHeight: '48px', maxWidth: '240px', objectFit: 'contain', display: 'block' } }) : null,
      logoCover: this.state.logo ? React.createElement('img', { src: this.state.logo, style: { maxHeight: '52px', maxWidth: '260px', objectFit: 'contain', display: 'block' } }) : null,
      logoConfig: this.state.logo ? React.createElement('img', { src: this.state.logo, style: { maxHeight: '34px', maxWidth: '150px', objectFit: 'contain', display: 'block' } }) : null,
      onLogoFile: this.onLogoFile,
      onClearLogo: this.clearLogo,
      footerTitle: this.titleCase(sub.title),
      hasPM: !!(sub.projectManager || '').trim(),
      hasDesigner: !!(sub.designer || '').trim(),
      footerDate: this.formatDate(sub.date),
      subH: {
        project: e => this.setSub('project', e.target.value),
        address: e => this.setSub('address', e.target.value),
        city: e => this.setSub('city', e.target.value),
        state: e => this.setSub('state', e.target.value),
        zip: e => this.setSub('zip', e.target.value),
        projectNumber: e => this.setSub('projectNumber', e.target.value),
        projectManager: e => this.setSub('projectManager', e.target.value),
        designer: e => this.setSub('designer', e.target.value),
        title: e => this.setSub('title', e.target.value),
        submittalNo: e => this.setSub('submittalNo', e.target.value),
        revision: e => this.setSub('revision', e.target.value),
        status: e => this.setSub('status', e.target.value),
        date: e => this.setSub('date', e.target.value),
        preparedName: e => this.setSub('preparedName', e.target.value),
        preparedEmail: e => this.setSub('preparedEmail', e.target.value),
        csv: e => this.setSub('csv', e.target.value),
        font: e => this.setSub('font', e.target.value),
        fontSize: e => this.setSub('fontSize', parseFloat(e.target.value)),
        coverFont: e => this.setSub('coverFont', e.target.value),
        coverTitleSize: e => this.setSub('coverTitleSize', parseFloat(e.target.value)),
        indexFont: e => this.setSub('indexFont', e.target.value),
        indexHeadingSize: e => this.setSub('indexHeadingSize', parseFloat(e.target.value)),
        indexItemSize: e => this.setSub('indexItemSize', parseFloat(e.target.value)),
        indexGroupFont: e => this.setSub('indexGroupFont', e.target.value),
        indexGroupSize: e => this.setSub('indexGroupSize', parseFloat(e.target.value)),
        pageSize: e => this.setSub('pageSize', e.target.value),
        margin: e => this.setSub('margin', parseFloat(e.target.value)),
        orientPortrait: () => this.setSub('orientation', 'Portrait'),
        orientLandscape: () => this.setSub('orientation', 'Landscape'),
        groupCat: () => this.setSub('groupBy', 'category'),
        groupMfr: () => this.setSub('groupBy', 'manufacturer'),
        toggleIndex: () => this.setSub('includeIndex', !sub.includeIndex),
        toggleBom: () => this.setSub('includeBom', !sub.includeBom),
        coName: e => this.setCompany('name', e.target.value),
        coAddr1: e => this.setCompany('addr1', e.target.value),
        coAddr2: e => this.setCompany('addr2', e.target.value),
        coPhone: e => this.setCompany('phone', e.target.value),
        coWeb: e => this.setCompany('web', e.target.value),
      },
      grpCatStyle: this.segStyle(sub.groupBy === 'category'),
      grpMfrStyle: this.segStyle(sub.groupBy === 'manufacturer'),
      onTabProject: () => this.setTab('project'),
      onTabItems: () => this.setTab('items'),
      onTabLayout: () => this.setTab('layout'),
      onTabIndex: () => this.setTab('index'),
      iMoveUp: this.ic('chevUp', 14), iMoveDown: this.ic('chevDown', 14), iGrip: this.ic('grip', 16),
      categoryOrderRows: (() => { const order = this._catOrder(); const drag = this.state.dragCat, over = this.state.dragOverCat; const step = 44; const innerBase = 'display:flex;align-items:center;gap:10px;height:100%;box-sizing:border-box;border-radius:7px;padding:0 11px;cursor:grab;will-change:transform;transition:transform .2s cubic-bezier(.2,.8,.3,1), background .16s ease, border-color .16s ease, opacity .16s ease;'; return order.map((name, i) => { let ty = 0; if (drag != null && over != null && drag !== over) { if (over > drag) { if (i > drag && i <= over) ty = -step; } else { if (i >= over && i < drag) ty = step; } } const isDrag = drag === i; const skin = isDrag ? 'background:#16201a;border:1px solid #3fb950;opacity:.4;' : 'background:#121614;border:1px solid #232925;'; const innerStyle = innerBase + `transform:translate3d(0,${ty}px,0);` + skin; return { name, num: i + 1, wrapperStyle: 'height:38px;box-sizing:border-box;', innerStyle, onDragStart: (e) => { if (e && e.dataTransfer) { try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); } catch (_) {} } this.setState({ dragCat: i, dragOverCat: i }); }, onDragEnter: (e) => { if (e) e.preventDefault(); if (this.state.dragCat != null && this.state.dragOverCat !== i) this.setState({ dragOverCat: i }); }, onDragOver: (e) => { if (e) e.preventDefault(); }, onDrop: (e) => { if (e) e.preventDefault(); this.moveCategoryTo(this.state.dragCat, i); }, onDragEnd: () => this.setState({ dragCat: null, dragOverCat: null }) }; }); })(),
      settingsOpen: this.state.settingsOpen,
      onOpenSettings: this.openSettings,
      onCloseSettings: this.closeSettings,
      stCompanyStyle: this.tabStyle(this.state.settingsTab === 'company'), onStCompany: () => this.setSettingsTab('company'), stCompanyDisp: this.state.settingsTab === 'company' ? '' : 'display:none;',
      stCollStyle: this.tabStyle(this.state.settingsTab === 'coll'), onStColl: () => this.setSettingsTab('coll'), stCollDisp: this.state.settingsTab === 'coll' ? '' : 'display:none;',
      stTypesStyle: this.tabStyle(this.state.settingsTab === 'types'), onStTypes: () => this.setSettingsTab('types'), stTypesDisp: this.state.settingsTab === 'types' ? '' : 'display:none;',
      stMfrsStyle: this.tabStyle(this.state.settingsTab === 'mfrs'), onStMfrs: () => this.setSettingsTab('mfrs'), stMfrsDisp: this.state.settingsTab === 'mfrs' ? '' : 'display:none;',
      stTagsStyle: this.tabStyle(this.state.settingsTab === 'tags'), onStTags: () => this.setSettingsTab('tags'), stTagsDisp: this.state.settingsTab === 'tags' ? '' : 'display:none;',
      stRepoStyle: this.tabStyle(this.state.settingsTab === 'repo'), onStRepo: () => this.setSettingsTab('repo'), stRepoDisp: this.state.settingsTab === 'repo' ? '' : 'display:none;',
      onSaveSettings: this.saveSettings,
      settingsSaveLabel: this.state.settingsSaved ? 'Saved' : 'Save',
      repo: this.state.repo,
      onRepoName: e => this.setRepo({ name: e.target.value }),
      onRepoLocation: e => this.setRepo({ location: e.target.value }),
      onRepoDefaultColl: e => this.setRepo({ defaultColl: e.target.value }),
      onRepoAutoIndex: () => this.setRepo({ autoIndex: !this.state.repo.autoIndex }),
      onRepoDedupe: () => this.setRepo({ dedupe: !this.state.repo.dedupe }),
      onBrowseLocation: this.onBrowseLocation,
      setBrowseInput: this.setBrowseInput,
      onBrowsePicked: this.onBrowsePicked,
      browseOpen: this.state.browseOpen,
      browsePath: this.state.browsePath,
      browseCanUp: this.state.browsePath !== '/',
      onBrowseUp: this.browseUp,
      onBrowseSelect: this.browseSelect,
      onCloseBrowse: this.closeBrowse,
      iFolderRow: this.ic('folder', 15),
      iChevRow: this.ic('chevRight', 14),
      browseFolders: (this._fs()[this.state.browsePath] || []).map(name => ({ name, onOpen: () => this.browseInto(name) })),
      browseEmpty: (this._fs()[this.state.browsePath] || []).length === 0,
      iFolderOpen: this.ic('folderOpen', 14),
      storageProviders: [
        { key: 's3', name: 'Amazon S3', icon: 'cloud' },
        { key: 'gdrive', name: 'Google Drive', icon: 'cloud' },
        { key: 'dropbox', name: 'Dropbox', icon: 'cloud' },
        { key: 'smb', name: 'Network share (SMB)', icon: 'server' },
      ].map(p => { const on = !!(this.state.repo.connections && this.state.repo.connections[p.key]); return { name: p.name, icon: this.ic(p.icon, 16), statusLabel: on ? 'Connected' : 'Not connected', btnLabel: on ? 'Disconnect' : 'Connect', onToggle: on ? (() => this.toggleConnection(p.key)) : (() => this.openConnect(p.key)), btnStyle: on ? 'flex:none;height:30px;padding:0 13px;background:#13211a;border:1px solid #2a4a32;border-radius:6px;color:#5fd06f;font-weight:600;font-size:10.5px;letter-spacing:.3px;cursor:pointer;font-family:inherit;' : 'flex:none;height:30px;padding:0 13px;background:#161a18;border:1px solid #2a302d;border-radius:6px;color:#cdd3cf;font-weight:600;font-size:10.5px;letter-spacing:.3px;cursor:pointer;font-family:inherit;' }; }),
      connectOpen: this.state.connectOpen,
      connectTitle: this.state.connectKey ? ('Connect ' + (this._providerMeta()[this.state.connectKey] || {}).name) : 'Connect',
      connectFields: (() => { const m = this.state.connectKey ? this._providerMeta()[this.state.connectKey] : null; return m ? m.fields.map(f => ({ label: f.label, inputType: f.type || 'text', placeholder: f.placeholder || '', value: this.state.connectForm[f.k] || '', onInput: e => this.setConnectField(f.k, e.target.value) })) : []; })(),
      connectError: this.state.connectError,
      onCloseConnect: this.closeConnect,
      onSubmitConnect: this.submitConnect,
      repoAutoIndexStyle: this.togglePill(this.state.repo.autoIndex), repoAutoIndexLabel: this.state.repo.autoIndex ? 'ON' : 'OFF',
      repoDedupeStyle: this.togglePill(this.state.repo.dedupe), repoDedupeLabel: this.state.repo.dedupe ? 'ON' : 'OFF',
      docTagInput: this.state.docTagInput,
      onDocTagInput: this.onDocTagInput,
      onDocTagKey: this.onDocTagKey,
      onDocTagFocus: this.onDocTagFocus,
      onDocTagBlur: this.onDocTagBlur,
      docTagSuggestions: this._docTagSuggest().map(name => ({ name, onPick: () => { this.addDocDraftTag(name); this.onDocTagFocus(); } })),
      showTagSuggest: this.state.docTagFocus && this._docTagSuggest().length > 0,
      docTagChips: (() => { const cur = (this.state.docDraft.tags || '').split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean); return cur.map(name => ({ name, onRemove: () => this.removeDocDraftTag(name) })); })(),
      onTabCompany: () => this.setTab('company'),
      tabProjectStyle: this.tabStyle(this.state.subTab === 'project'),
      tabItemsStyle: this.tabStyle(this.state.subTab === 'items'),
      tabLayoutStyle: this.tabStyle(this.state.subTab === 'layout'),
      tabIndexStyle: this.tabStyle(this.state.subTab === 'index'),
      tabCompanyStyle: this.tabStyle(this.state.subTab === 'company'),
      tabProjectDisp: this.state.subTab === 'project' ? '' : 'display:none;',
      tabItemsDisp: this.state.subTab === 'items' ? '' : 'display:none;',
      tabLayoutDisp: this.state.subTab === 'layout' ? '' : 'display:none;',
      tabIndexDisp: this.state.subTab === 'index' ? '' : 'display:none;',
      tabCompanyDisp: this.state.subTab === 'company' ? '' : 'display:none;',
      ...this.fmtVals(sub),
      docFont: sub.font,
      docBaseFs: sub.fontSize + 'px',
      fontSize: sub.fontSize,
      coverFontStyle: sub.coverFont || sub.font,
      coverProjFs: sub.coverTitleSize + 'px',
      coverAddrFs: Math.round(sub.coverTitleSize * 0.85) + 'px',
      coverCityLine: [sub.city, sub.state].filter(Boolean).join(', ') + (sub.zip ? ' ' + sub.zip : ''),
      coverTitleFs: Math.round(sub.coverTitleSize * 0.78) + 'px',
      indexFontStyle: sub.indexFont || sub.font,
      indexGroupFontStyle: sub.indexGroupFont || sub.indexFont || sub.font,
      indexGroupFs: (sub.indexGroupSize || 11) + 'px',
      indexHeadingFs: sub.indexHeadingSize + 'px',
      indexItemFs: sub.indexItemSize + 'px',
      sheetW: this.pageDims(sub).w,
      sheetH: this.pageDims(sub).h,
      pageSize: sub.pageSize,
      marginPx: Math.round((sub.margin || 0.5) * 96) + 'px',
      marginLabel: (sub.margin || 0.5).toFixed(2) + ' in',
      ...this.pagePreview(sub),
      portStyle: this.segStyle(sub.orientation === 'Portrait'),
      landStyle: this.segStyle(sub.orientation === 'Landscape'),
      company: this.state.company,
      idxToggleStyle: this.chkStyle(sub.includeIndex),
      idxChk: this.iBox(sub.includeIndex),
      subLineCount: items.length,
      subMatched: matched.length,
      subUnmatched: unmatched.length,
      subUnmatchedList: unmatched.map(x => x.manufacturer + ' ' + x.model),
      subHasUnmatched: unmatched.length > 0,
      subTotalQty: totalQty,
      subTotalPages: totalPages,
      subFooter: footerText,
      indexFooter: pf(indexPage),
      subIncludeIndex: sub.includeIndex,
      indexGroups,
      dsSections,
      coverStatus: sub.status,
    };
  }

  segStyle(active) {
    const a = this.accent();
    return `flex:1;font-size:10.5px;font-family:inherit;cursor:pointer;border:none;padding:7px 0;background:${active ? '#1c2a22' : '#0e110f'};color:${active ? a : '#b2b8b3'};letter-spacing:.3px;`;
  }
  // NOTE: the design also declared a `tabStyle(active)` prototype method here, but the
  // arrow class-field `tabStyle` above shadows it at runtime (instance field wins), so
  // the field is the effective implementation and the method is intentionally omitted.
  fmtBtn(active, extra) {
    const a = this.accent();
    return `width:30px;height:28px;border:none;border-right:1px solid #262c28;cursor:pointer;font-family:inherit;font-size:12px;display:flex;align-items:center;justify-content:center;background:${active ? '#1c2a22' : '#121614'};color:${active ? a : '#b3b9b4'};${extra || ''}`;
  }
  fmtVals(sub) {
    const out = {};
    ['cover', 'index'].forEach(p => {
      const b = sub[p + 'Bold'], i = sub[p + 'Italic'], u = sub[p + 'Under'], al = sub[p + 'Align'] || 'left';
      out[p + 'FmtStyle'] = `font-weight:${b ? '700' : '400'};font-style:${i ? 'italic' : 'normal'};text-decoration:${u ? 'underline' : 'none'};text-align:${al};`;
      out['on' + p + 'Bold'] = () => this.setSub(p + 'Bold', !sub[p + 'Bold']);
      out['on' + p + 'Italic'] = () => this.setSub(p + 'Italic', !sub[p + 'Italic']);
      out['on' + p + 'Under'] = () => this.setSub(p + 'Under', !sub[p + 'Under']);
      out[p + 'BStyle'] = this.fmtBtn(b, 'font-weight:800;');
      out[p + 'IStyle'] = this.fmtBtn(i, 'font-style:italic;');
      out[p + 'UStyle'] = this.fmtBtn(u, 'text-decoration:underline;');
      ['left', 'center', 'right'].forEach(a => {
        out['on' + p + 'Aln' + a] = () => this.setSub(p + 'Align', a);
        out[p + 'Aln' + a + 'Style'] = this.fmtBtn(al === a, '');
      });
    });
    return out;
  }
  segStyleC(active) {
    const a = this.accent();
    return `font-size:10px;font-family:inherit;cursor:pointer;border:none;padding:0 10px;height:30px;background:${active ? '#1c2a22' : '#121614'};color:${active ? a : '#c4cac5'};letter-spacing:.3px;`;
  }
  chkStyle(active) {
    const a = this.accent();
    return `display:flex;align-items:center;gap:9px;width:100%;text-align:left;background:transparent;border:none;padding:7px 2px;cursor:pointer;font-family:inherit;font-size:11.5px;color:${active ? '#e3e8e4' : '#b3b9b4'};`;
  }
  pageDims(sub) {
    const sizes = { Letter: [8.5, 11], Legal: [8.5, 14], A4: [8.27, 11.69], Tabloid: [11, 17] };
    const [pw, ph] = sizes[sub.pageSize] || sizes.Letter;
    const land = sub.orientation === 'Landscape';
    const SCALE = 96;
    return { w: Math.round((land ? ph : pw) * SCALE) + 'px', h: Math.round((land ? pw : ph) * SCALE) + 'px' };
  }
  pagePreview(sub) {
    const sizes = { Letter: [8.5, 11], Legal: [8.5, 14], A4: [8.27, 11.69], Tabloid: [11, 17] };
    const dimLabels = { Letter: '8.5 × 11 in', Legal: '8.5 × 14 in', A4: '210 × 297 mm', Tabloid: '11 × 17 in' };
    const [pw, ph] = sizes[sub.pageSize] || sizes.Letter;
    const land = sub.orientation === 'Landscape';
    const wIn = land ? ph : pw, hIn = land ? pw : ph;
    const m = 92 / Math.max(wIn, hIn);
    const w = Math.round(wIn * m), h = Math.round(hIn * m);
    let dl = dimLabels[sub.pageSize] || '';
    if (land) dl = dl.replace(/^(\S+) × (\S+)( .+)$/, '$2 × $1$3');
    return {
      pgPrevStyle: `width:${w}px;height:${h}px;background:#fff;border:1px solid #cfcfc6;border-radius:2px;box-shadow:0 5px 16px rgba(0,0,0,.4);flex:none;`,
      pgSizeName: sub.pageSize + ' · ' + sub.orientation,
      pgDimLabel: dl,
    };
  }

  data() {
    return [
      { id:'NFS2-3030', code:'NFS2-3030', title:'NFS2-3030 Intelligent Addressable Fire Alarm Control Panel', collection:'Control & Annunciation', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'NFS2-3030', partNo:'NFS2-3030', specSection:'28 31 11', author:'Notifier', date:'2026-05-14', version:'v4.2', size:'2.4 MB', pages:6, tags:['addressable','panel','slc'], abstract:'Intelligent addressable fire alarm control panel supporting up to 3,180 points across multiple SLC loops, with networkable architecture, onboard 80-character LCD, and integral 4-slot chassis.' },
      { id:'ANN-80', code:'ANN-80', title:'ANN-80 Remote LCD Annunciator', collection:'Control & Annunciation', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'ANN-80', partNo:'ANN-80', specSection:'28 31 11', author:'Notifier', date:'2026-04-22', version:'v2.1', size:'1.1 MB', pages:2, tags:['annunciator','lcd','remote'], abstract:'Backlit 80-character remote LCD annunciator providing full panel status and control over the ANN-BUS, surface or flush mountable.' },
      { id:'2WB-B', code:'2WB-B', title:'2WB-B Photoelectric Smoke Detector, 2-Wire', collection:'Initiating Devices', kind:'Datasheet', status:'Approved', manufacturer:'System Sensor', model:'2WB-B', partNo:'2WB-B', specSection:'28 31 23', author:'System Sensor', date:'2026-03-30', version:'v3.0', size:'880 KB', pages:4, tags:['smoke','photoelectric','2-wire'], abstract:'Conventional 2-wire photoelectric smoke detector with integral base, drift compensation, and dual LED status indication.' },
      { id:'5601P', code:'5601P', title:'5601P Fixed-Temperature / Rate-of-Rise Heat Detector', collection:'Initiating Devices', kind:'Datasheet', status:'Approved', manufacturer:'System Sensor', model:'5601P', partNo:'5601P', specSection:'28 31 23', author:'System Sensor', date:'2026-03-18', version:'v1.4', size:'640 KB', pages:2, tags:['heat','ror','135f'], abstract:'Combination fixed-temperature (135°F) and rate-of-rise heat detector for conventional initiating circuits, with low-profile design.' },
      { id:'DNR', code:'DNR', title:'DNR Conventional Duct Smoke Detector Housing', collection:'Initiating Devices', kind:'Datasheet', status:'Review', manufacturer:'System Sensor', model:'DNR', partNo:'DNR', specSection:'28 31 23', author:'System Sensor', date:'2026-05-02', version:'v2.3', size:'1.7 MB', pages:4, tags:['duct','smoke','hvac'], abstract:'Non-relay duct smoke detector housing for HVAC shutdown, accepting plug-in photoelectric sensor with sampling tube up to 12 ft.' },
      { id:'NBG-12LX', code:'NBG-12LX', title:'NBG-12LX Addressable Manual Pull Station', collection:'Initiating Devices', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'NBG-12LX', partNo:'NBG-12LX', specSection:'28 31 23', author:'Notifier', date:'2026-04-10', version:'v1.2', size:'720 KB', pages:2, tags:['pull-station','addressable','dual-action'], abstract:'Dual-action addressable manual pull station with integral addressable module, key-reset, and Americans with Disabilities Act compliant operation.' },
      { id:'P2RL', code:'P2RL', title:'SpectrAlert Advance P2RL Horn/Strobe, Red, Ceiling', collection:'Notification Appliances', kind:'Datasheet', status:'Approved', manufacturer:'System Sensor', model:'P2RL', partNo:'P2RL', specSection:'28 31 43', author:'System Sensor', date:'2026-05-08', version:'v2.5', size:'1.3 MB', pages:3, tags:['horn','strobe','notification'], abstract:'Two-wire horn/strobe with field-selectable candela (15/30/75/95/110/135/185) and three audible tones, low-current draw.' },
      { id:'SRL', code:'SRL', title:'SpectrAlert Advance SRL Strobe, Red, Ceiling', collection:'Notification Appliances', kind:'Datasheet', status:'Approved', manufacturer:'System Sensor', model:'SRL', partNo:'SRL', specSection:'28 31 43', author:'System Sensor', date:'2026-05-08', version:'v2.5', size:'1.0 MB', pages:2, tags:['strobe','notification','visible'], abstract:'Two-wire visible-only strobe with field-selectable candela and synchronizable output via compatible sync module.' },
      { id:'SPSCWL', code:'SPSCWL', title:'L-Series SPSCWL Speaker/Strobe, White, Wall', collection:'Notification Appliances', kind:'Datasheet', status:'Review', manufacturer:'System Sensor', model:'SPSCWL', partNo:'SPSCWL', specSection:'28 31 43', author:'System Sensor', date:'2026-06-01', version:'v1.1', size:'1.4 MB', pages:3, tags:['speaker','strobe','voice'], abstract:'25/70.7 V speaker with selectable wattage taps and field-selectable candela strobe for voice evacuation systems.' },
      { id:'FCPS-24S8', code:'FCPS-24S8', title:'FCPS-24S8 Field Charger / Booster Power Supply, 8A', collection:'Power & Batteries', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'FCPS-24S8', partNo:'FCPS-24S8', specSection:'28 31 11', author:'Notifier', date:'2026-04-28', version:'v3.0', size:'1.1 MB', pages:4, tags:['power-supply','nac','booster'], abstract:'8-amp filtered, regulated remote booster power supply with four Class B / two Class A notification circuits and integral charger.' },
      { id:'PS-12180', code:'PS-12180', title:'PS-12180 Sealed Lead-Acid Battery, 12 V 18 Ah', collection:'Power & Batteries', kind:'Datasheet', status:'Approved', manufacturer:'Power-Sonic', model:'PS-12180', partNo:'PS-12180', specSection:'28 31 11', author:'Power-Sonic', date:'2026-02-25', version:'v9.0', size:'420 KB', pages:2, tags:['battery','sla','12v'], abstract:'Maintenance-free sealed lead-acid standby battery, 12 V 18 Ah, UL-recognized for fire alarm and life-safety standby power.' },
      { id:'FMM-1', code:'FMM-1', title:'FMM-1 Addressable Monitor Module', collection:'Modules & Accessories', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'FMM-1', partNo:'FMM-1', specSection:'28 31 00', author:'Notifier', date:'2026-06-18', version:'v4.5', size:'380 KB', pages:2, tags:['module','monitor','slc'], abstract:'Intelligent addressable monitor module for supervising one normally-open dry-contact initiating device or zone on the SLC.' },
      { id:'FRM-1', code:'FRM-1', title:'FRM-1 Addressable Relay Module', collection:'Modules & Accessories', kind:'Datasheet', status:'Approved', manufacturer:'Notifier', model:'FRM-1', partNo:'FRM-1', specSection:'28 31 00', author:'Notifier', date:'2026-05-21', version:'v2.0', size:'360 KB', pages:2, tags:['module','relay','control'], abstract:'Intelligent addressable relay module providing one Form-C dry-contact output for auxiliary control functions on the SLC.' },
      { id:'ISO-X', code:'ISO-X', title:'ISO-X Addressable Fault Isolator Module', collection:'Modules & Accessories', kind:'Datasheet', status:'Draft', manufacturer:'Notifier', model:'ISO-X', partNo:'ISO-X', specSection:'28 31 00', author:'Notifier', date:'2026-06-12', version:'v1.8', size:'340 KB', pages:2, tags:['module','isolator','slc'], abstract:'Addressable fault isolator module that segments the SLC during wire-to-wire short conditions to preserve loop communication.' },
    ];
  }

  statusColor(s) {
    return ({ Approved:'#3fb950', Review:'#d9a441', Draft:'#5a9fd4', Deprecated:'#c4544f' })[s] || '#8a928e';
  }
  statusChip(s, small) {
    const c = this.statusColor(s);
    const pad = small ? '1.5px 6px' : '2px 7px';
    return `font-size:8.5px;letter-spacing:.6px;font-weight:600;text-transform:uppercase;color:${c};background:${c}1a;border:1px solid ${c}3d;border-radius:4px;padding:${pad};flex:none;`;
  }

  accent() { return this.props.accentColor || '#3fb950'; }

  // ----- SVG icon factory (real vector icons, not font glyphs) -----
  _svg(size, sw, children) {
    return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'inline-block', verticalAlign: '-0.14em', flex: 'none' } }, children);
  }
  ic(name, size) {
    size = size || 15;
    const P = (d, k) => React.createElement('path', { d: d, key: k || d });
    const C = (cx, cy, r, k) => React.createElement('circle', { cx, cy, r, key: k });
    const S = (...c) => this._svg(size, 1.6, c);
    switch (name) {
      case 'close': return S(P('M6 6l12 12'), P('M18 6L6 18'));
      case 'trash': return this._svg(size, 1.6, [P('M4 7h16', 'a'), P('M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2', 'b'), P('M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13', 'c')]);
      case 'edit': return S(P('M12 20h9'), P('M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z'));
      case 'download': return S(P('M12 4v10'), P('M8 12l4 4 4-4'), P('M5 19h14'));
      case 'upload': return S(P('M12 20V10'), P('M8 12l4-4 4 4'), P('M5 5h14'));
      case 'external': return S(P('M14 4h6v6'), P('M20 4L10 14'), P('M19 13v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6'));
      case 'share': return this._svg(size, 1.6, [C(18, 5, 3, 'a'), C(6, 12, 3, 'b'), C(18, 19, 3, 'c'), P('M8.6 13.5l6.8 4', 'd'), P('M15.4 6.5l-6.8 4', 'e')]);
      case 'history': return S(P('M3 3v5h5'), P('M3.5 8a9 9 0 1 0 2.3-3.2L3 8'), P('M12 7.5V12l3.5 2'));
      case 'settings': return S(P('M4 21v-6'), P('M4 11V3'), P('M12 21v-9'), P('M12 8V3'), P('M20 21v-4'), P('M20 13V3'), P('M2 15h4'), P('M10 8h4'), P('M18 17h4'));
      case 'search': return this._svg(size, 1.6, [C(11, 11, 7, 'a'), P('M21 21l-4.3-4.3', 'b')]);
      case 'prev': return S(P('M15 6l-6 6 6 6'));
      case 'next': return S(P('M9 6l6 6-6 6'));
      case 'chevDown': return S(P('M6 9l6 6 6-6'));
      case 'chevUp': return S(P('M6 15l6-6 6 6'));
      case 'chevRight': return S(P('M9 6l6 6-6 6'));
      case 'minus': return S(P('M5 12h14'));
      case 'plus': return S(P('M12 5v14'), P('M5 12h14'));
      case 'check': return S(P('M5 12l5 5L20 6'));
      case 'options': return this._svg(size, 2, [C(12, 5, 1, 'a'), C(12, 12, 1, 'b'), C(12, 19, 1, 'c')].map((e, i) => React.cloneElement(e, { fill: 'currentColor', stroke: 'none' })));
      case 'dot': return this._svg(size, 0, [React.createElement('rect', { x: 7, y: 7, width: 10, height: 10, rx: 2, fill: 'currentColor', stroke: 'none', key: 'r' })]);
      case 'doc': return S(P('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z'), P('M14 3v5h5'));
      case 'layers': return S(P('M12 3l9 5-9 5-9-5 9-5z'), P('M3 13l9 5 9-5'));
      case 'folder': return S(P('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'));
      case 'maximize': return S(P('M8 4H5a1 1 0 0 0-1 1v3'), P('M16 4h3a1 1 0 0 1 1 1v3'), P('M8 20H5a1 1 0 0 1-1-1v-3'), P('M16 20h3a1 1 0 0 0 1-1v-3'));
      case 'user': return this._svg(size, 1.6, [C(12, 8, 4, 'a'), P('M5 20a7 7 0 0 1 14 0', 'b')]);
      case 'signout': return S(P('M16 17l5-5-5-5'), P('M21 12H9'), P('M9 21H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3'));
      case 'cloud': return S(P('M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1-.5 6.96z'));
      case 'server': return this._svg(size, 1.6, [React.createElement('rect', { key: 'a', x: 3, y: 4, width: 18, height: 7, rx: 1.5 }), React.createElement('rect', { key: 'b', x: 3, y: 13, width: 18, height: 7, rx: 1.5 }), P('M7 7.5h.01', 'c'), P('M7 16.5h.01', 'd')]);
      case 'folderOpen': return S(P('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'), P('M3 11h18'));
      case 'alignLeft': return S(P('M4 6h16'), P('M4 12h10'), P('M4 18h13'));
      case 'alignCenter': return S(P('M4 6h16'), P('M7 12h10'), P('M5 18h14'));
      case 'alignRight': return S(P('M4 6h16'), P('M10 12h10'), P('M7 18h13'));
      case 'grip': return this._svg(size, 1.7, [P('M4 9h16', 'a'), P('M4 15h16', 'b')]);
    }
  }
  iStar(on, size) { size = size || 14; return this._svg(size, 1.4, [React.createElement('path', { key: 's', d: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z', fill: on ? 'currentColor' : 'none' })]); }
  iBox(on, size) { size = size || 13; return on ? this._svg(size, 1.6, [React.createElement('rect', { key: 'r', x: 4, y: 4, width: 16, height: 16, rx: 3, fill: 'currentColor', stroke: 'none' }), React.createElement('path', { key: 'c', d: 'M8 12.2l2.6 2.6L16 9', stroke: '#0e110f', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' })]) : this._svg(size, 1.6, [React.createElement('rect', { key: 'r', x: 4, y: 4, width: 16, height: 16, rx: 3 })]); }

  onSearch = (e) => this.setState({ query: e.target.value });
  selectDoc = (id) => this.setState(s => ({ selectedId: id, recent: [id, ...s.recent.filter(r => r !== id)].slice(0, 6) }));
  setCollection = (c) => this.setState(s => ({ collection: s.collection === c ? 'All' : c }));
  toggleIn = (key, val) => this.setState(s => { const a = s[key]; return { [key]: a.includes(val) ? a.filter(x => x !== val) : [...a, val] }; });
  toggleFav = (id, e) => { if (e) e.stopPropagation(); this.setState(s => ({ favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id] })); };
  setSort = (v) => this.setState({ sort: v });
  toggleFavOnly = () => this.setState(s => ({ favOnly: !s.favOnly }));
  clearFilters = () => this.setState({ collection:'All', kinds:[], statuses:[], tags:[], query:'', favOnly:false });

  buildVersions(doc) {
    const notesPool = ['Incorporated review board comments', 'Updated margins per latest analysis', 'Fixed table 4 and appendix C', 'Editorial pass; clarified requirements', 'Baseline release', 'Added traceability matrix'];
    const altAuthors = ['M. Lindgren', 'D. Huang', 'J. Park', 'S. Reyes'];
    const parse = (v) => { const p = String(v || 'v1.0').replace('v', '').split('.').map(Number); return [p[0] || 0, p[1] || 0]; };
    let [maj, min] = parse(doc.version);
    const base0 = new Date(doc.date + 'T00:00:00');
    const base = isNaN(base0.getTime()) ? new Date() : base0;
    const out = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(base.getTime() - i * 41 * 86400000);
      out.push({
        v: 'v' + maj + '.' + min,
        date: d.toISOString().slice(0, 10),
        author: i === 0 ? doc.author : altAuthors[i % altAuthors.length],
        note: i === 0 ? notesPool[1] : notesPool[(i + 2) % notesPool.length],
        current: i === 0,
        last: i === 3,
      });
      if (min > 0) min--; else { maj = Math.max(0, maj - 1); min = 9; }
    }
    out[out.length - 1].v = 'v1.0';
    out[out.length - 1].note = notesPool[4];
    return out;
  }

  renderVals() {
    const s = this.state;
    const accent = this.accent();
    const all = this.allDocs().map(d => { const o = s.docMeta[d.code]; return o ? { ...d, ...o } : d; });
    const favs = s.favorites;
    const q = s.query.trim().toLowerCase();

    // ---- filtering ----
    const passes = (d) => {
      if (s.collection !== 'All' && d.collection !== s.collection) return false;
      if (s.kinds.length && !s.kinds.includes(d.kind)) return false;
      if (s.statuses.length && !s.statuses.includes(d.status)) return false;
      if (s.tags.length && !s.tags.some(t => d.tags.includes(t))) return false;
      if (s.favOnly && !favs.includes(d.id)) return false;
      if (q) {
        const hay = (d.title + ' ' + d.code + ' ' + d.author + ' ' + d.tags.join(' ') + ' ' + d.collection).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    };
    let list = all.filter(passes);

    const sorters = {
      recent: (a, b) => b.date.localeCompare(a.date),
      name: (a, b) => a.title.localeCompare(b.title),
      code: (a, b) => a.code.localeCompare(b.code),
    };
    list = list.slice().sort(sorters[s.sort] || sorters.recent);

    // ---- counts (over full set, respecting search but not the facet itself for nicer UX: simple = full set) ----
    const count = (fn) => all.filter(fn).length;

    // collections
    const colNames = [...new Set(all.map(d => d.collection))].sort();
    const collectionRows = [
      { name: 'All categories', count: all.length, value: 'All', dotColor: accent },
      ...colNames.map(c => ({ name: c, count: count(d => d.collection === c), value: c, dotColor: '#a4aba5' })),
    ].map(c => {
      const active = s.collection === c.value;
      return {
        name: c.name, count: c.count, dotColor: active ? accent : c.dotColor,
        onClick: () => this.setCollection(c.value),
        style: `display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:${active ? '#13211a' : 'transparent'};border:none;width:100%;box-sizing:border-box;border-radius:6px;padding:6px 9px;cursor:pointer;font-family:inherit;font-size:12px;color:${active ? '#e3e8e4' : '#b3b9b4'};letter-spacing:.2px;`,
      };
    });

    // kinds
    const kindNames = [...new Set(all.map(d => d.kind))].sort();
    const kindRows = kindNames.map(k => {
      const active = s.kinds.includes(k);
      return {
        label: k, count: count(d => d.kind === k), box: this.iBox(active),
        boxColor: active ? accent : '#4a514c',
        onClick: () => this.toggleIn('kinds', k),
        style: `display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:transparent;border:none;border-radius:6px;padding:5px 9px;cursor:pointer;font-family:inherit;font-size:11.5px;color:${active ? '#e3e8e4' : '#b3b9b4'};`,
      };
    });

    // statuses
    const statusNames = ['Approved', 'Review', 'Draft', 'Deprecated'];
    const statusRows = statusNames.map(st => {
      const active = s.statuses.includes(st);
      return {
        label: st, count: count(d => d.status === st), color: this.statusColor(st),
        onClick: () => this.toggleIn('statuses', st),
        style: `display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:${active ? '#13211a' : 'transparent'};border:none;border-radius:6px;padding:5px 9px;cursor:pointer;font-family:inherit;font-size:11.5px;color:${active ? '#e3e8e4' : '#b3b9b4'};`,
      };
    });

    // tags
    const tagCounts = {};
    all.forEach(d => d.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    const tagNames = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 12);
    const tagRows = tagNames.map(t => {
      const active = s.tags.includes(t);
      return {
        label: '#' + t,
        onClick: () => this.toggleIn('tags', t),
        style: `font-size:10px;font-family:inherit;cursor:pointer;border-radius:5px;padding:3px 8px;letter-spacing:.2px;background:${active ? accent : '#121614'};color:${active ? '#06210d' : '#8a928e'};border:1px solid ${active ? accent : '#262c28'};font-weight:${active ? 600 : 400};`,
      };
    });

    // sort
    const sortRows = [
      { label: 'recent', value: 'recent' },
      { label: 'name', value: 'name' },
      { label: 'id', value: 'code' },
    ].map(o => {
      const active = s.sort === o.value;
      return { label: o.label, onClick: () => this.setSort(o.value),
        style: `font-size:10.5px;font-family:inherit;cursor:pointer;border:none;padding:5px 11px;background:${active ? '#1c2a22' : '#0e110f'};color:${active ? accent : '#b2b8b3'};letter-spacing:.3px;` };
    });

    // ---- list rows ----
    const showThumbs = this.props.showThumbnails !== false;
    const dense = this.props.density === 'compact';
    const rowPad = dense ? '11px 14px' : '15px 16px';
    const docs = list.map(d => {
      const sel = d.id === s.selectedId;
      const isFav = favs.includes(d.id);
      const dep = d.status === 'Deprecated';
      return {
        code: d.code, title: d.title, kind: d.kind, author: d.author, date: d.date,
        version: d.version, size: d.size, tagChips: d.tags.slice(0, 4).map(t => '#' + t),
        statusLabel: d.status, statusStyle: this.statusChip(d.status, true),
        titleDeco: dep ? 'opacity:.6;' : '',
        favIcon: this.iStar(isFav, 14),
        favStyle: `flex:none;align-self:flex-start;width:26px;height:26px;border:none;background:transparent;cursor:pointer;font-size:14px;font-family:inherit;color:${isFav ? accent : '#3f463f'};`,
        onFav: (e) => this.toggleFav(d.id, e),
        onClick: () => this.selectDoc(d.id),
        onDbl: () => this.openViewer(d.id),
        thumbStyle: `flex:none;width:40px;height:52px;background:${sel ? '#1a2620' : '#15181600'};background:#161a18;border:1px solid ${sel ? accent + '66' : '#262c28'};border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;`,
        rowStyle: `display:flex;gap:13px;align-items:flex-start;padding:${rowPad};border-bottom:1px solid #16191800;border-bottom:1px solid #16191866;border-left:2px solid ${sel ? accent : 'transparent'};background:${sel ? '#11181400' : 'transparent'};background:${sel ? '#101714' : 'transparent'};cursor:pointer;`,
      };
    });

    // ---- selected ----
    const selDoc = all.find(d => d.id === s.selectedId) || all[0];
    const selFav = favs.includes(selDoc.id);
    const selected = {
      code: selDoc.code, title: selDoc.title, kind: selDoc.kind, collection: selDoc.collection,
      author: selDoc.author, date: selDoc.date, version: selDoc.version, size: selDoc.size,
      pages: selDoc.pages, abstract: selDoc.abstract,
      hasPdf: !!selDoc.pdfDataUrl, noPdf: !selDoc.pdfDataUrl,
      previewCanvas: selDoc.pdfDataUrl ? React.createElement(PdfPage, { src: selDoc.pdfDataUrl, pageNumber: 1, width: 360 }) : null,
      fileName: selDoc.code + '_' + selDoc.version + '.pdf',
      statusLabel: selDoc.status, statusStyle: this.statusChip(selDoc.status, false),
      meta: [
        { k: 'Document ID', v: selDoc.code },
        { k: 'Collection', v: selDoc.collection },
        { k: 'Type', v: selDoc.kind },
        { k: 'Owner', v: selDoc.author },
        { k: 'Updated', v: selDoc.date },
        { k: 'Revision', v: selDoc.version },
        { k: 'File size', v: selDoc.size },
        { k: 'Pages', v: selDoc.pages + ' pp' },
      ],
    };
    const versions = this.buildVersions(selDoc).map(v => ({
      v: v.v, date: v.date, author: v.author, note: v.note, current: v.current,
      line: !v.last,
      dot: v.current ? accent : '#39413d',
      vColor: v.current ? '#e3e8e4' : '#b3b9b4',
      rowStyle: 'display:flex;gap:11px;align-items:stretch;',
    }));

    const filtersActive = s.collection !== 'All' || s.kinds.length || s.statuses.length || s.tags.length || s.favOnly || !!q;

    return {
      indexLabel: all.length.toLocaleString() + ' documents indexed',
      iSettings: this.ic('settings'), iClose: this.ic('close'), iTrash: this.ic('trash'), iEdit: this.ic('edit'),
      iDownload: this.ic('download'), iUpload: this.ic('upload'), iExternal: this.ic('external'), iShare: this.ic('share'),
      iHistory: this.ic('history'), iSearch: this.ic('search'), iPrev: this.ic('prev'), iNext: this.ic('next'),
      iMinus: this.ic('minus'), iPlus: this.ic('plus'), iCheck: this.ic('check'), iOptions: this.ic('options'),
      iDot: this.ic('dot', 11), iStarOn: this.iStar(true), iDocBig: this.ic('doc', 30), iLayersBig: this.ic('layers', 34), iFolderBig: this.ic('folder', 30),
      iCaret: this.ic('chevDown', 12), iMax: this.ic('maximize'), iBrand: this.ic('layers', 16), iCloseSm: this.ic('close', 12),
      iAlignLeft: this.ic('alignLeft', 14), iAlignCenter: this.ic('alignCenter', 14), iAlignRight: this.ic('alignRight', 14),
      iUser: this.ic('user'), iSignOut: this.ic('signout', 14),
      account: this.state.account,
      accountInitials: this._initials(this.state.account.name),
      accountAvatarBg: this.state.account.color,
      accountOpen: this.state.accountOpen,
      accountModalOpen: this.state.accountModalOpen,
      onToggleAccount: this.toggleAccount,
      onCloseAccount: this.closeAccount,
      onOpenAccountModal: this.openAccountModal,
      onCloseAccountModal: this.closeAccountModal,
      onOpenSettingsFromAcct: () => this.setState({ accountOpen: false, settingsOpen: true }),
      onSignOut: this.signOut,
      onAccName: e => this.setAccount({ name: e.target.value }),
      onAccEmail: e => this.setAccount({ email: e.target.value }),
      onAccRole: e => this.setAccount({ role: e.target.value }),
      onAccPhone: e => this.setAccount({ phone: e.target.value }),
      onAccTwoFactor: () => this.setAccount({ twoFactor: !this.state.account.twoFactor }),
      accountRole: this.state.account.accountRole,
      onAccRoleType: e => this.setAccount({ accountRole: e.target.value }),
      accountTypeNames: this.state.accountTypes.map(t => t.name),
      accessOptions: ['Full access', 'Create & edit', 'Review & comment', 'Read-only'],
      accountTypeRows: this.state.accountTypes.map(t => ({ name: t.name, access: t.access, onAccess: e => this.setTypeAccess(t.id, e.target.value), onRemove: () => this.removeAccountType(t.id) })),
      accountTypeDraft: this.state.accountTypeDraft,
      onAccountTypeDraft: this.onAccountTypeDraft,
      onAddAccountType: this.addAccountType,
      accTabProfileStyle: this.tabStyle(this.state.accountTab === 'profile'), onAccTabProfile: () => this.setAccountTab('profile'), accProfileDisp: this.state.accountTab === 'profile' ? 'display:flex;flex-direction:column;gap:15px;' : 'display:none;',
      accTabTypesStyle: this.tabStyle(this.state.accountTab === 'types'), onAccTabTypes: () => this.setAccountTab('types'), accTypesDisp: this.state.accountTab === 'types' ? 'display:flex;flex-direction:column;gap:8px;' : 'display:none;',
      showSignOut: this.state.accountTab === 'profile',
      pwOpen: this.state.pwOpen,
      pw: this.state.pw,
      pwError: this.state.pwError,
      pwSubtitle: this.state.pwChanged ? 'Updated just now' : 'Last changed 3 months ago',
      onOpenPw: this.openPw,
      onClosePw: this.closePw,
      onSubmitPw: this.submitPw,
      onPwCurrent: e => this.setPw('current', e.target.value),
      onPwNext: e => this.setPw('next', e.target.value),
      onPwConfirm: e => this.setPw('confirm', e.target.value),
      accTwoFactorStyle: this.togglePill(this.state.account.twoFactor), accTwoFactorLabel: this.state.account.twoFactor ? 'ON' : 'OFF',
      accountColorOptions: ['#3fb950', '#2a6fdb', '#d97757', '#b483e0', '#e0a23f'].map(c => ({ onPick: () => this.setAccount({ color: c }), style: `width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;padding:0;box-sizing:border-box;border:2px solid ${this.state.account.color === c ? '#eef2ef' : 'transparent'};` })),
      query: s.query,
      onSearch: this.onSearch,
      favCount: favs.length,
      favOnlyStyle: `display:flex;align-items:center;justify-content:space-between;width:100%;background:${s.favOnly ? '#13211a' : '#121614'};border:1px solid ${s.favOnly ? accent + '66' : '#232925'};border-radius:7px;padding:9px 11px;cursor:pointer;font-family:inherit;font-size:12px;color:${s.favOnly ? '#e3e8e4' : '#b3b9b4'};letter-spacing:.2px;`,
      onToggleFavOnly: this.toggleFavOnly,
      collectionRows, collectionTotal: all.length,
      kindRows, statusRows, tagRows, sortRows,
      recentDocs: s.recent.map(id => all.find(d => d.id === id)).filter(Boolean).slice(0, 5).map(d => ({
        title: d.title, code: d.code, onClick: () => this.selectDoc(d.id),
      })),
      headerTitle: s.collection === 'All' ? (s.favOnly ? 'Favorites' : 'All documents') : s.collection,
      resultCount: list.length, totalCount: all.length,
      filtersActive: !!filtersActive,
      onClearFilters: this.clearFilters,
      docs, showThumbs,
      hasResults: list.length > 0,
      noResults: list.length === 0,
      selected, selectedTags: selDoc.tags,
      selTagItems: selDoc.tags.map(t => ({ tag: t, onRemove: () => this.removeDocTag(selDoc.code, t) })),
      onSetStatus: this.setMd('status'),
      onSetCollection: this.setMd('collection'),
      onMetaType: this.setMd('kind'),
      onMetaOwner: this.setMd('author'),
      onMetaRev: this.setMd('version'),
      onMetaPart: this.setMd('partNumber'),
      partNumber: this._md(selDoc.code, 'partNumber'),
      mdKind: this._md(selDoc.code, 'kind'),
      mdAuthor: this._md(selDoc.code, 'author'),
      mdVersion: this._md(selDoc.code, 'version'),
      mdDirty: this._mdDirty(selDoc.code),
      collectionValue: this._md(selDoc.code, 'collection'),
      collOptions: this.state.collections,
      collDraft: s.collDraft,
      onCollDraft: this.onCollDraft,
      onAddCollection: this.addCollection,
      editingCollName: this.state.editingColl ? this.state.editingColl.original : null,
      editingCollValue: this.state.editingColl ? this.state.editingColl.value : '',
      onEditCollVal: this.setEditCollVal,
      onSaveEditColl: this.saveEditColl,
      onCancelEditColl: this.cancelEditColl,
      collManagerRows: this.state.collections.map(name => ({ name, editing: this.state.editingColl && this.state.editingColl.original === name, notEditing: !(this.state.editingColl && this.state.editingColl.original === name), onEdit: () => this.startEditColl(name), onDelete: () => this.deleteCollection(name) })),
      typeOptions: this.state.lib.types,
      mfrOptions: [...new Set([this._md(selDoc.code, 'author'), ...this.state.lib.mfrs].filter(Boolean))],
      onSaveDoc: this.onSaveDoc,
      docSaveLabel: this.state.docSaved ? '✓ Saved' : 'Save Changes',
      libDraft: this.state.libDraft,
      onTypeDraft: (e) => this.setLibDraft('types', e), onAddType: () => this.addLibItem('types'),
      onMfrDraft: (e) => this.setLibDraft('mfrs', e), onAddMfr: () => this.addLibItem('mfrs'),
      onTagLibDraft: (e) => this.setLibDraft('tags', e), onAddTagLib: () => this.addLibItem('tags'),
      typeManagerRows: this.state.lib.types.map(name => ({ name, onDelete: () => this.removeLibItem('types', name) })),
      mfrManagerRows: this.state.lib.mfrs.map(name => ({ name, onDelete: () => this.removeLibItem('mfrs', name) })),
      tagManagerRows: this.state.lib.tags.map(name => ({ name, onDelete: () => this.removeLibItem('tags', name) })),
      onAddDocument: this.openDocForm,
      onDeleteDocument: () => this.deleteDoc(selDoc.code),
      docFormOpen: s.docFormOpen,
      docDraft: s.docDraft,
      onCloseDocForm: this.closeDocForm,
      onAddDoc: this.addDoc,
      onDocCode: e => this.setDocDraft('code', e.target.value),
      onDocTitle: e => this.setDocDraft('title', e.target.value),
      onDocMfr: e => this.setDocDraft('manufacturer', e.target.value),
      onDocCollection: e => this.setDocDraft('collection', e.target.value),
      onDocPages: e => this.setDocDraft('pages', e.target.value),
      onDocPDF: this.onDocPDF,
      docPdfName: this.state.docDraft.pdfName || '',
      onDocStatus: e => this.setDocDraft('status', e.target.value),
      onDocTags: e => this.setDocDraft('tags', e.target.value),
      statusValue: this._md(selDoc.code, 'status'),
      newTag: s.newTag,
      onNewTagInput: this.onNewTagInput,
      onNewTagKey: this.onNewTagKey,
      versions, versionCount: String(selDoc.version || 'v1.0').replace('v', '').split('.')[0] * 1 + 8,
      viewerOpen: s.viewerOpen,
      onCloseViewer: this.closeViewer,
      stop: this.stop,
      setViewerRef: this.setViewerRef,
      viewerZoom: s.viewerZoom,
      viewerZoomPct: Math.round(s.viewerZoom * 100) + '%',
      onVZoomIn: this.vZoomIn, onVZoomOut: this.vZoomOut, onVZoomReset: this.vZoomReset,
      vPage: Math.min(s.vPage, selDoc.pages),
      viewerPageCount: selDoc.pages,
      onVPrev: this.vPrev, onVNext: this.vNext, onVGotoInput: this.vGotoInput,
      viewerPages: Array.from({ length: selDoc.pages }, (_, i) => ({ n: i + 1, first: i === 0, notFirst: i !== 0, footer: 'PAGE ' + (i + 1) + ' OF ' + selDoc.pages, hasPdf: !!selDoc.pdfDataUrl, firstNoPdf: i === 0 && !selDoc.pdfDataUrl, notFirstNoPdf: i !== 0 && !selDoc.pdfDataUrl, canvas: selDoc.pdfDataUrl ? React.createElement(PdfPage, { src: selDoc.pdfDataUrl, pageNumber: i + 1, width: 720 }) : null })),
      findOpen: s.findOpen,
      findOpenSub: s.findOpen && s.findScope === 'sub',
      findOpenViewer: s.findOpen && s.findScope === 'viewer',
      findQuery: s.findQuery,
      findStat: s.findCount ? (s.findIdx + ' / ' + s.findCount) : (s.findQuery ? '0 / 0' : ''),
      onFindInput: this.onFindInput, onFindNext: this.findNext, onFindPrev: this.findPrev,
      onOpenFindSub: () => this.openFind('sub'),
      onOpenFindViewer: () => this.openFind('viewer'),
      onCloseFind: this.closeFind,
      viewMode: s.viewMode,
      onSinglePage: () => this.setViewMode('single'),
      onScrollPages: () => this.setViewMode('scroll'),
      singleStyle: this.segStyleC(s.viewMode === 'single'),
      scrollStyle: this.segStyleC(s.viewMode === 'scroll'),
      menuOpen: s.menuOpen,
      onToggleMenu: this.toggleMenu,
      onOpenDesktop: () => this.openDesktop(selDoc),
      onOpen: () => this.openViewer(selDoc.id),
      onShare: this.openShare, onDownload: this.openDownload,
      downloadOpen: this.state.downloadOpen,
      downloadFileName: this.state.downloadLabel || (selDoc.code + '_' + selDoc.version + '.pdf'),
      downloadSize: selDoc.size,
      downloadFormat: this.state.downloadFormat,
      onDownloadFormat: e => this.setState({ downloadFormat: e.target.value }),
      downloadCoverStyle: this.togglePill(this.state.downloadCover), downloadCoverLabel: this.state.downloadCover ? 'ON' : 'OFF',
      onToggleDownloadCover: () => this.setState({ downloadCover: !this.state.downloadCover }),
      downloadBtnLabel: this.state.downloadStarted ? 'Downloaded' : 'Download',
      onCloseDownload: this.closeDownload, onDoDownload: this.doDownload,
      downloadError: this.state.downloadError,
      downloadProtect: this.state.downloadProtect,
      downloadProtectStyle: this.togglePill(this.state.downloadProtect), downloadProtectLabel: this.state.downloadProtect ? 'ON' : 'OFF',
      onToggleDownloadProtect: () => this.setState({ downloadProtect: !this.state.downloadProtect, downloadError: '' }),
      downloadPassword: this.state.downloadPassword,
      onDownloadPassword: e => this.setState({ downloadPassword: e.target.value, downloadError: '' }),
      downloadAllowPrintStyle: this.togglePill(this.state.downloadAllowPrint), downloadAllowPrintLabel: this.state.downloadAllowPrint ? 'ON' : 'OFF',
      onToggleAllowPrint: () => this.setState({ downloadAllowPrint: !this.state.downloadAllowPrint }),
      downloadAllowCopyStyle: this.togglePill(this.state.downloadAllowCopy), downloadAllowCopyLabel: this.state.downloadAllowCopy ? 'ON' : 'OFF',
      onToggleAllowCopy: () => this.setState({ downloadAllowCopy: !this.state.downloadAllowCopy }),
      shareOpen: this.state.shareOpen,
      shareDocLabel: this.state.shareLabel || selDoc.code,
      onShareSubmittal: () => { const ss = this.state.sub; this.openShare((ss.project || 'Submittal') + ' — Rev ' + (ss.revision || '0')); },
      shareIsUser: this.state.shareMode === 'user', shareIsEmail: this.state.shareMode === 'email',
      onShareUser: () => this.setShareMode('user'), onShareEmail: () => this.setShareMode('email'),
      shareUserStyle: `flex:1;height:30px;border:none;border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;letter-spacing:.3px;cursor:pointer;background:${this.state.shareMode === 'user' ? '#1c2a22' : 'transparent'};color:${this.state.shareMode === 'user' ? '#5fd06f' : '#9ea69f'};`,
      shareEmailStyle: `flex:1;height:30px;border:none;border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;letter-spacing:.3px;cursor:pointer;background:${this.state.shareMode === 'email' ? '#1c2a22' : 'transparent'};color:${this.state.shareMode === 'email' ? '#5fd06f' : '#9ea69f'};`,
      shareRecipient: this.state.shareRecipient,
      onShareRecipient: e => this.setShareField('shareRecipient', e.target.value),
      shareUsers: ['Joe Philbrook', 'Sara Lin', 'David Huang', 'Mia Reyes', 'Grzegorz Pokora'],
      sharePermission: this.state.sharePermission,
      onSharePermission: e => this.setShareField('sharePermission', e.target.value),
      shareMsg: this.state.shareMsg, onShareMsg: e => this.setShareField('shareMsg', e.target.value),
      shareError: this.state.shareError,
      shareSendLabel: this.state.shareSent ? 'Sent' : 'Send',
      onCloseShare: this.closeShare, onSubmitShare: this.submitShare,
      onFavSelected: () => this.toggleFav(selDoc.id),
      selFavIcon: this.iStar(selFav, 16),
      selFavStyle: `width:30px;height:30px;border:1px solid ${selFav ? accent + '66' : '#262c28'};background:${selFav ? '#13211a' : '#121614'};border-radius:6px;color:${selFav ? accent : '#b3b9b4'};cursor:pointer;font-size:14px;font-family:inherit;`,
      ...this.buildSubmittal(),
    };
  }

  render() {
    return renderTemplate(TEMPLATE, { ...this.props, ...this.renderVals() });
  }
}

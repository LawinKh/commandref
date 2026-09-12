/* ------------------------------------------------------------------
   assets/app.js — shared by index, the four command pages and 404.

   Two modes, read from <body data-mode>:
     "page"  one os + tool set, grouped under sticky category headings
     "all"   index.html and 404.html: search across all four sets

   No dependencies. Works from file:// with no server.
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var ALL = window.COMMANDS || [];
  var ORDER = window.CATEGORY_ORDER || { git: [], bash: [] };

  var body = document.body;
  var MODE = body.getAttribute('data-mode') || 'all';
  var OS = body.getAttribute('data-os') || '';
  var TOOL = body.getAttribute('data-tool') || '';

  var header = document.querySelector('.hdr');
  var search = document.getElementById('search');
  var countEl = document.getElementById('count');
  var liveEl = document.getElementById('live');
  var emptyEl = document.getElementById('empty');
  var listEl = document.getElementById('list');
  var railEl = document.getElementById('rail');
  var resultsEl = document.getElementById('results');

  var OS_LABEL = { mac: 'macOS', windows: 'Windows' };
  var TOOL_LABEL = { git: 'Git', bash: 'Bash' };

  /* --- small helpers ---------------------------------------------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null) { n.textContent = text; }
    return n;
  }

  /* Walk up looking for a class. Stands in for closest() on old engines. */
  function up(node, cls) {
    while (node && node !== document) {
      if (node.classList && node.classList.contains(cls)) { return node; }
      node = node.parentNode;
    }
    return null;
  }

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function haystack(c) {
    var flags = '';
    if (c.flags) {
      for (var i = 0; i < c.flags.length; i++) {
        flags += ' ' + c.flags[i].flag + ' ' + c.flags[i].note;
      }
    }
    return (c.command + ' ' + c.purpose + ' ' + c.category +
            ' ' + (c.shell || '') + flags).toLowerCase();
  }

  function pageFor(c) {
    return c.tool + '-' + c.os + '.html';
  }

  /* --- clipboard ---------------------------------------------------- */

  function announce(msg) {
    if (!liveEl) { return; }
    liveEl.textContent = '';
    window.setTimeout(function () { liveEl.textContent = msg; }, 30);
  }

  function flash(btn, label, cls) {
    if (btn._timer) { window.clearTimeout(btn._timer); }
    if (!btn._label) { btn._label = btn.textContent; }
    btn.textContent = label;
    btn.classList.remove('done', 'fail');
    if (cls) { btn.classList.add(cls); }
    btn._timer = window.setTimeout(function () {
      btn.textContent = btn._label;
      btn.classList.remove('done', 'fail');
    }, 1500);
  }

  /* Fallback path: used by older browsers and anywhere the async
     Clipboard API is unavailable or refuses. */
  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { ta.setSelectionRange(0, text.length); } catch (e) { /* ignore */ }
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  function copyText(raw, btn) {
    /* Strip any prompt symbol and trailing whitespace, so what lands on
       the clipboard pastes straight into a terminal. */
    var text = String(raw)
      .replace(/^\s*(?:PS\s*>|\$|>|#)\s*/, '')
      .replace(/\s+$/, '');

    function good() {
      flash(btn, 'Copied', 'done');
      announce('Copied');
    }
    function bad() {
      flash(btn, 'Press Ctrl+C', 'fail');
      announce('Copy failed. Press Control C to copy.');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(good, function () {
        if (legacyCopy(text)) { good(); } else { bad(); }
      });
    } else if (legacyCopy(text)) {
      good();
    } else {
      bad();
    }
  }

  /* --- card construction -------------------------------------------- */

  function card(c) {
    var art = el('article', 'cmd');
    art.id = c.id;
    art.setAttribute('data-hay', haystack(c));

    var main = el('button', 'cmd-main');
    main.type = 'button';

    var line = el('div', 'cmd-line');
    line.appendChild(el('code', 'cmd-text', c.command));

    if (c.destructive) {
      var m = el('span', 'mark', 'destructive');
      m.title = 'Loses work or rewrites history';
      line.appendChild(m);
    }
    /* The Windows pages state which shell each command assumes. */
    if (c.os === 'windows' && c.shell) {
      line.appendChild(el('span', 'shell', c.shell));
    }

    main.appendChild(line);
    main.appendChild(el('span', 'cmd-purpose', c.purpose));

    var copy = el('button', 'copy', 'Copy');
    copy.type = 'button';
    copy.setAttribute('data-copy', c.command);
    copy.setAttribute('aria-label', 'Copy ' + c.command);

    var det = el('div', 'cmd-detail');
    det.id = c.id + '-d';
    det.hidden = true;

    if (c.example) {
      det.appendChild(el('p', 'detail-label', 'Example'));
      var ex = el('div', 'example');
      var pre = el('pre');
      pre.appendChild(el('code', null, c.example));
      var exCopy = el('button', 'copy', 'Copy');
      exCopy.type = 'button';
      exCopy.setAttribute('data-copy', c.example);
      exCopy.setAttribute('aria-label', 'Copy example ' + c.example);
      ex.appendChild(pre);
      ex.appendChild(exCopy);
      det.appendChild(ex);
    }

    if (c.flags && c.flags.length) {
      det.appendChild(el('p', 'detail-label', 'Common flags'));
      var dl = el('dl', 'flags');
      for (var i = 0; i < c.flags.length; i++) {
        dl.appendChild(el('dt', null, c.flags[i].flag));
        dl.appendChild(el('dd', null, c.flags[i].note));
      }
      det.appendChild(dl);
    }

    art.appendChild(main);
    art.appendChild(copy);

    if (det.childNodes.length) {
      main.setAttribute('aria-expanded', 'false');
      main.setAttribute('aria-controls', det.id);
      art.appendChild(det);
    } else {
      art.classList.add('flat');
    }
    return art;
  }

  /* --- expand / collapse, one card open at a time --------------------- */

  function closeAll() {
    var open = listEl ? listEl.querySelectorAll('.cmd.open') : [];
    for (var i = 0; i < open.length; i++) {
      open[i].classList.remove('open');
      var d = open[i].querySelector('.cmd-detail');
      var m = open[i].querySelector('.cmd-main');
      if (d) { d.hidden = true; }
      if (m) { m.setAttribute('aria-expanded', 'false'); }
    }
  }

  function toggle(art) {
    var det = art.querySelector('.cmd-detail');
    if (!det) { return; }
    var wasOpen = art.classList.contains('open');
    closeAll();
    if (!wasOpen) {
      art.classList.add('open');
      det.hidden = false;
      var m = art.querySelector('.cmd-main');
      if (m) { m.setAttribute('aria-expanded', 'true'); }
    }
  }

  /* --- build: page mode ------------------------------------------------ */

  function buildPage() {
    var set = [];
    for (var i = 0; i < ALL.length; i++) {
      if (ALL[i].os === OS && ALL[i].tool === TOOL) { set.push(ALL[i]); }
    }
    var cats = ORDER[TOOL] || [];

    for (var c = 0; c < cats.length; c++) {
      var name = cats[c];
      var items = [];
      for (var j = 0; j < set.length; j++) {
        if (set[j].category === name) { items.push(set[j]); }
      }
      if (!items.length) { continue; }

      var id = 'c-' + slug(name);
      var sec = el('section', 'cat');
      sec.id = id;

      var h = el('h2', 'cat-h');
      h.appendChild(el('span', null, name));
      h.appendChild(el('span', 'cat-n', String(items.length)));
      sec.appendChild(h);

      var wrap = el('div', 'cmds');
      for (var k = 0; k < items.length; k++) { wrap.appendChild(card(items[k])); }
      sec.appendChild(wrap);
      listEl.appendChild(sec);

      if (railEl) {
        var a = el('a', null, name);
        a.href = '#' + id;
        a.setAttribute('data-for', id);
        railEl.appendChild(a);
      }
    }
  }

  function filterPage(q) {
    q = q.trim().toLowerCase();
    var total = 0;
    var secs = listEl.querySelectorAll('.cat');

    for (var i = 0; i < secs.length; i++) {
      var cards = secs[i].querySelectorAll('.cmd');
      var shown = 0;
      for (var j = 0; j < cards.length; j++) {
        var hit = !q || cards[j].getAttribute('data-hay').indexOf(q) !== -1;
        cards[j].hidden = !hit;
        if (hit) { shown++; }
      }
      secs[i].hidden = shown === 0;
      var n = secs[i].querySelector('.cat-n');
      if (n) { n.textContent = String(shown); }
      total += shown;

      if (railEl) {
        var link = railEl.querySelector('[data-for="' + secs[i].id + '"]');
        if (link) { link.hidden = shown === 0; }
      }
    }

    countEl.textContent = q
      ? total + (total === 1 ? ' match' : ' matches')
      : total + ' commands';
    emptyEl.hidden = total !== 0;
  }

  /* --- build: all mode (index.html and 404.html) ------------------------ */

  var INDEX = [];
  function buildIndex() {
    for (var i = 0; i < ALL.length; i++) {
      INDEX.push({ c: ALL[i], h: haystack(ALL[i]) });
    }
  }

  function filterAll(q) {
    q = q.trim().toLowerCase();
    while (resultsEl.firstChild) { resultsEl.removeChild(resultsEl.firstChild); }

    if (!q) {
      resultsEl.hidden = true;
      emptyEl.hidden = true;
      countEl.textContent = ALL.length + ' commands';
      return;
    }

    var hits = [];
    for (var i = 0; i < INDEX.length; i++) {
      if (INDEX[i].h.indexOf(q) !== -1) { hits.push(INDEX[i].c); }
    }

    for (var j = 0; j < hits.length; j++) {
      var c = hits[j];
      var a = el('a', 'result');
      a.href = pageFor(c) + '#' + c.id;
      a.appendChild(el('code', 'cmd-text', c.command));
      if (c.destructive) {
        var m = el('span', 'mark', 'destructive');
        m.title = 'Loses work or rewrites history';
        a.appendChild(m);
      }
      a.appendChild(el('span', 'tag',
        TOOL_LABEL[c.tool] + ' · ' + OS_LABEL[c.os]));
      a.appendChild(el('span', 'cmd-purpose', c.purpose));
      resultsEl.appendChild(a);
    }

    resultsEl.hidden = hits.length === 0;
    emptyEl.hidden = hits.length !== 0;
    countEl.textContent = hits.length + (hits.length === 1 ? ' match' : ' matches');
  }

  /* --- index tiles: live counts and the remembered OS -------------------- */

  function decorateTiles() {
    var tiles = document.querySelectorAll('.tile');
    if (!tiles.length) { return; }

    var last = null;
    try { last = window.localStorage.getItem('cmdref-os'); } catch (e) { /* ignore */ }

    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var os = t.getAttribute('data-os');
      var tool = t.getAttribute('data-tool');
      var n = 0;
      for (var j = 0; j < ALL.length; j++) {
        if (ALL[j].os === os && ALL[j].tool === tool) { n++; }
      }
      var meta = t.querySelector('.tile-meta');
      if (meta) { meta.textContent = n + ' commands'; }
      if (last && os === last) { t.classList.add('last'); }
    }
  }

  /* --- header height, sticky offsets ------------------------------------ */

  function measureHeader() {
    if (!header) { return; }
    document.documentElement.style.setProperty('--hdr', header.offsetHeight + 'px');
  }

  /* --- scroll spy for the left rail -------------------------------------- */

  function startSpy() {
    if (!railEl || !listEl) { return; }
    var links = railEl.querySelectorAll('a');
    if (!links.length) { return; }
    var secs = listEl.querySelectorAll('.cat');
    var ticking = false;

    function update() {
      var hdr = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--hdr')
      ) || 0;
      var current = null;
      for (var i = 0; i < secs.length; i++) {
        if (secs[i].hidden) { continue; }
        if (current === null) { current = secs[i].id; }
        if (secs[i].getBoundingClientRect().top - hdr <= 2) { current = secs[i].id; }
      }
      for (var j = 0; j < links.length; j++) {
        var on = links[j].getAttribute('data-for') === current;
        if (on) { links[j].classList.add('on'); } else { links[j].classList.remove('on'); }
      }
    }

    window.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
    return update;
  }

  /* --- open whatever the hash points at ----------------------------------- */

  function openFromHash() {
    if (!listEl || !location.hash) { return; }
    var id = decodeURIComponent(location.hash.slice(1));
    var art = document.getElementById(id);
    if (!art || !art.classList.contains('cmd')) { return; }

    art.hidden = false;
    var sec = up(art, 'cat');
    if (sec) { sec.hidden = false; }
    toggle(art);
    art.classList.add('target');
    art.scrollIntoView(true);
  }

  /* --- wiring -------------------------------------------------------------- */

  function run() {
    if (MODE === 'page') { filterPage(search.value); }
    else { filterAll(search.value); }
  }

  function isField(node) {
    if (!node || !node.tagName) { return false; }
    var t = node.tagName.toLowerCase();
    return t === 'input' || t === 'textarea' || t === 'select' || node.isContentEditable;
  }

  /* Remember the OS so index.html can highlight it on return. */
  if (OS) {
    try { window.localStorage.setItem('cmdref-os', OS); } catch (e) { /* ignore */ }
  }

  if (MODE === 'page' && listEl) {
    buildPage();
  } else {
    buildIndex();
    decorateTiles();
  }

  run();
  measureHeader();
  window.addEventListener('resize', measureHeader);
  window.addEventListener('load', measureHeader);

  var spyUpdate = MODE === 'page' ? startSpy() : null;

  if (search) {
    search.addEventListener('input', function () {
      run();
      if (spyUpdate) { spyUpdate(); }
    });
  }

  /* Card clicks: anywhere except the copy button or the open detail. */
  if (listEl) {
    listEl.addEventListener('click', function (e) {
      var btn = up(e.target, 'copy');
      if (btn) {
        e.stopPropagation();
        e.preventDefault();
        copyText(btn.getAttribute('data-copy'), btn);
        return;
      }
      if (up(e.target, 'cmd-detail')) { return; }
      var art = up(e.target, 'cmd');
      if (art) { toggle(art); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!search) { return; }
    if (e.key === '/' && !isField(e.target)) {
      e.preventDefault();
      search.focus();
      search.select();
    } else if (e.key === 'Escape' || e.key === 'Esc') {
      if (search.value !== '') {
        search.value = '';
        run();
        if (spyUpdate) { spyUpdate(); }
      }
    }
  });

  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

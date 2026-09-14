/* ============================================================
   GLOBAL NAVBAR — single source of truth.
   This script INJECTS the navbar markup and owns all of its
   behaviour (theme toggle, mobile menu, Work dropdown). Pages
   only need to load nav.css + nav.js — no navbar HTML lives in
   any page. Styling is in nav.css.
   ============================================================ */
(function () {
  'use strict';

  // ---- Theme (single owner; 'theme' key shared across all pages) ----
  var root = document.documentElement;
  function getTheme() { return localStorage.getItem('theme') || 'dark'; }
  function setTheme(t) { root.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
  setTheme(getTheme());

  // ---- Page-aware links (anchors resolve to index from article pages) ----
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var onArticle = (page === 'bookstore-ppb.html' || page === 'direct-marketing-consent.html' || page === 'genie-trust-wrapper.html' || page === 'devlog.html');
  var home = onArticle ? 'index.html' : '';

  var caret  = '<svg class="caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var mCaret = '<svg class="caret" width="13" height="8" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var html =
    '<header class="header">' +
      '<nav class="nav">' +
        '<div class="nav-left">' +
          '<button class="theme-toggle" aria-label="Toggle theme"><span class="theme-icon"></span></button>' +
          '<a href="index.html" class="brand-link"><span class="brand-text">G.Thunberg</span></a>' +
        '</div>' +
        '<div class="nav-menu">' +
          '<div class="nav-item has-dropdown">' +
            '<a href="' + home + '#work" class="nav-link">Work ' + caret + '</a>' +
            '<div class="dropdown"><div class="dropdown-inner">' +
              '<a class="dropdown-link" href="bookstore-ppb.html">Introducing a book store to Storytel</a>' +
              '<a class="dropdown-link" href="direct-marketing-consent.html">Improving opt-in rates</a>' +
              '<span class="dropdown-link is-soon">Reimagining Content Ingestion</span>' +
              '<span class="dropdown-link is-soon">Redesigning the web signup flow</span>' +
              '<span class="dropdown-link is-soon">Genie — personal story companion</span>' +
            '</div></div>' +
          '</div>' +
          '<a href="devlog.html" class="nav-link">Devlog</a>' +
          '<a href="' + home + '#about" class="nav-link">About</a>' +
          '<a href="' + home + '#contact" class="nav-link">Contact</a>' +
        '</div>' +
        '<button class="hamburger-menu" aria-label="Open menu"><span class="hamburger-line"></span><span class="hamburger-line"></span></button>' +
      '</nav>' +
      '<div class="mobile-menu-overlay">' +
        '<button class="mobile-menu-close" aria-label="Close menu"><span class="close-line"></span><span class="close-line"></span></button>' +
        '<div class="mobile-menu-content"><div class="mobile-nav-links">' +
          '<div class="m-nav-item has-dropdown">' +
            '<button class="mobile-nav-toggle work-toggle" type="button">Work ' + mCaret + '</button>' +
            '<div class="m-dropdown">' +
              '<a class="mobile-nav-link m-sub" href="bookstore-ppb.html">Introducing a book store to Storytel</a>' +
              '<a class="mobile-nav-link m-sub" href="direct-marketing-consent.html">Improving opt-in rates</a>' +
              '<span class="m-sub is-soon">Reimagining Content Ingestion</span>' +
              '<span class="m-sub is-soon">Redesigning the web signup flow</span>' +
              '<span class="m-sub is-soon">Genie — personal story companion</span>' +
            '</div>' +
          '</div>' +
          '<a href="devlog.html" class="mobile-nav-link">Devlog</a>' +
          '<a href="' + home + '#about" class="mobile-nav-link">About</a>' +
          '<a href="' + home + '#contact" class="mobile-nav-link">Contact</a>' +
        '</div></div>' +
      '</div>' +
    '</header>';

  function init() {
    // Inject — into #site-nav if present, otherwise at the top of <body>
    var mount = document.getElementById('site-nav');
    if (mount) {
      mount.innerHTML = html;
    } else {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      document.body.insertBefore(tmp.firstChild, document.body.firstChild);
    }

    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.addEventListener('click', function () { setTheme(getTheme() === 'light' ? 'dark' : 'light'); });
    });

    // ── Light-switch pull cord ────────────────────────────────────────
    // A verlet rope hanging off the theme dot. Gravity points wherever the
    // device says down is, so tilting the phone swings the chain. Pull it
    // past a threshold and it throws the switch.
    (function () {
      var toggle = document.querySelector('.theme-toggle');
      if (!toggle) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var SEGMENTS = 13, SEG_LEN = 7, GRAVITY = 1400, DAMP = 0.94, ITER = 4;
      var PULL_TO_SWITCH = 30;            // px past rest before the switch throws
      var ROPE_LEN = SEGMENTS * SEG_LEN;

      var NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'pull-cord');
      svg.setAttribute('aria-hidden', 'true');
      var line = document.createElementNS(NS, 'path');
      line.setAttribute('class', 'cord-line');
      var handle = document.createElementNS(NS, 'circle');
      handle.setAttribute('class', 'cord-handle');
      handle.setAttribute('r', '5');
      var hit = document.createElementNS(NS, 'circle');
      hit.setAttribute('class', 'cord-hit');
      hit.setAttribute('r', '18');
      svg.appendChild(line);
      svg.appendChild(handle);
      svg.appendChild(hit);
      document.body.appendChild(svg);

      var PAD = 60;                        // room either side for the swing
      var anchor = { x: 0, y: 0 };         // viewport coords of the bulb
      var origin = { x: 0, y: 0 };         // svg's top-left in viewport coords

      function measure() {
        var r = toggle.getBoundingClientRect();
        if (!r.width) return false;
        anchor.x = r.left + r.width / 2;
        anchor.y = r.top + r.height / 2;
        origin.x = anchor.x - PAD;
        origin.y = anchor.y;
        svg.style.transform = 'translate(' + origin.x + 'px,' + origin.y + 'px)';
        svg.setAttribute('width', PAD * 2);
        svg.setAttribute('height', ROPE_LEN + PAD * 2);
        return true;
      }

      var pts = [];
      for (var i = 0; i < SEGMENTS; i++) pts.push({ x: 0, y: i * SEG_LEN, px: 0, py: i * SEG_LEN });
      function reset() {
        for (var i = 0; i < SEGMENTS; i++) {
          pts[i].x = PAD; pts[i].y = i * SEG_LEN;
          pts[i].px = PAD; pts[i].py = i * SEG_LEN;
        }
      }
      reset();

      // Gravity direction. Straight down until the device tells us otherwise.
      var gx = 0, gy = 1, tiltMovedAt = 0;
      function onTilt(e) {
        if (e.gamma == null) return;
        var g = Math.max(-90, Math.min(90, e.gamma)) * Math.PI / 180;  // left/right tilt
        var b = Math.max(-90, Math.min(90, e.beta  || 0)) * Math.PI / 180;
        var nx = Math.sin(g);
        var ny = Math.max(0.15, Math.cos(g) * Math.cos(b));            // never hang upward
        var m = Math.hypot(nx, ny) || 1;
        nx /= m; ny /= m;
        // Only count as movement if the device actually turned. A phone lying
        // still still fires this event constantly; reacting to every one would
        // keep the rope — and the CPU — awake forever.
        if (Math.abs(nx - gx) + Math.abs(ny - gy) > 0.01) { tiltMovedAt = Date.now(); wake(); }
        gx = nx; gy = ny;
      }
      window.addEventListener('deviceorientation', onTilt, true);

      // iOS needs a gesture before it will report orientation at all.
      var askedTilt = false;
      function askForTilt() {
        if (askedTilt) return;
        askedTilt = true;
        var D = window.DeviceOrientationEvent;
        if (D && typeof D.requestPermission === 'function') {
          D.requestPermission().then(function (state) {
            if (state === 'granted') window.addEventListener('deviceorientation', onTilt, true);
          }).catch(function () {});
        }
      }

      // Scrolling nudges the chain, so it has life on a desktop too.
      var lastScroll = window.scrollY, sleeping = false;
      window.addEventListener('scroll', function () {
        var dy = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        if (!dy) return;
        var kick = Math.max(-6, Math.min(6, dy * 0.25));
        for (var i = 1; i < SEGMENTS; i++) pts[i].py += kick * (i / SEGMENTS);
        wake();
      }, { passive: true });

      var dragging = false, pointerId = null, pull = 0;
      hit.addEventListener('pointerdown', function (e) {
        dragging = true; pointerId = e.pointerId; pull = 0;
        svg.classList.add('is-dragging');
        hit.setPointerCapture(e.pointerId);
        askForTilt();
        wake();
        e.preventDefault();
      });
      hit.addEventListener('pointermove', function (e) {
        if (!dragging || e.pointerId !== pointerId) return;
        var last = pts[SEGMENTS - 1];
        last.x = e.clientX - origin.x;
        last.y = e.clientY - origin.y;
        last.px = last.x; last.py = last.y;      // no inertia while held
        pull = Math.max(pull, last.y - ROPE_LEN);
        wake();
      });
      function endDrag() {
        if (!dragging) return;
        dragging = false;
        svg.classList.remove('is-dragging');
        if (pull > PULL_TO_SWITCH) {
          setTheme(getTheme() === 'light' ? 'dark' : 'light');
          toggle.classList.add('is-pulled');
          setTimeout(function () { toggle.classList.remove('is-pulled'); }, 220);
          // snap back up, so the chain recoils like a real switch
          var last = pts[SEGMENTS - 1];
          last.py = last.y + 26;
        }
        pull = 0;
        wake();
      }
      hit.addEventListener('pointerup', endDrag);
      hit.addEventListener('pointercancel', endDrag);

      function step(dt) {
        var dt2 = dt * dt;
        for (var i = 1; i < SEGMENTS; i++) {          // point 0 is pinned to the bulb
          var p = pts[i];
          if (dragging && i === SEGMENTS - 1) continue;
          var vx = (p.x - p.px) * DAMP, vy = (p.y - p.py) * DAMP;
          p.px = p.x; p.py = p.y;
          p.x += vx + gx * GRAVITY * dt2;
          p.y += vy + gy * GRAVITY * dt2;
        }
        for (var k = 0; k < ITER; k++) {
          pts[0].x = PAD; pts[0].y = 0;
          for (var j = 0; j < SEGMENTS - 1; j++) {
            var a = pts[j], b = pts[j + 1];
            var dx = b.x - a.x, dy = b.y - a.y;
            var d = Math.hypot(dx, dy) || 0.0001;
            var diff = (d - SEG_LEN) / d * 0.5;
            var ox = dx * diff, oy = dy * diff;
            if (j !== 0) { a.x += ox; a.y += oy; }
            if (!(dragging && j + 1 === SEGMENTS - 1)) { b.x -= ox; b.y -= oy; }
          }
        }
      }

      function draw() {
        var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
        for (var i = 1; i < SEGMENTS; i++) d += ' L' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1);
        line.setAttribute('d', d);
        var last = pts[SEGMENTS - 1];
        handle.setAttribute('cx', last.x.toFixed(1));
        handle.setAttribute('cy', last.y.toFixed(1));
        hit.setAttribute('cx', last.x.toFixed(1));
        hit.setAttribute('cy', last.y.toFixed(1));
      }

      // Sleep when it has settled; any input or tilt wakes it back up.
      var idle = 0;
      function wake() { idle = 0; if (sleeping) { sleeping = false; last = Date.now(); requestAnimationFrame(loop); } }

      var acc = 0, last = Date.now(), FIXED = 1 / 60;
      function loop() {
        if (sleeping) return;
        requestAnimationFrame(loop);
        var now = Date.now();
        acc += Math.min((now - last) / 1000, 0.1);
        last = now;
        var moved = 0;
        while (acc >= FIXED) { step(FIXED); acc -= FIXED; }
        for (var i = 1; i < SEGMENTS; i++) moved += Math.abs(pts[i].x - pts[i].px) + Math.abs(pts[i].y - pts[i].py);
        draw();
        if (!dragging && Date.now() - tiltMovedAt > 600 && moved < 0.05) {
          if (++idle > 40) sleeping = true;
        } else idle = 0;
      }

      if (measure()) { reset(); requestAnimationFrame(loop); }
      window.addEventListener('resize', function () { measure(); wake(); }, { passive: true });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
    })();

    // Mobile menu open/close
    var ham = document.querySelector('.hamburger-menu');
    var ov  = document.querySelector('.mobile-menu-overlay');
    var cl  = document.querySelector('.mobile-menu-close');
    function openMenu()  { if (ham) ham.classList.add('active');    if (ov) ov.classList.add('active');    document.body.style.overflow = 'hidden'; }
    function closeMenu() { if (ham) ham.classList.remove('active'); if (ov) ov.classList.remove('active'); document.body.style.overflow = ''; }
    if (ham) ham.addEventListener('click', openMenu);
    if (cl)  cl.addEventListener('click', closeMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(function (l) { l.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    // Work dropdown — mobile expand/collapse (desktop is pure CSS :hover)
    document.querySelectorAll('.work-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var it = btn.closest('.m-nav-item');
        if (it) it.classList.toggle('open');
      });
    });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();

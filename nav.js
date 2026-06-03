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
  var onArticle = (page === 'bookstore-ppb.html' || page === 'direct-marketing-consent.html');
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
            '</div></div>' +
          '</div>' +
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
            '</div>' +
          '</div>' +
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

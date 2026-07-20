/* ============================================================
   MORPHO — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
   * 1. Auto-update copyright year
   * ---------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------
   * 2. Navbar mobile menu
   * ---------------------------------------------------------- */
  var navbar = document.querySelector('[data-section="navbar"]');
  if (navbar) {
    var hamburger = navbar.querySelector('[data-hamburger]');
    var overlay   = navbar.querySelector('[data-menu-overlay]');
    var menuItems = navbar.querySelectorAll('[data-menu-item]');
    var topLine   = navbar.querySelector('[data-hamburger-top]');
    var botLine   = navbar.querySelector('[data-hamburger-bot]');

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      overlay.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      menuItems.forEach(function (item) {
        item.style.transform = 'translateY(0%)';
      });
      if (topLine) { topLine.style.transform = 'rotate(45deg)'; topLine.style.width = '18px'; }
      if (botLine) { botLine.style.transform = 'rotate(-45deg)'; botLine.style.width = '18px'; }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      overlay.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
      menuItems.forEach(function (item, i) {
        item.style.transform = 'translateY(100%)';
      });
      if (topLine) { topLine.style.transform = ''; topLine.style.width = ''; }
      if (botLine) { botLine.style.transform = ''; botLine.style.width = ''; }
      document.body.style.overflow = '';
    }

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        isOpen ? closeMenu() : openMenu();
      });
    }

    /* Close menu when a menu link is clicked */
    menuItems.forEach(function (item) {
      item.addEventListener('click', function () {
        if (isOpen) closeMenu();
      });
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  /* ----------------------------------------------------------
   * 3. Smooth scroll for anchor links
   * ---------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    /* Handle both pure anchors (#section) and page+anchor (page.html#section) */
    if (!href) return;

    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var pagePart = href.slice(0, hashIndex);
    var hashPart = href.slice(hashIndex);

    /* Only handle anchors that point to the current page */
    var isSamePage =
      pagePart === '' ||
      pagePart === window.location.pathname ||
      pagePart === window.location.pathname.replace(/\/$/, '/index.html');

    if (!isSamePage) return;

    link.addEventListener('click', function (e) {
      var target = document.querySelector(hashPart);
      if (!target) return;
      e.preventDefault();
      /* Close mobile menu if open */
      var nav = document.querySelector('[data-section="navbar"]');
      if (nav && nav.querySelector('[data-menu-overlay]')) {
        var ov = nav.querySelector('[data-menu-overlay]');
        if (ov.style.clipPath !== 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)') {
          ov.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
          document.body.style.overflow = '';
        }
      }
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });

  /* ----------------------------------------------------------
   * 4. FAQ accordion
   * ---------------------------------------------------------- */
  document.querySelectorAll('[data-faq-item]').forEach(function (item) {
    var header  = item.querySelector('[data-faq-header]');
    var content = item.querySelector('[data-faq-content]');
    var icon    = item.querySelector('[data-faq-icon]');

    if (!header || !content) return;

    /* Initial state */
    content.style.maxHeight = '0';
    content.style.overflow  = 'hidden';
    content.style.transition = 'max-height 0.35s ease';

    header.addEventListener('click', function () {
      var isExpanded = item.getAttribute('data-open') === 'true';

      /* Collapse all siblings first */
      var allItems = document.querySelectorAll('[data-faq-item]');
      allItems.forEach(function (sibling) {
        if (sibling !== item) {
          sibling.removeAttribute('data-open');
          var sc = sibling.querySelector('[data-faq-content]');
          var si = sibling.querySelector('[data-faq-icon]');
          if (sc) sc.style.maxHeight = '0';
          if (si) si.style.transform = 'rotate(0deg)';
        }
      });

      if (isExpanded) {
        item.removeAttribute('data-open');
        content.style.maxHeight = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        item.setAttribute('data-open', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });
  });

  /* ----------------------------------------------------------
   * 5. Adaptive footer title (responsive truncation via JS)
   * ---------------------------------------------------------- */
  var footerTitle = document.querySelector('[data-footer-title]');
  if (footerTitle) {
    function adaptFooterTitle() {
      if (window.innerWidth < 640) {
        footerTitle.textContent = 'MORPHO';
      } else {
        footerTitle.textContent = footerTitle.getAttribute('data-footer-title');
      }
    }
    adaptFooterTitle();
    window.addEventListener('resize', adaptFooterTitle);
  }

})();

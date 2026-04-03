/**
 * JETS v1 — Main JavaScript
 * Handles: mobile nav, sticky header, gallery lightbox,
 *          scroll-triggered animations, active nav highlighting.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Mobile Nav Toggle
  // ============================================================

  const navToggle = document.querySelector('#nav-toggle');
  const nav = document.querySelector('#nav');

  if (navToggle && nav) {
    // Toggle nav open / closed when the hamburger button is clicked
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll while the nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when any nav link is clicked (e.g. same-page anchors)
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close nav when the user clicks outside the nav / toggle button
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('nav-open') &&
          !nav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /** Closes the mobile nav and restores body scroll. */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }


  // ============================================================
  // 2. Sticky Header Scroll Effect
  // ============================================================

  const header = document.querySelector('#header');

  if (header) {
    // Use a passive listener so it never blocks scrolling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  // ============================================================
  // 3. Gallery Lightbox
  // ============================================================

  const lightbox = document.querySelector('#lightbox');
  const lightboxImg = document.querySelector('#lightbox-img');
  const lightboxClose = document.querySelector('#lightbox-close');
  const galleryImages = document.querySelectorAll('.gallery-item img');

  if (lightbox && lightboxImg && galleryImages.length) {

    // Open lightbox when a gallery image is clicked
    galleryImages.forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        // Move focus to the close button for keyboard / screen-reader users
        if (lightboxClose) lightboxClose.focus();
      });
    });

    // Close via the dedicated close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close when clicking the lightbox backdrop (not the image itself)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key; also trap focus inside the lightbox
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }

      // Focus trap — keep Tab / Shift+Tab inside the lightbox
      if (e.key === 'Tab') {
        const focusable = Array.from(
          lightbox.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.disabled);

        if (!focusable.length) { e.preventDefault(); return; }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if focus is on first element, wrap to last
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab: if focus is on last element, wrap to first
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  /** Closes the lightbox and returns focus to the page. */
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }


  // ============================================================
  // 4. Scroll-Triggered Fade-In Animations
  // ============================================================

  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length) {
    // Respect the user's motion-reduction preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation entirely — make all elements visible immediately
      fadeElements.forEach((el) => el.classList.add('visible'));
    } else {
      // Animate each element as it enters the viewport
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Animate once only — stop watching after the trigger
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      fadeElements.forEach((el) => observer.observe(el));
    }
  }


  // ============================================================
  // 5. Active Nav Link Highlight (Fallback)
  // ============================================================

  const navLinks = document.querySelectorAll('#nav a');

  if (navLinks.length) {
    // Extract just the filename from the current URL path
    // e.g. "/v1/gallery.html"  →  "gallery.html"
    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts[pathParts.length - 1] || 'index.html';

    navLinks.forEach((link) => {
      const linkParts = link.getAttribute('href').split('/');
      const linkPage = linkParts[linkParts.length - 1];

      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

}); // end DOMContentLoaded

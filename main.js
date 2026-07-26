// ── FAQ Accordion ──────────────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const trigger = item.querySelector('.faq-q');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all items
    faqItems.forEach(i => i.classList.remove('open'));

    // Open clicked item if it wasn't already open
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ── Scroll Reveal ───────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Nav scroll shadow ───────────────────────────────────────
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

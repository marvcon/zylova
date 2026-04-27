/* =============================================
   ZYLOVA — Main Site JavaScript  v2

   FORMSPREE SETUP (Step 3):
   1. Go to https://formspree.io and create a free account
   2. Create a new form — you'll get a form ID like "xpwzrjkq"
   3. Replace "YOUR_FORMSPREE_ID" below with your actual ID
   4. Formspree will email you every contact form submission
   ============================================= */

const FORMSPREE_ID = "YOUR_FORMSPREE_ID"; // e.g. "xpwzrjkq"

/* ---- Mobile hamburger menu ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
    });
  });
}

/* ---- Navbar scroll shadow ---- */
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 30px rgba(0,0,0,0.3)'
    : 'none';
});

/* ---- Contact form — Formspree integration ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      } else {
        btn.textContent = 'Try Again';
        btn.disabled = false;
        alert('Something went wrong. Please email us directly at hello@zylova.ai');
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      console.error('Form error:', err);
      alert('Connection error. Please try again.');
    }
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Scroll fade-in animation ---- */
const fadeEls = document.querySelectorAll(
  '.feature-card, .usecase, .pricing-card, .testimonial-card, .step'
);

if (fadeEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease ' + (i * 0.05) + 's, transform 0.5s ease ' + (i * 0.05) + 's';
    observer.observe(el);
  });
}

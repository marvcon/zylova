/* =============================================
   ZYLOVA — Dashboard JavaScript
   ============================================= */

// Animate metric numbers on load
function animateCount(el, target, suffix) {
  suffix = suffix || '';
  let start = 0;
  const duration = 1000;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(function() {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = start + suffix;
    }
  }, 16);
}

window.addEventListener('load', function() {
  const metricEls = document.querySelectorAll('.metric-value');
  const targets = [312, 47, 28, 19, 6];
  const suffixes = ['', '', '', '', ''];

  metricEls.forEach(function(el, i) {
    const raw = el.textContent.trim();
    // Only animate pure numbers
    if (targets[i] !== undefined && !isNaN(targets[i])) {
      el.textContent = '0';
      setTimeout(function() {
        animateCount(el, targets[i], suffixes[i] || '');
      }, i * 120);
    }
  });
});

// Simulate live updates every 30 seconds
function simulateLiveUpdate() {
  const convEl = document.querySelector('.metrics-grid .metric-card:first-child .metric-value');
  if (convEl) {
    const current = parseInt(convEl.textContent.replace(/\D/g, '')) || 312;
    const newVal = current + Math.floor(Math.random() * 3);
    convEl.textContent = newVal;
  }
}
setInterval(simulateLiveUpdate, 30000);

document.getElementById('theme-toggle').addEventListener('click', function () {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});
// Duration slider update
const slider = document.getElementById('duration-slider');
const display = document.getElementById('duration-display');
slider.addEventListener('input', () => {
  const mins = Math.floor(slider.value / 60);
  const secs = slider.value % 60;
  display.textContent = `${mins}:${secs === 0 ? '00' : secs}`;
});

// Billing toggle logic (basic demo)
const pricingTiers = document.querySelectorAll('.tier');
document.getElementById('billing-type').addEventListener('change', (e) => {
  const mode = e.target.value;
  pricingTiers.forEach(tier => {
    if (mode === "monthly") {
      tier.querySelector('h3').textContent = tier.dataset.monthly;
    } else {
      tier.querySelector('h3').textContent = tier.dataset.onetime;
    }
  });
});
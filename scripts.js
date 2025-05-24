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

// Form validation with basic feedback
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      let valid = true;
      form.querySelectorAll("input[required], textarea[required]").forEach(el => {
        if (!el.value.trim()) {
          valid = false;
          el.style.border = "2px solid red";
        } else {
          el.style.border = "";
        }
      });
      if (!valid) {
        e.preventDefault();
        alert("Please fill out all required fields.");
      }
    });
  }
});

// ===== Progressive Text Reveal Animation =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = document.querySelectorAll('header, #hero, #about');
  let delay = 0;

  sections.forEach(section => {
    section.querySelectorAll('h1, h2, h3, p, a').forEach(el => {
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      el.style.visibility = 'visible';
      el.style.whiteSpace = 'pre-wrap';

      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = 0;
        span.style.animation = `revealChar 0.03s ${delay + i * 30}ms forwards`;
        el.appendChild(span);
      });

      delay += text.length * 15;
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      alert("Thanks for your request! We'll be in touch.");
    });
  }
});

document.querySelectorAll('nav ul a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('nav ul').classList.remove('active');
  });
});

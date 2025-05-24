document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', function () {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  });

  // AOS init
  AOS.init();

  // GSAP vinyl spin (example)
  gsap.to(".hero-vinyl", {
    rotation: 360,
    repeat: -1,
    ease: "linear",
    duration: 10,
    transformOrigin: "50% 50%"
  });
});


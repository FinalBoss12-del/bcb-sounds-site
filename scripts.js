
document.addEventListener("DOMContentLoaded", function () {
  AOS.init();
  gsap.from(".hero-vinyl", { rotation: 0, duration: 5, repeat: -1, ease: "linear", transformOrigin: "center center", rotation: 360 });

  document.getElementById('theme-toggle').addEventListener('click', function () {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  });

  const audio = document.getElementById('sample-audio');
  audio.addEventListener('click', () => {
    if (audio.paused) audio.play();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init();

  // GSAP infinite vinyl spin
  gsap.to(".hero-vinyl", {
    rotation: 360,
    duration: 10,
    repeat: -1,
    ease: "linear",
    transformOrigin: "50% 50%"
  });

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  });

  // Optional: autoplay fallback for audio
  const audio = document.getElementById("sample-audio");
  audio.addEventListener("click", () => {
    if (audio.paused) audio.play();
  });
});

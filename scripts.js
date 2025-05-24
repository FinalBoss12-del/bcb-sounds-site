
document.getElementById('theme-toggle').addEventListener('click', function () {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});

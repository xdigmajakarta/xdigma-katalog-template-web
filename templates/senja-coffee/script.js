const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  document.body.classList.toggle('menu-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
}));
const quotes = [
  ['“Kopinya serius, suasananya santai. Salah satu tempat favorit untuk kerja pagi di Jakarta.”', '— Nadine, pelanggan rutin'],
  ['“Es Kopi Senja-nya balance banget. Manisnya pas, kopinya tetap terasa, dan baristanya ramah.”', '— Arga, local guide'],
  ['“Tempat yang selalu saya pilih untuk catch-up. Nyaman, tidak berisik, dan pastry-nya juara.”', '— Maya, pelanggan rutin']
];
document.querySelectorAll('.quote-dots button').forEach((dot, index) => dot.addEventListener('click', () => {
  document.getElementById('quote-text').textContent = quotes[index][0];
  document.getElementById('quote-author').textContent = quotes[index][1];
  document.querySelectorAll('.quote-dots button').forEach(item => item.classList.remove('active'));
  dot.classList.add('active');
}));
document.getElementById('year').textContent = new Date().getFullYear();

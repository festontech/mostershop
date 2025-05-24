document.querySelectorAll('.slider-bullets .bullet').forEach(bullet => {
  bullet.addEventListener('click', () => {
    const src = bullet.getAttribute('data-src');
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.slider-bullets .bullet').forEach(b => b.classList.remove('active'));
    bullet.classList.add('active');
  });
});
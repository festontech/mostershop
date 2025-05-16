
document.addEventListener('DOMContentLoaded', () => {
    const bullets = document.querySelectorAll('.bullet');
    const mainImage = document.getElementById('mainImage');

    bullets.forEach(bullet => {
        bullet.addEventListener('click', () => {
            const newSrc = bullet.dataset.src;
            mainImage.src = newSrc;

            bullets.forEach(b => b.classList.remove('active'));
            bullet.classList.add('active');
        });
    });
});
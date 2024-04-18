const backgrounds = ['Third-design.webp', 'First-design.webp', 'Second-design.webp', 'Fourth-design.webp'];
let currentBackgroundIndex = 0;
document.getElementById('change-background').addEventListener('click', function() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
});

const navbar = document.querySelector('.main-nav');
const footer = document.querySelector('.new-footer');

if (URL.contains ('/fr')) {
    navbar.remove();
    footer.remove();
} 
const navbar = document.querySelector('.main-nav');
const footer = document.querySelector('.new-footer');

console.log("fetched" + navbar + footer);

if (path.includes('/fr/home')) {
    navbar.remove();
    footer.remove();
    console.log("removed" + navbar + footer);
} 
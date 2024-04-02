const navbar = document.querySelector('.main-nav');
const footer = document.querySelector('.new-footer');

console.log("fetched" + navbar + footer);

if (URL.contains ('/fr')) {
    navbar.remove();
    footer.remove();
    console.log("removed" + navbar + footer);
} 
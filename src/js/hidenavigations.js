const navbar = document.querySelector('.sticky-wrapper');
const footer = document.querySelector('.new-footer');

console.log("fetched" + navbar + footer);

if (path.includes('/fr/home')) {
    navbar.addClass('fr-hidden');
    footer.remove();
    console.log("removed" + navbar + footer);
} 
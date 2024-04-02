const navbar = document.querySelector('.sticky-wrapper');
const footer = document.querySelector('.new-footer');

console.log("fetched" + navbar + footer);

if (path.includes('/fr/home')) {
    navbar.classList.add('fr-hidden');
    footer.remove();
    console.log("removed" + navbar + footer);
} 
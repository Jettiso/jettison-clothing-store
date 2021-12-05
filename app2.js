const navBtn = document.querySelector('.nav-btn');
const mobileNav = document.querySelector('.mobile-nav');

navBtn.addEventListener('click', navToggle);

function navToggle() {
    mobileNav.classList.toggle('showNav');
}


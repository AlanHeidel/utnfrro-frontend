
const checkbox = document.getElementById('check');
const navbarList = document.querySelector('.navbar-list-mobile');
const body = document.body;
const barMobile = document.querySelector('.bar')
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo');
    const navList = document.querySelector('.navbar-list');
    const bar = document.querySelector('.bar');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
        navList.classList.add('scrolled');
        logo.classList.add('scrolled');
        bar.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        navList.classList.remove('scrolled');
        logo.classList.remove('scrolled');
        bar.classList.remove('scrolled');
    }
})
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      navbarList.classList.add('open');
      barMobile.classList.add('open');
      body.classList.add('no-scroll');
    } else {
      navbarList.classList.remove('open');
      body.classList.remove('no-scroll');
      barMobile.classList.remove('open');
    }
  });




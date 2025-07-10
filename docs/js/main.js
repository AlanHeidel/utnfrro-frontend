
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
})


const checkbox = document.getElementById('check');
const navbarList = document.querySelector('.navbar-list');
const body = document.body;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      navbarList.classList.add('open');
      body.classList.add('no-scroll');
    } else {
      navbarList.classList.remove('open');
      body.classList.remove('no-scroll');
    }
  });




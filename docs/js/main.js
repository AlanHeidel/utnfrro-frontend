
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
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




const sections = document.querySelectorAll('section');

function revealSections() {

  sections.forEach(section => {

    const sectionTop = section.getBoundingClientRect().top;

    const triggerPoint = window.innerHeight - 100;

    if(sectionTop < triggerPoint) {
      section.classList.add('show');
    }

  });

}

window.addEventListener('scroll', revealSections);

revealSections();
const track = document.querySelector('.gallery-track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const imageWidth = window.innerWidth < 600 ? 260 : 320;

nextBtn.addEventListener('click', () => {
  track.scrollTo({
    left: track.scrollLeft + imageWidth,
    behavior: 'smooth'
  });
});

prevBtn.addEventListener('click', () => {
  track.scrollTo({
    left: track.scrollLeft - imageWidth,
    behavior: 'smooth'
  });
});




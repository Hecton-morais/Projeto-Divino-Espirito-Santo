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

// =====================
// CARREGAR EVENTOS
// =====================
async function carregarEventos() {
  const grid = document.getElementById('event-grid')
  const res = await fetch('http://localhost:3001/eventos')
  const eventos = await res.json()

  if (eventos.length === 0) {
    grid.innerHTML = '<p style="opacity:0.5">Nenhum evento cadastrado.</p>'
    return
  }

  grid.innerHTML = eventos.map(e => `
    <article class="card">
      <h3>${e.titulo}</h3>
      <p>${e.data}</p>
    </article>
  `).join('')
}

// =====================
// CARREGAR FOTOS
// =====================
async function carregarFotos() {
  const track = document.getElementById('gallery-track')
  const res = await fetch('http://localhost:3001/fotos')
  const fotos = await res.json()

  if (fotos.length === 0) {
    track.innerHTML = '<p style="opacity:0.5">Nenhuma foto cadastrada.</p>'
    return
  }

  track.innerHTML = fotos.map((f, i) => `
    <img src="${f.url}" alt="${f.alt}" ${i === 0 ? 'loading="eager"' : 'loading="lazy"'}>
  `).join('')
}

carregarEventos()
carregarFotos()
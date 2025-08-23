document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section_3, section_4");

  function revealOnScroll() {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight - 100) {
        section.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Ejecutar al cargar para la primera sección
});
        
const images = document.querySelectorAll(".project-images img");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

images.forEach(img => observer.observe(img));

const canvas = document.getElementById('cubotrix-canvas');
const ctx = canvas.getContext('2d');

let personaje = { x: 50, y: canvas.height - 50, width: 40, height: 40, velocidadX: 0, velocidadY: 0, muerto: false };
let obstaculos = [
  { x: 150, y: canvas.height - 120, width: 80, height: 20, velocidadY: 4 },
  { x: 300, y: canvas.height - 170, width: 100, height: 25, velocidadY: 5 },
  { x: 450, y: canvas.height - 140, width: 90, height: 30, velocidadY: 6 }
];

let victoriaX1 = canvas.width - 50;
let victoriaY1 = canvas.height - 50;
let victoriaX2 = canvas.width - 100;
let victoriaY2 = canvas.height - 100;
let victoriaX3 = canvas.width;
let victoriaY3 = canvas.height - 100;

let vidas = 3;

function dibujarPersonaje() {
  ctx.fillStyle = personaje.muerto ? 'black' : 'purple';
  ctx.fillRect(personaje.x, personaje.y, personaje.width, personaje.height);
}

function dibujarObstaculos() {
  ctx.fillStyle = 'red';
  obstaculos.forEach(obstaculo => {
    ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
    obstaculo.y += obstaculo.velocidadY;

    if (obstaculo.y > canvas.height) obstaculo.y = -obstaculo.height;

    if (!personaje.muerto && personaje.x < obstaculo.x + obstaculo.width &&
        personaje.x + personaje.width > obstaculo.x &&
        personaje.y < obstaculo.y + obstaculo.height &&
        personaje.y + personaje.height > obstaculo.y) {
      perderVida();
    }
  });
}

function dibujarVictoria() {
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(victoriaX1, victoriaY1);
  ctx.lineTo(victoriaX2, victoriaY2);
  ctx.lineTo(victoriaX3, victoriaY3);
  ctx.closePath();
  ctx.fill();
}

function detectarColisionTriangulo(px, py) {
  const A = 1 / 2 * (-victoriaY2 * victoriaX3 + victoriaY1 * (-victoriaX2 + victoriaX3) + victoriaX1 * (victoriaY2 - victoriaY3) + victoriaX2 * victoriaY3);
  const sign = A < 0 ? -1 : 1;
  const s = sign * (victoriaY1 * victoriaX3 - victoriaX1 * victoriaY3 + (victoriaY3 - victoriaY1) * px + (victoriaX1 - victoriaX3) * py);
  const t = sign * (victoriaX1 * victoriaY2 - victoriaY1 * victoriaX2 + (victoriaY1 - victoriaY2) * px + (victoriaX2 - victoriaX1) * py);
  return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

function perderVida() {
  vidas--;
  personaje.muerto = true;
  if (vidas > 0) {
    resetear();
  } else {
    alert("Has perdido 😢 Reiniciando...");
    resetear(true);
  }
}

function resetear(total = false) {
  personaje.x = 50;
  personaje.y = canvas.height - 50;
  personaje.velocidadX = 0;
  personaje.velocidadY = 0;
  personaje.muerto = false;
  if (total) vidas = 3;
}

function actualizarPersonaje() {
  personaje.x += personaje.velocidadX;
  if (personaje.x < 0) personaje.x = 0;
  if (personaje.x > canvas.width - personaje.width) personaje.x = canvas.width - personaje.width;

  if (personaje.y < canvas.height - personaje.height) {
    personaje.velocidadY += 0.5;
  } else {
    personaje.y = canvas.height - personaje.height;
    personaje.velocidadY = 0;
  }
  personaje.y += personaje.velocidadY;

  if (detectarColisionTriangulo(personaje.x, personaje.y)) {
    alert("¡Nivel completado! 🎉 Reiniciando...");
    resetear(true);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actualizarPersonaje();
  dibujarObstaculos();
  dibujarPersonaje();
  dibujarVictoria();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
  if (!personaje.muerto) {
    if (e.code === 'ArrowLeft') personaje.velocidadX = -5;
    if (e.code === 'ArrowRight') personaje.velocidadX = 5;
    if (e.code === 'Space' && personaje.y >= canvas.height - personaje.height) personaje.velocidadY = -10;
  }
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') personaje.velocidadX = 0;
});

gameLoop();

(function(){
  const frame = document.querySelector('#consola .device-frame');
  if(!frame) return;
  const slides = [...frame.querySelectorAll('.gallery-slide')];
  if(slides.length <= 1) return;

  let i = 0;

  function showNext() {
    // quitar activo al actual
    slides[i].classList.remove('active');

    // siguiente índice
    i = (i + 1) % slides.length;
    const current = slides[i];
    current.classList.add('active');

    if(current.tagName === "VIDEO"){
      current.currentTime = 0; // reinicia
      current.play();          // reproduce
      setTimeout(showNext, 7000); // espera 7s
    } else {
      setTimeout(showNext, 2500); // espera normal para imágenes
    }
  }

  // arranca ciclo
  setTimeout(showNext, 2500);
})();

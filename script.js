const cursos = document.querySelectorAll('.course');
const aprobadas = JSON.parse(localStorage.getItem('aprobadas') || '[]');

function actualizarEstado() {
  cursos.forEach(curso => {
    const codigo = curso.dataset.codigo;
    const requisitos = JSON.parse(curso.dataset.requisitos || '[]');
    const tooltip = requisitos.length ? "Requiere: " + requisitos.join(", ") : "Requiere: NINGUNO";
    curso.setAttribute("data-tooltip", tooltip);

    const completado = aprobadas.includes(codigo);
    const habilitado = requisitos.every(r => aprobadas.includes(r));

    curso.classList.toggle('completed', completado);
    curso.classList.toggle('locked', !habilitado && !completado);
  });
}

cursos.forEach(curso => {
  curso.addEventListener('click', () => {
    const codigo = curso.dataset.codigo;
    const requisitos = JSON.parse(curso.dataset.requisitos || '[]');
    const habilitado = requisitos.every(r => aprobadas.includes(r));

    if (!habilitado && !aprobadas.includes(codigo)) return;

    if (aprobadas.includes(codigo)) {
      aprobadas.splice(aprobadas.indexOf(codigo), 1);
    } else {
      aprobadas.push(codigo);
    }
    localStorage.setItem('aprobadas', JSON.stringify(aprobadas));
    actualizarEstado();
  });
});

const darkMode = document.querySelector(".dark-mode");
const body = document.body;

darkMode.addEventListener("click",()=>{
    body.classList.toggle("active");
});

actualizarEstado();

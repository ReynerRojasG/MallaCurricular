const cursos = document.querySelectorAll('.course');
let aprobadas = JSON.parse(localStorage.getItem('aprobadas') || '[]');

function actualizarEstado() {
  cursos.forEach(curso => {
    const codigo = curso.dataset.codigo;
    const requisitos = JSON.parse(curso.dataset.requisitos || '[]');
    const tooltip = requisitos.length ? "Requisitos: " + requisitos.join(", ") : "Requisitos: NINGUNO";
    curso.setAttribute("data-tooltip", tooltip);

    let requisitosElemento = curso.querySelector('.requisitos-visible');
    if (!requisitosElemento) {
      requisitosElemento = document.createElement('div');
      requisitosElemento.classList.add('requisitos-visible');
      requisitosElemento.style.fontSize = '12px';
      requisitosElemento.style.marginTop = '5px';
      curso.appendChild(requisitosElemento);
    }

    requisitosElemento.innerHTML = requisitos.length 
      ? `<strong>Requisitos:</strong> ${requisitos.join(", ")}`
      : `<strong>Requisitos:</strong> NINGUNO`;

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
      aprobadas = aprobadas.filter(c => c !== codigo);
    } else {
      aprobadas.push(codigo);
    }
    localStorage.setItem('aprobadas', JSON.stringify(aprobadas));
    actualizarEstado();
  });
});

const darkMode = document.querySelector(".dark-mode");
const body = document.body;

darkMode.addEventListener("click", () => {
  body.classList.toggle("active");
});

// Checkboxes de semestre
document.querySelectorAll('.select-semestre').forEach((checkbox, index) => {
  checkbox.addEventListener('change', () => {
    const column = document.querySelectorAll('.column')[index];
    const courses = column.querySelectorAll('.course:not(.locked)');
    const toggle = checkbox.checked;

    courses.forEach(course => {
      const codigo = course.dataset.codigo;

      if (toggle && !aprobadas.includes(codigo)) {
        aprobadas.push(codigo);
      } else if (!toggle && aprobadas.includes(codigo)) {
        aprobadas = aprobadas.filter(c => c !== codigo);
      }
    });

    localStorage.setItem('aprobadas', JSON.stringify(aprobadas));
    actualizarEstado();
  });
});

actualizarEstado();

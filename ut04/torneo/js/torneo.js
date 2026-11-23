// =========================================================
// torneo.js · Validación a medida de la inscripción
// Se carga con defer. Los errores se muestran con
// setCustomValidity() para que el navegador los enseñe
// como los nativos y bloquee el envío.
// =========================================================

const nacimiento   = document.getElementById('nacimiento');
const radiosModo   = document.querySelectorAll('input[name="modalidad"]');
const datosEquipo  = document.getElementById('datos-equipo');
const equipo       = document.getElementById('equipo');
const nivel        = document.getElementById('nivel');
const valorNivel   = document.getElementById('valor-nivel');

const EDAD_MINIMA = 16;
const DIA_TORNEO  = new Date(2027, 0, 15);   // 15 de enero de 2027 (los meses empiezan en 0)


// ---------------------------------------------------------
// 1. Edad mínima calculada a partir de la fecha de nacimiento
// ---------------------------------------------------------
// Devuelve los años cumplidos en una fecha concreta.
function edadEn(fechaNacimiento, fechaReferencia) {
  let edad = fechaReferencia.getFullYear() - fechaNacimiento.getFullYear();
  // Si en la fecha de referencia todavía no ha llegado el cumpleaños, resta 1
  const mesRef = fechaReferencia.getMonth(), diaRef = fechaReferencia.getDate();
  const mesNac = fechaNacimiento.getMonth(), diaNac = fechaNacimiento.getDate();
  if (mesRef < mesNac || (mesRef === mesNac && diaRef < diaNac)) {
    edad--;
  }
  return edad;
}

function comprobarEdad() {
  nacimiento.setCustomValidity('');                 // limpiar el error anterior
  if (!nacimiento.value) return;                    // vacío: ya avisa required

  // new Date(a, m - 1, d) usa la hora local; new Date("aaaa-mm-dd") usaría UTC
  const [a, m, d] = nacimiento.value.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);

  if (fecha > new Date()) {
    nacimiento.setCustomValidity('La fecha de nacimiento no puede ser futura.');
  } else if (edadEn(fecha, DIA_TORNEO) < EDAD_MINIMA) {
    nacimiento.setCustomValidity(`Debes tener al menos ${EDAD_MINIMA} años el día del torneo (15/01/2027).`);
  }
}
nacimiento.addEventListener('input', comprobarEdad);
nacimiento.addEventListener('change', comprobarEdad);


// ---------------------------------------------------------
// 2. Datos del equipo solo en la modalidad «Con equipo»
// ---------------------------------------------------------
// El fieldset empieza con disabled: sus campos no se validan ni se envían.
// Al elegir «Con equipo» se habilita y pasan a ser obligatorios.
radiosModo.forEach(radio => {
  radio.addEventListener('change', () => {
    const conEquipo = document.getElementById('mod-equipo').checked;
    datosEquipo.disabled = !conEquipo;
    if (conEquipo) equipo.focus();
  });
});


// ---------------------------------------------------------
// 3. Mostrar el valor del control deslizante (range)
// ---------------------------------------------------------
nivel.addEventListener('input', () => {
  valorNivel.textContent = nivel.value;
});

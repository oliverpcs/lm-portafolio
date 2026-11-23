// =========================================================
// cita.js · Validación a medida del formulario de cita
// Se carga con defer: cuando se ejecuta, el HTML ya existe.
// Los errores se muestran con setCustomValidity(), así el
// navegador los enseña en la misma burbuja que los nativos
// y bloquea el envío mientras haya alguno.
// =========================================================

// Campos que vamos a usar
const fecha       = document.getElementById('fecha');
const crearCuenta = document.getElementById('crear-cuenta');
const cuenta      = document.getElementById('cuenta');
const clave       = document.getElementById('clave');
const clave2      = document.getElementById('clave2');
const averia      = document.getElementById('averia');
const contador    = document.getElementById('contador');


// ---------------------------------------------------------
// 1. Fecha mínima: mañana, en formato aaaa-mm-dd
// ---------------------------------------------------------
// Convierte un Date en el texto "aaaa-mm-dd" que entiende input[type=date].
// Se usan getFullYear/getMonth/getDate (hora local) y no toISOString(),
// que da la fecha en UTC y de noche podría devolver el día anterior.
function aFormatoISO(d) {
  const anio = d.getFullYear();
  const mes  = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() va de 0 a 11
  const dia  = String(d.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

const manana = new Date();
manana.setDate(manana.getDate() + 1);   // si es día 30 o 31, Date pasa solo al mes siguiente
fecha.min = aFormatoISO(manana);        // a partir de aquí el navegador rechaza fechas anteriores


// ---------------------------------------------------------
// 2. Domingos cerrados
// ---------------------------------------------------------
function comprobarFecha() {
  fecha.setCustomValidity('');          // limpiar primero: si no, el error se queda para siempre
  if (!fecha.value) return;             // vacío: ya avisa el required

  // "2026-11-29" -> [2026, 11, 29]. Se construye con new Date(a, m - 1, d)
  // porque new Date("2026-11-29") se interpreta en UTC y puede dar el día anterior.
  const [a, m, d] = fecha.value.split('-').map(Number);
  const diaSemana = new Date(a, m - 1, d).getDay();   // 0 = domingo, 6 = sábado

  if (diaSemana === 0) {
    fecha.setCustomValidity('El taller cierra los domingos.');
  }
}
fecha.addEventListener('input', comprobarFecha);
fecha.addEventListener('change', comprobarFecha);


// ---------------------------------------------------------
// 3. Cuenta opcional
// ---------------------------------------------------------
// El fieldset empieza con disabled en el HTML: sus campos no se validan
// ni se envían. Al marcar la casilla se habilita y el foco va a la contraseña.
crearCuenta.addEventListener('change', () => {
  cuenta.disabled = !crearCuenta.checked;
  if (crearCuenta.checked) {
    clave.focus();
  }
});


// ---------------------------------------------------------
// 4. Contraseñas que coinciden
// ---------------------------------------------------------
// El mínimo de 8 caracteres con letras y números lo comprueba el pattern
// del HTML. Aquí solo se compara la repetición con la primera.
function comprobarClaves() {
  clave2.setCustomValidity(
    clave2.value && clave2.value !== clave.value ? 'Las contraseñas no coinciden.' : ''
  );
}
clave.addEventListener('input', comprobarClaves);   // también al cambiar la primera
clave2.addEventListener('input', comprobarClaves);


// ---------------------------------------------------------
// Contador de caracteres de la avería
// ---------------------------------------------------------
function actualizarContador() {
  contador.textContent = `${averia.value.length} / 500 caracteres`;
}
averia.addEventListener('input', actualizarContador);
actualizarContador();   // por si el navegador ha restaurado texto al volver atrás

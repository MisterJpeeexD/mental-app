/**
 * ==========================================================
 * AbrazaMente
 * Registro — Validación de formulario (RUT + contraseñas)
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registroForm");

    if (!form) {
        return;
    }

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const passwordError = document.getElementById("password_error");

    const rutInput = document.getElementById("rut");
    const rutError = document.getElementById("rut_error");

    /* ==========================================================
       RUT — Formateo en vivo (12.345.678-9)
    ========================================================== */

    function formatearRut(valor) {

        let limpio = valor
            .replace(/[^0-9kK]/g, "")
            .toUpperCase();

        if (limpio.length === 0) {
            return "";
        }

        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);

        const cuerpoFormateado = cuerpo
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return cuerpo.length > 0
            ? `${cuerpoFormateado}-${dv}`
            : dv;

    }

    /* ==========================================================
       RUT — Validación módulo 11
    ========================================================== */

    function validarRut(rutCompleto) {

        const limpio = rutCompleto
            .replace(/\./g, "")
            .replace(/-/g, "")
            .toUpperCase();

        if (limpio.length < 2) {
            return false;
        }

        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);

        if (!/^\d+$/.test(cuerpo)) {
            return false;
        }

        let suma = 0;
        let multiplicador = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {

            suma += Number(cuerpo[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;

        }

        const resto = 11 - (suma % 11);
        let dvEsperado;

        if (resto === 11) {
            dvEsperado = "0";
        } else if (resto === 10) {
            dvEsperado = "K";
        } else {
            dvEsperado = String(resto);
        }

        return dvEsperado === dv;

    }

    if (rutInput) {

        rutInput.addEventListener("input", () => {

            const posicionCursor = rutInput.selectionStart;
            const largoAntes = rutInput.value.length;

            rutInput.value = formatearRut(rutInput.value);

            const largoDespues = rutInput.value.length;
            const ajuste = largoDespues - largoAntes;

            rutInput.setSelectionRange(
                posicionCursor + ajuste,
                posicionCursor + ajuste
            );

            rutInput.closest(".input").classList.remove("invalid");
            rutError.style.display = "none";

        });

        rutInput.addEventListener("blur", () => {

            if (rutInput.value && !validarRut(rutInput.value)) {

                rutInput.closest(".input").classList.add("invalid");
                rutError.style.display = "block";

            }

        });

    }

    /* ==========================================================
       CONTRASEÑAS — Coincidencia
    ========================================================== */

    function limpiarErrorPassword() {

        confirmPassword.closest(".input").classList.remove("invalid");
        passwordError.style.display = "none";

    }

    if (confirmPassword) {

        confirmPassword.addEventListener("input", limpiarErrorPassword);

    }

    /* ==========================================================
       ENVÍO DEL FORMULARIO
    ========================================================== */

    form.addEventListener("submit", (event) => {

        let esValido = true;

        if (rutInput && !validarRut(rutInput.value)) {

            esValido = false;
            rutInput.closest(".input").classList.add("invalid");
            rutError.style.display = "block";

        }

        if (password.value !== confirmPassword.value) {

            esValido = false;
            confirmPassword.closest(".input").classList.add("invalid");
            passwordError.style.display = "block";

        } else {

            limpiarErrorPassword();

        }

        if (!esValido) {
            event.preventDefault();
        }

    });

});

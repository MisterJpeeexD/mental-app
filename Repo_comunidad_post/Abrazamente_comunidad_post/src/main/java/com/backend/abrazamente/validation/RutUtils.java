package com.backend.abrazamente.validation;

public final class RutUtils {

    private RutUtils() {
    }

    public static String normalizar(String rut) {
        if (rut == null) {
            return null;
        }
        String limpio = rut.replace(".", "").replace("-", "").trim().toUpperCase();
        if (limpio.length() < 2) {
            return limpio;
        }
        return limpio.substring(0, limpio.length() - 1) + "-" + limpio.charAt(limpio.length() - 1);
    }

    public static boolean esValido(String rut) {
        String normalizado = normalizar(rut);
        if (normalizado == null || !normalizado.matches("\\d{7,8}-[0-9K]")) {
            return false;
        }

        String[] partes = normalizado.split("-");
        String cuerpo = partes[0];
        char dv = partes[1].charAt(0);
        int suma = 0;
        int multiplicador = 2;

        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }

        int resultado = 11 - (suma % 11);
        char esperado = resultado == 11 ? '0' : resultado == 10 ? 'K' : Character.forDigit(resultado, 10);
        return dv == esperado;
    }
}

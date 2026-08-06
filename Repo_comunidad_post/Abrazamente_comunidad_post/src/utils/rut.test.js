import { describe, expect, it } from 'vitest';
import { formatRut, isValidRut, normalizeRut } from './rut';

describe('utilidades de RUT', () => {
  it('formatea el RUT mientras se escribe', () => {
    expect(formatRut('111111111')).toBe('11.111.111-1');
  });

  it('normaliza el RUT para enviarlo a la API', () => {
    expect(normalizeRut('11.111.111-1')).toBe('11111111-1');
  });

  it('valida el dígito verificador', () => {
    expect(isValidRut('11.111.111-1')).toBe(true);
    expect(isValidRut('11.111.111-2')).toBe(false);
  });
});

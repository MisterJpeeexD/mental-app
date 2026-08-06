export function cleanRut(value = '') {
  return value.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function formatRut(value = '') {
  const clean = cleanRut(value).slice(0, 9);
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${verifier}`;
}

export function normalizeRut(value = '') {
  const clean = cleanRut(value);
  if (clean.length <= 1) return clean;
  return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
}

export function isValidRut(value = '') {
  const normalized = normalizeRut(value);
  if (!/^\d{7,8}-[0-9K]$/.test(normalized)) return false;

  const [body, verifier] = normalized.split('-');
  let sum = 0;
  let multiplier = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const result = 11 - (sum % 11);
  const expected = result === 11 ? '0' : result === 10 ? 'K' : String(result);
  return verifier === expected;
}

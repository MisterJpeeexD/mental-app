/* Asterisco de campo obligatorio. El texto oculto acompaña al asterisco para
   que un lector de pantalla lo anuncie como parte de la etiqueta del campo. */
export default function RequiredMark() {
  return (
    <span className="required-mark">
      *<span className="sr-only"> (obligatorio)</span>
    </span>
  );
}

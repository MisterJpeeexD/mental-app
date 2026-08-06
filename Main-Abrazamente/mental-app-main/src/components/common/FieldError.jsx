export default function FieldError({ message }) {
  return message ? <span className="field-error" role="alert">{message}</span> : null;
}

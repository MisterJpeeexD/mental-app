import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { useAuth } from '../context/AuthContext';
import { formatRut, isValidRut, normalizeRut } from '../utils/rut';

const initialForm = { nombres: '', apellidos: '', run: '', fechaNacimiento: '', genero: '', estadoCivil: '', email: '', telefono: '', ciudad: '', password: '', confirmPassword: '', terms: false };

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/perfil" replace />;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (form.nombres.trim().length < 2) next.nombres = 'Ingresa tus nombres.';
    if (form.apellidos.trim().length < 2) next.apellidos = 'Ingresa tus apellidos.';
    if (!isValidRut(form.run)) next.run = 'Ingresa un RUT chileno válido.';
    if (!form.fechaNacimiento) next.fechaNacimiento = 'Selecciona tu fecha de nacimiento.';
    else if (form.fechaNacimiento >= new Date().toISOString().slice(0, 10)) next.fechaNacimiento = 'La fecha debe ser anterior a hoy.';
    if (!form.genero) next.genero = 'Selecciona una opción.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Ingresa un correo válido.';
    if (form.telefono && !/^\+?[0-9 ]{8,20}$/.test(form.telefono.trim())) next.telefono = 'Ingresa un teléfono válido.';
    if (!form.ciudad.trim()) next.ciudad = 'Ingresa tu ciudad.';
    if (form.password.length < 8) next.password = 'La contraseña debe tener al menos 8 caracteres.';
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) next.password = 'Incluye al menos una letra y un número.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden.';
    if (!form.terms) next.terms = 'Debes aceptar los términos para continuar.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      nombres: form.nombres.trim(), apellidos: form.apellidos.trim(), run: normalizeRut(form.run),
      fechaNacimiento: form.fechaNacimiento, genero: form.genero, estadoCivil: form.estadoCivil,
      email: form.email.trim().toLowerCase(), telefono: form.telefono.trim(), ciudad: form.ciudad.trim(), password: form.password,
    };
    try {
      await register(payload, false);
      navigate('/perfil', { replace: true, state: { registered: true } });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name, label, input) => (
    <label className="auth-field" key={name}>{label}{input}<FieldError message={errors[name]} /></label>
  );

  return (
    <main className="auth-page auth-page--register">
      <AuthVisual register />
      <section className="auth-card-wrap">
        <div className="auth-card auth-card--wide">
          <div className="auth-card-heading"><span>Crear cuenta</span><h2>Regístrate en AbrazaMente</h2><p>Los campos marcados son necesarios para crear tu cuenta.</p></div>
          {serverError && <div className="form-alert form-alert--error" role="alert">{serverError}</div>}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-grid">
              {field('nombres', 'Nombres', <div className={`auth-input ${errors.nombres ? 'invalid' : ''}`}><input value={form.nombres} onChange={(e) => update('nombres', e.target.value)} autoComplete="given-name" placeholder="Ej. Juan Carlos" /></div>)}
              {field('apellidos', 'Apellidos', <div className={`auth-input ${errors.apellidos ? 'invalid' : ''}`}><input value={form.apellidos} onChange={(e) => update('apellidos', e.target.value)} autoComplete="family-name" placeholder="Ej. Pérez Gómez" /></div>)}
              {field('run', 'RUT', <div className={`auth-input ${errors.run ? 'invalid' : ''}`}><input value={form.run} onChange={(e) => update('run', formatRut(e.target.value))} maxLength={12} placeholder="12.345.678-9" /></div>)}
              {field('fechaNacimiento', 'Fecha de nacimiento', <div className={`auth-input ${errors.fechaNacimiento ? 'invalid' : ''}`}><input type="date" value={form.fechaNacimiento} onChange={(e) => update('fechaNacimiento', e.target.value)} /></div>)}
              {field('email', 'Correo electrónico', <div className={`auth-input ${errors.email ? 'invalid' : ''}`}><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" placeholder="correo@ejemplo.com" /></div>)}
              {field('telefono', 'Teléfono (opcional)', <div className={`auth-input ${errors.telefono ? 'invalid' : ''}`}><input type="tel" value={form.telefono} onChange={(e) => update('telefono', e.target.value)} autoComplete="tel" placeholder="+56 9 1234 5678" /></div>)}
              {field('ciudad', 'Ciudad de residencia', <div className={`auth-input ${errors.ciudad ? 'invalid' : ''}`}><input value={form.ciudad} onChange={(e) => update('ciudad', e.target.value)} autoComplete="address-level2" placeholder="Ej. Santiago" /></div>)}
              {field('genero', 'Género', <div className={`auth-input ${errors.genero ? 'invalid' : ''}`}><select value={form.genero} onChange={(e) => update('genero', e.target.value)}><option value="">Selecciona...</option><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="otro">Otro</option><option value="prefiero_no_decir">Prefiero no decir</option></select></div>)}
              {field('estadoCivil', 'Estado civil (opcional)', <div className="auth-input"><select value={form.estadoCivil} onChange={(e) => update('estadoCivil', e.target.value)}><option value="">Selecciona...</option><option value="soltero">Soltero/a</option><option value="casado">Casado/a</option><option value="divorciado">Divorciado/a</option><option value="viudo">Viudo/a</option><option value="otro">Otro</option></select></div>)}
              {field('password', 'Contraseña', <div className={`auth-input ${errors.password ? 'invalid' : ''}`}><input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} autoComplete="new-password" placeholder="Mínimo 8 caracteres" /></div>)}
              {field('confirmPassword', 'Confirmar contraseña', <div className={`auth-input ${errors.confirmPassword ? 'invalid' : ''}`}><input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} autoComplete="new-password" placeholder="Repite tu contraseña" /></div>)}
            </div>
            <label className="auth-checkbox auth-checkbox--terms"><input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} /><span>Acepto los términos del servicio y la política de privacidad.</span></label>
            <FieldError message={errors.terms} />
            <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'Creando cuenta...' : 'Registrarse en AbrazaMente'}</button>
          </form>
          <div className="auth-card-footer"><span>¿Ya tienes una cuenta?</span><Link to="/login">Iniciar sesión</Link></div>
          <Link to="/" className="auth-back">← Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
}

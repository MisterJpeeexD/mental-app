import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/perfil" replace />;

  function validate() {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Ingresa un correo electrónico válido.';
    if (!form.password) next.password = 'La contraseña es obligatoria.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password, remember: form.remember });
      navigate(location.state?.from || '/perfil', { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <AuthVisual />
      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-card-heading"><span>Bienvenido de vuelta</span><h2>Inicia sesión</h2><p>Ingresa con el correo asociado a tu cuenta.</p></div>
          {serverError && <div className="form-alert form-alert--error" role="alert">{serverError}</div>}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-field">Correo electrónico
              <div className={`auth-input ${errors.email ? 'invalid' : ''}`}><span aria-hidden="true">✉</span><input type="email" autoComplete="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <FieldError message={errors.email} />
            </label>
            <label className="auth-field">Contraseña
              <div className={`auth-input ${errors.password ? 'invalid' : ''}`}><span aria-hidden="true">●</span><input type="password" autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <FieldError message={errors.password} />
            </label>
            <label className="auth-checkbox"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /><span>Recordarme en este dispositivo</span></label>
            <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}</button>
          </form>
          <div className="auth-card-footer"><span>¿No tienes una cuenta?</span><Link to="/registro">Crear cuenta</Link></div>
          <Link to="/" className="auth-back">← Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
}

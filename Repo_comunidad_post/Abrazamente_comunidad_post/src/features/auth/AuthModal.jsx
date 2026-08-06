import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthModal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', nombres: '', apellidos: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { email: form.email, passwordHash: form.password, nombres: form.nombres, apellidos: form.apellidos };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data || 'Error en la autenticación');
      }

      if (isLogin && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: data.email || form.email, role: data.role }));
        onLogin(data);
      } else if (!isLogin) {
        setIsLogin(true);
        setError(null);
        setForm({ email: form.email, password: '', nombres: '', apellidos: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          {isLogin ? 'Inicia sesión para acceder a tu espacio seguro' : 'Únete a AbrazaMente y empieza tu camino'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={form.nombres}
                onChange={handleChange}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-semibold"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => { setIsLogin(!isLogin); setError(null); }}
          className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </motion.div>
  );
}

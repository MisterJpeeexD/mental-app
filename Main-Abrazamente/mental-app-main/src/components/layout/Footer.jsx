import { Link } from 'react-router-dom';

/* Sin la clase `reveal`: el footer es chrome permanente, y como solo HomePage y
   TerapiaPage llaman a useReveal, en el resto de rutas se quedaba en opacity 0. */
export default function Footer() {
  return (
    <footer className="mente-footer w-full pt-16 pb-8 px-6 md:px-12 mt-auto relative z-10">
      <div className="max-w-[1200px] mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Marca */}
          <div className="flex flex-col gap-4 lg:pr-6">
            <Link to="/" className="inline-block w-44 transition-opacity hover:opacity-80">
              <img src="/assets/AbrazaMente_Logo.svg" alt="Abrazamente" className="w-full h-auto" />
            </Link>
            <p className="text-[0.92rem] leading-relaxed text-[var(--text-muted)] mt-1">
              Plataforma integral orientada al bienestar emocional. Conectamos a profesionales certificados con personas que buscan un espacio seguro para su crecimiento personal.
            </p>
            <div className="mt-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[0.8rem] text-orange-900 dark:text-orange-200 leading-relaxed font-medium backdrop-blur-md">
              <strong className="block text-orange-600 dark:text-orange-400 mb-1">Importante:</strong> 
              Si estás en una crisis o emergencia médica, comunícate inmediatamente con los servicios de urgencia de tu localidad.
            </div>
          </div>

          {/* Plataforma */}
          <div className="flex flex-col gap-5 lg:pl-8">
            <h4 className="text-[0.8rem] font-extrabold uppercase tracking-widest text-[var(--text-main)]">Plataforma</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Inicio</Link></li>
              <li><Link to="/terapia" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Terapia</Link></li>
              <li><Link to="/botiquin/breathing" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Botiquín de apoyo</Link></li>
              <li><Link to="/journal" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Diario emocional</Link></li>
              <li><Link to="/recursos" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Recursos</Link></li>
              <li><Link to="/comunidad" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Comunidad</Link></li>
            </ul>
          </div>

          {/* Cuenta */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[0.8rem] font-extrabold uppercase tracking-widest text-[var(--text-main)]">Cuenta</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/login" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Iniciar sesión</Link></li>
              <li><Link to="/registro" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Crear cuenta</Link></li>
              <li><Link to="/perfil" className="text-[0.92rem] text-[var(--text-muted)] hover:text-[var(--brand-blue)] font-medium transition-colors">Mi perfil</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[0.8rem] font-extrabold uppercase tracking-widest text-[var(--text-main)]">Contacto</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-[0.92rem] text-[var(--text-muted)] font-medium">Santiago, Chile</li>
              <li className="text-[0.92rem] text-[var(--text-muted)] font-medium">+56 9 0000 0000</li>
              <li>
                <a href="mailto:hola@abrazamente.cl" className="text-[0.92rem] text-[var(--brand-blue)] hover:underline font-bold transition-colors">
                  hola@abrazamente.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/40 dark:border-gray-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.85rem] text-[var(--text-muted)] font-medium text-center md:text-left">
            AbrazaMente SpA <span className="mx-2 hidden md:inline">•</span> Diseñado por <strong>Grupo 1</strong> <span className="mx-2 hidden md:inline">•</span> 
            <span className="block md:inline mt-1 md:mt-0">© {new Date().getFullYear()} Todos los derechos reservados</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

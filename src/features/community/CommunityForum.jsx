import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useState } from 'react';
import { Search, MoreHorizontal, MessageSquare, Heart, Share2 } from 'lucide-react';

/* ─── Paleta ─────────────────────────────────────────────── */
const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
};

/* ─── Overlay para visitantes no autenticados ─────────────── */
function GuestOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl" style={{
      background: 'rgba(18,18,18,0.3)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    }}>
      <div className="w-full max-w-[420px] p-10 text-center rounded-[28px] border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.15)]" style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)'
      }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center shadow-[0_12px_28px_rgba(62,123,250,0.3)]" style={{
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold mb-2.5 text-gray-900 tracking-tight">Únete a la comunidad</h2>
        <p className="text-[0.9rem] text-gray-500 leading-relaxed mb-7">
          Crea una cuenta para acceder al espacio de comunidad: un lugar moderado para compartir tu proceso y conectar con personas que entienden lo que vives.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            to="/registro"
            className="flex items-center justify-center h-12 rounded-xl text-white font-bold text-[0.92rem] shadow-[0_8px_20px_rgba(62,123,250,0.3)] transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})` }}
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center h-11 rounded-xl font-semibold text-[0.88rem] transition-colors"
            style={{ background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.2)', color: BRAND.blue }}
          >
            Ya tengo cuenta → Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Vista principal ─────────────────────────────────────── */
export default function CommunityForum() {
  const { isAuthenticated, user } = useAuth();
  const [activeTopic, setActiveTopic] = useState('Todas las temáticas');
  const [activeFriendTab, setActiveFriendTab] = useState('sugerencias');

  const topics = [
    { name: 'Todas las temáticas', desc: 'Todo el muro', count: 4, color: 'bg-blue-500' },
    { name: 'Ansiedad y estrés', desc: 'Herramientas y apoyo diario', count: 1, color: 'bg-orange-500' },
    { name: 'Duelo y pérdidas', desc: 'Acompañamiento en el proceso', count: 1, color: 'bg-purple-500' },
    { name: 'Autoestima', desc: 'Amor propio y aceptación', count: 0, color: 'bg-teal-400' },
    { name: 'Relaciones', desc: 'Vínculos sanos', count: 0, color: 'bg-green-500' }
  ];

  const friends = [
    { name: 'Camila Reyes', desc: 'Comunidad de Ansiedad', initials: 'CR', color: 'from-teal-300 to-teal-400' },
    { name: 'Daniela Muñoz', desc: '5 amigos en común', initials: 'DM', color: 'from-orange-200 to-orange-300' },
    { name: 'Ale Torres', desc: 'Comunidad de Vínculos', initials: 'AT', color: 'from-blue-300 to-blue-400' },
  ];

  const glassPanelClass = "bg-white/60 backdrop-blur-[22px] border border-white/70 rounded-[28px] shadow-[0_20px_45px_rgba(0,0,0,0.05)]";

  return (
    <div className="flex flex-col gap-6 relative min-h-[600px] w-full max-w-[1400px] mx-auto px-4 md:px-0">
      <div 
        className={`grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_340px] gap-6 w-full ${!isAuthenticated ? 'blur-[4px] pointer-events-none select-none' : ''}`}
      >
        {/* Columna Izquierda: Perfil y Temáticas */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 h-max min-w-0">
          {isAuthenticated && (
            <div className={`${glassPanelClass} flex items-center gap-3 p-4`}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                {user?.nombres?.[0]?.toUpperCase() || 'TÚ'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[0.92rem] text-gray-900">Tu perfil</span>
                <span className="text-[0.76rem] text-gray-500">Miembro de la comunidad</span>
              </div>
            </div>
          )}

          <div className={`${glassPanelClass} pb-3`}>
            <div className="flex items-center justify-between px-5 pt-5 pb-1 text-[0.78rem] font-extrabold uppercase tracking-wider text-gray-400">
              <span>Temáticas</span>
            </div>
            <ul className="flex flex-col gap-1 p-2.5">
              {topics.map(t => {
                const isActive = activeTopic === t.name;
                return (
                  <li key={t.name}>
                    <button 
                      onClick={() => setActiveTopic(t.name)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all ${isActive ? 'bg-blue-500/10' : 'hover:bg-gray-500/5'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ${t.color}`} />
                      <div className="flex flex-col min-w-0 flex-1 pr-1">
                        <span className="font-semibold text-[0.88rem] text-gray-900 truncate">{t.name}</span>
                        <span className="text-[0.7rem] text-gray-500 truncate">{t.desc}</span>
                      </div>
                      {t.count > 0 && (
                        <span className={`text-[0.68rem] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-blue-500/15 text-blue-600' : 'bg-gray-500/10 text-gray-500'}`}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Columna Central: Feed */}
        <div className="flex flex-col gap-5 min-w-0">
          {isAuthenticated ? (
            <>
              {/* Composer */}
              <form className={`${glassPanelClass} p-5 flex flex-col gap-3.5 overflow-hidden`}>
                <div className="flex gap-3.5 items-start w-full">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                    {user?.nombres?.[0]?.toUpperCase() || 'TÚ'}
                  </div>
                  <textarea
                    placeholder="¿Qué estás pensando o sintiendo hoy? Compártelo con la comunidad…"
                    className="flex-1 min-w-0 min-h-[56px] resize-none border-none outline-none bg-gray-500/5 focus:bg-gray-500/10 focus:ring-[3px] focus:ring-blue-500/15 rounded-2xl p-3.5 text-[0.95rem] text-gray-900 transition-all placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap w-full">
                  <select className="border border-gray-300/40 bg-white/70 rounded-full px-3.5 py-2 text-[0.82rem] font-semibold text-gray-800 outline-none hover:bg-white transition-colors max-w-full">
                    <option>Ansiedad y estrés</option>
                    <option>Depresión</option>
                    <option>Autoestima</option>
                    <option>Duelo y pérdidas</option>
                    <option>Relaciones</option>
                  </select>
                  <button type="button" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[0.88rem] shadow-[0_8px_18px_rgba(62,123,250,0.25)] transition-all hover:scale-[1.03]">
                    Publicar
                  </button>
                </div>
              </form>

              {/* Feed Filter */}
              <div className="flex items-center gap-2.5 px-1 py-1 text-gray-500 text-[0.85rem]">
                Mostrando publicaciones de <strong className="text-gray-900">{activeTopic.toLowerCase()}</strong>
                <button type="button" className="ml-auto text-blue-600 font-bold text-[0.8rem] hover:underline">Ver todas</button>
              </div>

              {/* Feed Posts placeholder - using the same visual as legacy */}
              <div className="flex flex-col gap-4">
                <div className={`${glassPanelClass} p-5 flex flex-col gap-3.5`}>
                  <div className="flex gap-3 items-start">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 bg-gradient-to-br from-teal-300 to-teal-500 shadow-sm">
                      CR
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[0.94rem] text-gray-900">Camila R.</span>
                      <div className="flex items-center gap-1.5 text-[0.76rem] text-gray-500 flex-wrap">
                        <span>hace 2 h</span>
                        <span>·</span>
                        <span className="font-bold px-2 py-0.5 rounded-full text-[0.68rem] bg-blue-500/10 text-blue-600">Ansiedad y estrés</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[0.96rem] leading-relaxed text-gray-800 whitespace-pre-wrap">
                    Hoy tuve un día difícil, pero practiqué la respiración 4-7-8 antes de la reunión y me ayudó a calmar los latidos. Un pequeño paso pero estoy orgullosa.
                  </p>
                  <div className="flex items-center gap-1.5 border-t border-gray-200 pt-2.5 mt-1">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                      <Heart className="w-[17px] h-[17px]" /> 12
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                      <MessageSquare className="w-[17px] h-[17px]" /> 4
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`${glassPanelClass} p-5 h-[120px] bg-white/40`} />
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Comunidad y amigos */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 h-max hidden md:flex min-w-0">
          <div className={`${glassPanelClass} overflow-hidden`}>
            <div className="flex items-center justify-between px-5 pt-5 pb-1 text-[0.78rem] font-extrabold uppercase tracking-wider text-gray-400">
              <span>Comunidad y amigos</span>
            </div>
            <div className="flex gap-1 px-2 pt-3.5">
              {['Sugerencias', 'Solicitudes', 'Mis amigos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFriendTab(tab.toLowerCase())}
                  className={`relative flex-1 text-center py-2 px-1 rounded-xl font-bold text-[0.68rem] transition-colors ${activeFriendTab === tab.toLowerCase() ? 'bg-blue-500/10 text-blue-600' : 'text-gray-500 hover:bg-gray-500/5'}`}
                >
                  <span className="whitespace-nowrap">{tab}</span>
                  {tab === 'Solicitudes' && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[0.55rem] font-extrabold min-w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white">2</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3.5 flex flex-col gap-2.5 max-h-[420px] overflow-y-auto">
              {activeFriendTab === 'sugerencias' && friends.map(f => (
                <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-500/5 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-[0.75rem] shrink-0 bg-gradient-to-br shadow-sm ${f.color}`}>
                    {f.initials}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 pr-1">
                    <span className="font-bold text-[0.84rem] text-gray-900 truncate">{f.name}</span>
                    <span className="text-[0.72rem] text-gray-500 truncate">{f.desc}</span>
                  </div>
                  <button className="shrink-0 max-w-[85px] border-none rounded-full px-2.5 py-1.5 text-[0.7rem] font-bold bg-blue-600 text-white hover:scale-105 hover:bg-blue-700 transition-all whitespace-nowrap">
                    + Agregar
                  </button>
                </div>
              ))}
              {activeFriendTab !== 'sugerencias' && (
                <div className="text-center py-6 px-2 text-gray-500 text-[0.85rem]">
                  No hay {activeFriendTab} por ahora.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Overlay para no autenticados */}
      {!isAuthenticated && <GuestOverlay />}
    </div>
  );
}

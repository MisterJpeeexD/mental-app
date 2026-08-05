import React, { useState, useEffect } from 'react';
import { Search, Languages, Check, Calendar, Star } from 'lucide-react';



export default function ProfessionalDirectory() {
  const [professionals, setProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVoluntario, setFilterVoluntario] = useState('ALL'); // ALL, VOLUNTEER, PAID
  const [bookingProfessional, setBookingProfessional] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('/api/professionals');
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data || []);
      } else {
        setProfessionals([]);
      }
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setProfessionals([]);
    }
  };

  const filtered = professionals.filter(p => {
    const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterVoluntario === 'VOLUNTEER') {
      return matchesSearch && p.esVoluntario;
    }
    if (filterVoluntario === 'PAID') {
      return matchesSearch && !p.esVoluntario;
    }
    return matchesSearch;
  });

  const handleBookSession = (prof) => {
    setBookingProfessional(prof);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingProfessional(null);
      setBookingSuccess(false);
    }, 2500);
  };

  return (
    <div className="py-2 flex flex-col gap-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por especialista, especialidad o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:shadow-md focus:shadow-blue-500/5 transition-all text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterVoluntario('ALL')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              filterVoluntario === 'ALL'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterVoluntario('VOLUNTEER')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              filterVoluntario === 'VOLUNTEER'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Apoyo Gratuito
          </button>
          <button
            onClick={() => setFilterVoluntario('PAID')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              filterVoluntario === 'PAID'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Consulta Privada
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-1 md:col-span-3 text-center py-12 text-gray-500 text-sm">
            No se encontraron profesionales que coincidan con la búsqueda.
          </div>
        ) : (
          filtered.map((prof) => (
            <div
              key={prof.id}
              className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 hover:bg-white/3 transition-all duration-300 relative overflow-hidden"
            >
              {/* Badge for Volunteer */}
              <div className="absolute top-4 right-4">
                {prof.esVoluntario ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                    Apoyo Voluntario
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-[10px] font-bold">
                    Consulta
                  </span>
                )}
              </div>

              {/* Profile Area */}
              <div className="flex gap-4 items-center">
                <img
                  src={prof.fotoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200'}
                  alt={`${prof.nombre} ${prof.apellido}`}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200';
                  }}
                  className="w-14 h-14 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-bold text-white text-base">
                    {prof.nombre} {prof.apellido}
                  </h4>
                  <p className="text-xs text-blue-400 font-semibold">{prof.descripcion}</p>
                </div>
              </div>

              {/* Stats / Info */}
              <div className="flex gap-3 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                  {prof.anosExperiencia} años de exp.
                </span>
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-gray-500" />
                  {prof.idiomas}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                {prof.biografia}
              </p>

              {/* Action Button */}
              <button
                onClick={() => handleBookSession(prof)}
                className="w-full mt-auto py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent text-xs font-semibold cursor-pointer transition-all active:scale-98"
              >
                Reservar Consulta
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal Overlay */}
      {bookingProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative">
            {bookingSuccess ? 
                           <div className="py-4">
                             <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
                               <Check className="w-6 h-6" />
                             </div>
                             <h4 className="text-base font-bold text-white mb-1">¡Reserva Solicitada!</h4>
                             <p className="text-xs text-gray-400">
                               Hemos notificado a {bookingProfessional.nombre}. Recibirás un enlace de videollamada por correo.
                             </p>
                           </div>
                          : 
                           <>
                             <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                             <h4 className="text-lg font-bold text-white mb-2">Reservar Sesión</h4>
                             <p className="text-xs text-gray-400 mb-6">
                               ¿Deseas agendar una sesión de orientación inicial con{' '}
                               <span className="text-white font-semibold">
                                 {bookingProfessional.nombre} {bookingProfessional.apellido}
                               </span>
                               ?
                             </p>
                             <div className="flex gap-3">
                               <button
                                 onClick={() => setBookingProfessional(null)}
                                 className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-all"
                               >
                                 Cancelar
                               </button>
                               <button
                                 onClick={confirmBooking}
                                 className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-500 transition-all"
                               >
                                 Confirmar
                               </button>
                             </div>
                           </>}
          </div>
        </div>
      )}
    </div>
  );
}

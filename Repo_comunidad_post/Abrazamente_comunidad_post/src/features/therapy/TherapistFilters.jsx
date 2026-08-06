export default function TherapistFilters({ listaBase = [], filtros, onChange, onClear }) {
  const update = (campo) => (event) => onChange({ ...filtros, [campo]: event.target.value });

  const especialidades = [...new Set(listaBase.map(e => e.especialidad).filter(Boolean))].sort();
  const terapias = [...new Set(listaBase.map(e => e.terapia).filter(Boolean))].sort();
  const sexos = [...new Set(listaBase.map(e => e.sexo).filter(Boolean))].sort();

  return (
    <div className="terapia-filters reveal">
      <div className="filter-group">
        <label htmlFor="searchInput">Buscar por nombre</label>
        <input
          type="search"
          id="searchInput"
          placeholder="Ej. Dra. Rojas"
          value={filtros.texto}
          onChange={update('texto')}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filterEspecialidad">Especialidad</label>
        <select id="filterEspecialidad" value={filtros.especialidad} onChange={update('especialidad')}>
          <option value="">Todas</option>
          {especialidades.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filterTerapia">Tipo de terapia</label>
        <select id="filterTerapia" value={filtros.terapia} onChange={update('terapia')}>
          <option value="">Todas</option>
          {terapias.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filterSexo">Sexo del terapeuta</label>
        <select id="filterSexo" value={filtros.sexo} onChange={update('sexo')}>
          <option value="">Todos</option>
          {sexos.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
        </select>
      </div>

      <button type="button" className="btn-secondary" onClick={onClear}>Limpiar filtros</button>
    </div>
  );
}

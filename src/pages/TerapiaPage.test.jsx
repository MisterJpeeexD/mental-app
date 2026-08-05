import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TerapiaPage from './TerapiaPage';

const renderPage = () => render(
  <MemoryRouter>
    <TerapiaPage />
  </MemoryRouter>
);

const tarjetas = () => screen.getAllByRole('button', { name: /^Ver detalle de/ });

describe('TerapiaPage', () => {
  beforeEach(() => {
    // Mock fetch para entorno de pruebas
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Dra. Daniela Rojas', sexo: 'Mujer', especialidad: 'Cognitivo-Conductual', terapia: 'Terapia para Ansiedad', descripcion: 'Especialista en ansiedad', enfoque: 'TCC basada en evidencia', comentarios: [{ usuario: 'Anónimo', texto: 'Excelente' }] },
          { id: 2, nombre: 'Psic. Carlos Méndez', sexo: 'Hombre', especialidad: 'Terapia Sistémica', terapia: 'Terapia de Pareja', descripcion: 'Psicólogo Sistémico', enfoque: 'Comunicación no violenta', comentarios: [{ usuario: 'Anónimo', texto: 'Muy bueno' }] }
        ]),
      });
  });

  it('muestra el hero y los terapeutas disponibles', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /Descubre la terapia/i })).toBeInTheDocument();
    const items = await screen.findAllByRole('button', { name: /^Ver detalle de/ });
    expect(items.length).toBeGreaterThan(0);
  });

  it('filtra por nombre de especialista', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findAllByRole('button', { name: /^Ver detalle de/ });
    await user.type(screen.getByLabelText('Buscar por nombre'), 'Daniela');
    
    expect(tarjetas()).toHaveLength(1);
    expect(screen.getByText('Dra. Daniela Rojas')).toBeInTheDocument();
  });

  it('avisa cuando ningún terapeuta coincide y permite limpiar los filtros', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findAllByRole('button', { name: /^Ver detalle de/ });
    await user.type(screen.getByLabelText('Buscar por nombre'), 'nadie');
    expect(screen.getByText(/No se encontraron terapeutas/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(tarjetas().length).toBeGreaterThan(0);
  });

  it('abre el detalle del terapeuta y lo cierra con Escape', async () => {
    const user = userEvent.setup();
    renderPage();

    const btn = await screen.findByRole('button', { name: 'Ver detalle de Dra. Daniela Rojas' });
    await user.click(btn);

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('Dra. Daniela Rojas')).toBeInTheDocument();
    expect(within(dialogo).getByText(/Enfoque terapéutico/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

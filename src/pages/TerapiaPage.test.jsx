import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TerapiaPage from './TerapiaPage';
import { especialistas } from '../features/therapy/therapyData';

const renderPage = () => render(<TerapiaPage />, { wrapper: MemoryRouter });

const tarjetas = () => screen.getAllByRole('button', { name: /^Ver detalle de/ });

describe('TerapiaPage', () => {
  it('muestra el hero y todos los terapeutas', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /Descubre la terapia/i })).toBeInTheDocument();
    expect(tarjetas()).toHaveLength(especialistas.length);
    expect(screen.getByText(`${especialistas.length} terapeuta(s) encontrado(s)`)).toBeInTheDocument();
  });

  it('filtra por especialidad y por nombre', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText('Especialidad'), 'Terapia Familiar');
    expect(tarjetas()).toHaveLength(2);

    await user.type(screen.getByLabelText('Buscar por nombre'), 'Valentina');
    expect(tarjetas()).toHaveLength(1);
    expect(screen.getByText('Dra. Valentina Soto')).toBeInTheDocument();
  });

  it('avisa cuando ningún terapeuta coincide y permite limpiar los filtros', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText('Buscar por nombre'), 'nadie');
    expect(screen.getByText(/No se encontraron terapeutas/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(tarjetas()).toHaveLength(especialistas.length);
  });

  it('abre el detalle con comentarios anónimos y lo cierra con Escape', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Ver detalle de Dra. Camila Rojas' }));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('Dra. Camila Rojas')).toBeInTheDocument();
    expect(within(dialogo).getByText(/Enfoque terapéutico/i)).toBeInTheDocument();
    expect(within(dialogo).getAllByText(/Comentario anónimo #/)).toHaveLength(3);
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});

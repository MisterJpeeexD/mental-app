import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  it('renders the landing page correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Entiende tus emociones/i)).toBeInTheDocument();
    expect(screen.getAllByAltText(/AbrazaMente/i).length).toBeGreaterThan(0);
  });

  it('navigates to the breathing support view from the header', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const botiquinLinks = screen.getAllByRole('link', { name: /botiquín/i });
    expect(botiquinLinks[0]).toHaveAttribute('href', '/botiquin/breathing');
  });

  it('renders the resources library and filters content by search', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/recursos']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Biblioteca de Recursos Psicoeducativos/i)).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/buscar recursos/i);
    await user.type(searchInput, 'ansiedad');

    expect(screen.getByText(/Guía breve para manejar la ansiedad/i)).toBeInTheDocument();
    expect(screen.queryByText(/Técnicas de regulación emocional/i)).not.toBeInTheDocument();
  });
});

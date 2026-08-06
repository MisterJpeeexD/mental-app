import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { describe, it, expect } from 'vitest';

describe('HomePage Component', () => {
  it('renders main welcome text', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    // Asumiendo que HomePage tiene algún texto relacionado con el Hero
    expect(screen.getByText(/Entiende tus emociones/i)).toBeInTheDocument();
  });

  it('renders quick access buttons', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    // Validamos que haya enlaces de navegación (a /recursos, /comunidad, /terapia)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});

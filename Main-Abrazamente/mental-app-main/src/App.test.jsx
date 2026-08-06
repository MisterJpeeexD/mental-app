import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  it('renders the header correctly', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Header no es lazy, debería estar inmediatamente
    expect(screen.getAllByText(/Comunidad/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Recursos/i).length).toBeGreaterThan(0);
  });

  it('renders the lazy-loaded landing page eventually', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Esperamos a que el Suspense termine de cargar HomePage
    expect(await screen.findByText(/Entiende tus emociones/i)).toBeInTheDocument();
  });
});

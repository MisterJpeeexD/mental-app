import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renders the landing page correctly', () => {
    render(<App />);
    expect(screen.getAllByText(/AbrazaMente/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Tu espacio seguro de salud mental/i)).toBeInTheDocument();
  });

  it('opens the botiquin modal when clicking the FAB', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find the FAB by its text content
    const botiquinButtons = screen.getAllByRole('button', { name: /Botiquín Emocional/i });
    
    await act(async () => {
      await user.click(botiquinButtons[0]);
    });
    
    // Check if the modal header appears
    expect(await screen.findByText(/Botiquín de Apoyo Inmediato/i)).toBeInTheDocument();
  });
});

// app/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/auth/login/page';
import { useRouter } from 'next/navigation';
import React from 'react';
import '@testing-library/jest-dom';

// Mockowanie hooka useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mockowanie fetch
global.fetch = jest.fn();

describe('Login', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    // Mockowanie odpowiedzi z fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        accessToken: 'fake-token',
        id: '123',
        username: 'testuser',
        roles: ['ROLE_CLIENT'],
      }),
    });

    // Mocksowanie localStorage.setItem
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    // Przywracanie domyślnej implementacji setItem po każdym teście
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('powinno umożliwić zalogowanie i przekierowanie do panelu klienta', async () => {
    render(<Login />);

    // Zapełnianie formularza
    fireEvent.change(screen.getByPlaceholderText(/Wpisz email lub nazwę użytkownika/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Wpisz hasło/i), {
      target: { value: 'password' },
    });

    // Kliknięcie przycisku logowania
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj/i }));

    // Czekanie na przekierowanie
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/pages/testuser/client-dashboard');
    });

    // Sprawdzanie, czy dane są zapisane w localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('id', '123');
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'fake-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    expect(localStorage.setItem).toHaveBeenCalledWith('role', 'ROLE_CLIENT');
  });

  it('powinno wyświetlić błąd przy nieudanym logowaniu', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Błąd logowania',
      }),
    });

    render(<Login />);

    // Zapełnianie formularza
    fireEvent.change(screen.getByPlaceholderText(/Wpisz email lub nazwę użytkownika/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Wpisz hasło/i), {
      target: { value: 'wrongpassword' },
    });

    // Kliknięcie przycisku logowania
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj/i }));

    // Czekanie na błąd
    await waitFor(() => {
      expect(screen.getByText('Błąd logowania')).toBeInTheDocument();
    });
  });

  it('powinno wyświetlić błąd przy braku tokena dostępowego', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // Brak tokena w odpowiedzi
    });

    render(<Login />);

    // Zapełnianie formularza
    fireEvent.change(screen.getByPlaceholderText(/Wpisz email lub nazwę użytkownika/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Wpisz hasło/i), {
      target: { value: 'password' },
    });

    // Kliknięcie przycisku logowania
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj/i }));

    // Czekanie na błąd
    await waitFor(() => {
      expect(screen.getByText('Brak tokena dostępowego w odpowiedzi')).toBeInTheDocument();
    });
  });
});

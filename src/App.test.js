import { render, screen } from '@testing-library/react';
import App from './App';

test('unauthenticated visitors see the admin login', () => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  render(<App />);
  expect(screen.getByRole('button', { name: /sign in|login/i })).toBeInTheDocument();
});

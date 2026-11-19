import { render, screen } from '@testing-library/react-native';
import App from './app';
test('announces the app heading and clearly identifies unavailable workflows', async () => {
  await render(<App />);
  expect(screen.getByRole('header', { name: 'HomeLearn' })).toBeTruthy();
  expect(screen.getByText(/Account setup and learning plans/)).toBeTruthy();
});

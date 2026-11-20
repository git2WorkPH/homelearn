import { render } from '@testing-library/react-native';
import App from './app';
test('renders planning and learning workflows', () => {
  const result = render(<App />);
  expect(result).toBeTruthy();
});

import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme() {
  try {
    const { isDarkMode } = useAppTheme();
    return isDarkMode ? 'dark' : 'light';
  } catch {
    // If used outside ThemeProvider (e.g. initial render/tests), fallback to system
    const system = require('react-native').useColorScheme();
    return system ?? 'light';
  }
}

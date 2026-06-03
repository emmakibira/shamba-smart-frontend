import { useEffect, useState } from 'react';
import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  try {
    const { isDarkMode } = useAppTheme();
    if (hasHydrated) {
      return isDarkMode ? 'dark' : 'light';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

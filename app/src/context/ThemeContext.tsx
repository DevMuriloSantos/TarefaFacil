import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loadThemeMode, saveThemeMode } from '../services/themeStorage';
import { defaultThemeMode, type ThemeMode } from '../theme';

interface ThemeContextValue {
  themeMode: ThemeMode;
  /** Verdadeiro até a preferência salva ser lida. */
  loading: boolean;
  /**
   * Aplica o tema imediatamente e depois o grava. Se a gravação falhar, o tema
   * continua aplicado nesta sessão e a promise é rejeitada.
   */
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  /** Restaura o tema padrão sem gravar (a preferência já foi removida pela exclusão da conta). */
  resetThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Única fonte de verdade do tema ativo, usada pelo Paper, pela navegação e pelas Configurações.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setMode] = useState<ThemeMode>(defaultThemeMode);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadThemeMode()
      .then(setMode)
      .finally(() => setLoading(false));
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setMode(mode);
    await saveThemeMode(mode);
  }, []);

  const resetThemeMode = useCallback(() => setMode(defaultThemeMode), []);

  const value = useMemo(
    () => ({ themeMode, loading, setThemeMode, resetThemeMode }),
    [themeMode, loading, setThemeMode, resetThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error('useThemeMode deve ser usado dentro de ThemeProvider.');
  }
  return value;
}

import { useCallback, useEffect, useState } from 'react';

/**
 * Tema claro / oscuro.
 * - El oscuro es el tema por defecto (identidad de la marca).
 * - La elección se guarda en el navegador.
 * - index.html aplica el tema antes de que cargue React para evitar el
 *   "parpadeo" blanco/negro: si cambiás STORAGE_KEY o DEFAULT_THEME,
 *   actualizá también ese script.
 */
export type Theme = 'light' | 'dark';

export const STORAGE_KEY = 'theme';
export const DEFAULT_THEME: Theme = 'dark';

const THEME_COLOR: Record<Theme, string> = { dark: '#000000', light: '#f6f3fa' };

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return readStored() ?? DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  // Color de la barra del navegador en mobile
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* sin almacenamiento: el cambio vale sólo para esta visita */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}

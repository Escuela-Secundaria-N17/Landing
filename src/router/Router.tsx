import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Router mínimo sobre la History API (sin dependencias).
 *
 * - Intercepta los clicks en cualquier <a> interno, así los componentes de ui/
 *   siguen usando enlaces comunes y no dependen del router.
 * - Si el sitio crece (rutas con parámetros, carga diferida por página),
 *   se reemplaza por react-router sin tocar las páginas: la fuente de verdad
 *   es la configuración en content/pages.
 *
 * ⚠ En producción el hosting tiene que devolver index.html para cualquier ruta
 *   (ver scripts/prerender.mjs y DEPLOY.md).
 */
type RouterState = {
  path: string;
  hash: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterState | null>(null);

const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

const readLocation = () => ({
  path: normalizePath(window.location.pathname),
  hash: window.location.hash,
});

function shouldIntercept(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.origin !== window.location.origin) return false;
  // Ancla en la misma página: dejar que el navegador haga el scroll.
  if (normalizePath(anchor.pathname) === normalizePath(window.location.pathname) && anchor.hash) return false;
  return true;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);
    if (url.href !== window.location.href) {
      window.history.pushState({}, '', url);
    }
    setLocation(readLocation());
  }, []);

  useEffect(() => {
    const onPop = () => setLocation(readLocation());
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor || !(anchor instanceof HTMLAnchorElement) || !anchor.href) return;
      if (!shouldIntercept(event, anchor)) return;
      event.preventDefault();
      navigate(anchor.href);
    };

    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, [navigate]);

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter debe usarse dentro de <RouterProvider>');
  return ctx;
}

/** ¿El link apunta a la página actual (o a una sub-ruta)? Útil para marcar el menú. */
export function isActivePath(current: string, href: string): boolean {
  const target = normalizePath(new URL(href, 'http://x').pathname);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}

import { notFoundPage, pages } from '@/content/pages';
import { site } from '@/content/site';
import { SiteFooter } from '@/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/layout/SiteHeader/SiteHeader';
import { PageView } from '@/pages/PageView';
import { findPage, getNavItems } from '@/pages/navigation';
import { RouterProvider, useRouter } from '@/router/Router';

const nav = getNavItems(pages);

/** ¿La ruta es una redirección configurada (ej. /ESJA)? */
const redirectFor = (path: string) =>
  site.redirects.find((r) => r.from.some((from) => from.toLowerCase() === path.toLowerCase()));

function Site() {
  const { path, hash } = useRouter();
  const redirect = redirectFor(path);

  // Navegación interna hacia una redirección: salir del sitio.
  // (Si se entra escribiendo la dirección, la resuelve la página estática del build.)
  if (redirect) {
    window.location.replace(redirect.to);
    return null;
  }

  const page = findPage(pages, path, notFoundPage);

  return (
    <>
      <SiteHeader site={site} nav={nav} currentPath={path} />
      <PageView page={page} siteName={`${site.shortName} · ${site.name}`} hash={hash} />
      <SiteFooter site={site} />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Site />
    </RouterProvider>
  );
}

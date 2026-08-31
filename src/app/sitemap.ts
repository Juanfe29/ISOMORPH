import type { MetadataRoute } from 'next';
import { casoSlugs, routes } from '@/lib/content';

const BASE = 'https://isomorph.lat';

/** Se genera desde la tabla de rutas: si una página nace o muere, el sitemap sigue. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pairs: [string, string, number][] = [
    [routes.es.home, routes.en.home, 1],
    [routes.es.servicios, routes.en.servicios, 0.9],
    [routes.es.telecom, routes.en.telecom, 0.9],
    [routes.es.trabajo, routes.en.trabajo, 0.9],
    [routes.es.metodo, routes.en.metodo, 0.8],
    [routes.es.marca, routes.en.marca, 0.6],
    [routes.es.contacto, routes.en.contacto, 0.8],
  ];

  const entries: MetadataRoute.Sitemap = pairs.flatMap(([es, en, priority]) => [
    { url: BASE + es, lastModified: now, priority, alternates: { languages: { es: BASE + es, en: BASE + en } } },
    { url: BASE + en, lastModified: now, priority: priority - 0.1, alternates: { languages: { es: BASE + es, en: BASE + en } } },
  ]);

  for (const key of Object.keys(casoSlugs.es) as (keyof typeof casoSlugs.es)[]) {
    const es = routes.es.caso(casoSlugs.es[key]);
    const en = routes.en.caso(casoSlugs.en[key]);
    entries.push({ url: BASE + es, lastModified: now, priority: 0.7, alternates: { languages: { es: BASE + es, en: BASE + en } } });
    entries.push({ url: BASE + en, lastModified: now, priority: 0.6, alternates: { languages: { es: BASE + es, en: BASE + en } } });
  }

  return entries;
}

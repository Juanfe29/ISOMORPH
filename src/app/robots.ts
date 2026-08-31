import type { MetadataRoute } from 'next';

/** El sitio es público y queremos que se lea y se cite. Bloqueamos scrapers de entrenamiento sin atribución. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-Web'], allow: '/' },
      { userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Bytespider', 'Applebot-Extended'], disallow: '/' },
    ],
    sitemap: 'https://isomorph.lat/sitemap.xml',
  };
}

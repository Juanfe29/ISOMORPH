import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import CasoScreen from '@/components/screens/CasoScreen';
import { casoSlugs, getDict, casoKeyFromSlug } from '@/lib/content';

const LANG = 'es' as const;

export function generateStaticParams() {
  return Object.values(casoSlugs[LANG]).map((caso) => ({ caso }));
}

export async function generateMetadata({ params }: { params: Promise<{ caso: string }> }): Promise<Metadata> {
  const { caso } = await params;
  const key = casoKeyFromSlug(LANG, caso);
  const t = getDict(LANG);
  if (!key) return { title: LANG === 'es' ? 'Caso no encontrado' : 'Case not found' };
  const c = t.casos[key];
  return { title: c.title, description: c.problema };
}

export default async function Page({ params }: { params: Promise<{ caso: string }> }) {
  const { caso } = await params;
  return (
    <SiteShell lang={LANG}>
      <CasoScreen lang={LANG} slug={caso} />
    </SiteShell>
  );
}

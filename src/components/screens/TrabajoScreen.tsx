import VideoBackdrop from '@/components/site/VideoBackdrop';
import WorkFilters from '@/components/site/WorkFilters';
import { getDict, type Lang } from '@/lib/content';
import { h1, label, lede, page } from '@/lib/theme';

export default function TrabajoScreen({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  return (
    <div style={{ position: 'relative', isolation: 'isolate' }}>
      <VideoBackdrop src="/videos/network-on-paper.mp4" height={560} />
      <div style={page}>
        <p style={label}>{t.trLabel}</p>
        <h1 style={h1}>{t.trTitle}</h1>
        <p style={{ ...lede, marginBottom: 32 }}>{t.trLede}</p>
        <WorkFilters lang={lang} />
      </div>
    </div>
  );
}

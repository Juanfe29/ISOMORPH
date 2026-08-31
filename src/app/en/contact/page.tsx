import type { Metadata } from 'next';
import SiteShell from '../../SiteShell';
import ContactoScreen from '@/components/screens/ContactoScreen';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'We do not need a formal brief. Two paragraphs on what is not working is enough.',
  alternates: { canonical: '/en/contact', languages: { es: '/contacto', en: '/en/contact' } },
};

export default function Page() {
  return (
    <SiteShell lang="en">
      <ContactoScreen lang="en" />
    </SiteShell>
  );
}

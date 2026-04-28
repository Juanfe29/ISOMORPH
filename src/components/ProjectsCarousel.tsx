"use client";

import { useRouter } from 'next/navigation';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

interface ProjectsCarouselProps {
    lang: 'es' | 'en';
}

export default function ProjectsCarousel({ lang }: ProjectsCarouselProps) {
    const router = useRouter();
    const live = projects.filter(p => !p.comingSoon);
    const loop = [...live, ...live];

    const handleOpen = (slug: string) => {
        if (slug === 'boaty') {
            const el = document.getElementById('boaty-showcase');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }
        router.push(`/portfolio?p=${slug}#work`);
    };

    return (
        <div className="iso-carousel" aria-label={lang === 'es' ? 'Proyectos en producción' : 'Projects in production'}>
            <div className="iso-carousel-track">
                {loop.map((p, i) => (
                    <ProjectCard
                        key={`${p.slug}-${i}`}
                        project={p}
                        lang={lang}
                        index={0}
                        variant="carousel"
                        onOpen={handleOpen}
                    />
                ))}
            </div>
        </div>
    );
}

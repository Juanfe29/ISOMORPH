"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterCategories, Project, ProjectCategory, projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectDrawer from './ProjectDrawer';

interface ProjectsGridProps {
    lang: 'es' | 'en';
}

export default function ProjectsGrid({ lang }: ProjectsGridProps) {
    const searchParams = useSearchParams();
    const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
    const [openSlug, setOpenSlug] = useState<string | null>(null);

    useEffect(() => {
        const slug = searchParams.get('p');
        if (slug && projects.some(p => p.slug === slug && !p.comingSoon)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing URL query into local state on mount/nav
            setOpenSlug(slug);
        }
    }, [searchParams]);

    const filtered = useMemo<Project[]>(() => {
        if (activeFilter === 'all') return projects;
        return projects.filter(p => p.categories.includes(activeFilter as Exclude<ProjectCategory, 'all'>));
    }, [activeFilter]);

    const counts = useMemo(() => {
        const map: Record<ProjectCategory, number> = {
            all: projects.length,
            ai: 0,
            ml: 0,
            marketplace: 0,
            fintech: 0,
        };
        projects.forEach(p => {
            p.categories.forEach(c => { map[c] += 1; });
        });
        return map;
    }, []);

    const openProject = filtered.find(p => p.slug === openSlug)
        || projects.find(p => p.slug === openSlug)
        || null;

    return (
        <>
            <div className="iso-pg-filters">
                {filterCategories.map(cat => {
                    const isActive = activeFilter === cat.id;
                    const count = counts[cat.id];
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`iso-pg-pill ${isActive ? 'iso-pg-pill-active' : ''}`}
                        >
                            <span>{cat.label[lang]}</span>
                            <span className="iso-pg-pill-count">{count}</span>
                            {isActive && (
                                <motion.span
                                    layoutId="iso-pg-pill-bg"
                                    className="iso-pg-pill-bg"
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <motion.div layout className="iso-pg-grid">
                <AnimatePresence mode="popLayout">
                    {filtered.map((p, i) => (
                        <ProjectCard
                            key={p.slug}
                            project={p}
                            lang={lang}
                            index={i}
                            variant="grid"
                            onOpen={(slug) => !p.comingSoon && setOpenSlug(slug)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <ProjectDrawer
                project={openProject}
                lang={lang}
                onClose={() => setOpenSlug(null)}
            />
        </>
    );
}

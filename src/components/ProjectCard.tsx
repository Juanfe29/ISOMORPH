"use client";

import { motion } from 'framer-motion';
import { Project } from '../data/projects';
import {
    ArrowUpRight,
    Sparkles,
    Anchor,
    Instagram,
    Mail,
    LineChart,
} from 'lucide-react';

const ICONS: Record<string, typeof Anchor> = {
    boaty: Anchor,
    'vision-media-1': Instagram,
    'vision-media-2': Mail,
    'precision-banking': LineChart,
};

interface ProjectCardProps {
    project: Project;
    lang: 'es' | 'en';
    index: number;
    onOpen: (slug: string) => void;
    variant?: 'grid' | 'carousel';
}

export default function ProjectCard({ project, lang, index, onOpen, variant = 'grid' }: ProjectCardProps) {
    const variantClass = variant === 'carousel' ? 'iso-pc-carousel' : 'iso-pc-grid';
    const accentVar = { ['--accent-card' as string]: project.accentColor };

    if (project.comingSoon) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`iso-pc iso-pc-soon ${variantClass}`}
                style={accentVar}
            >
                <div className="iso-pc-soon-inner">
                    <Sparkles size={20} className="iso-pc-soon-icon" />
                    <span className="iso-tag" style={{ color: 'var(--ink-mute)' }}>{project.num}</span>
                    <h3 className="iso-pc-title">{project.title}</h3>
                    <span className="iso-tag">{project.categoryLabel[lang]}</span>
                    <p className="iso-pc-problem" style={{ marginTop: '0.4rem' }}>{project.description[lang]}</p>
                </div>
            </motion.div>
        );
    }

    const Icon = ICONS[project.slug] ?? Sparkles;

    return (
        <motion.button
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onOpen(project.slug)}
            className={`iso-pc ${variantClass}`}
            style={accentVar}
            aria-label={`Open project ${project.title}`}
        >
            <div className="iso-pc-bar">
                <span>{project.num} · {project.categoryLabel[lang]}</span>
                <span className="iso-pc-status">
                    {lang === 'es' ? 'En producción' : 'Live'}
                </span>
            </div>

            <div className="iso-pc-media">
                <div className="iso-pc-media-grid" aria-hidden />
                <div className="iso-pc-media-icon" aria-hidden>
                    <Icon size={40} strokeWidth={1.25} />
                </div>
            </div>

            <div className="iso-pc-body">
                <h3 className="iso-pc-title">
                    {project.title}
                    {project.titleAccent && (
                        <span className="iso-pc-title-accent">
                            {' '}{project.titleAccent}
                        </span>
                    )}
                </h3>

                <p className="iso-pc-problem">
                    <span className="iso-pc-problem-lbl">
                        {lang === 'es' ? 'El problema:' : 'The problem:'}
                    </span>{' '}
                    {project.problem[lang]}
                </p>

                <div className="iso-pc-footer">
                    <span>
                        {lang === 'es' ? 'Ver caso' : 'View case'}
                    </span>
                    <ArrowUpRight size={14} className="iso-pc-arrow" />
                </div>
            </div>
        </motion.button>
    );
}

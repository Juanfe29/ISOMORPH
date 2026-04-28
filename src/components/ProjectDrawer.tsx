"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Project } from '../data/projects';
import { X, Github, ExternalLink } from 'lucide-react';

interface ProjectDrawerProps {
    project: Project | null;
    lang: 'es' | 'en';
    onClose: () => void;
}

export default function ProjectDrawer({ project, lang, onClose }: ProjectDrawerProps) {
    useEffect(() => {
        if (!project) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [project, onClose]);

    return (
        <AnimatePresence>
            {project && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pd-backdrop"
                        onClick={onClose}
                    />

                    <motion.aside
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="pd-drawer"
                        style={{ ['--accent' as string]: project.accentColor }}
                    >
                        <div className="pd-drawer-inner">
                            {/* Header */}
                            <div className="pd-header">
                                <div>
                                    <div className="pd-num">{project.num} — {project.categoryLabel[lang]}</div>
                                    <h2 className="pd-title">
                                        {project.title}
                                        {project.titleAccent && (
                                            <span style={{ color: project.accentColor }}> {project.titleAccent}</span>
                                        )}
                                    </h2>
                                    <p className="pd-tagline" style={{ color: project.accentColor }}>
                                        {lang === 'es' ? 'El problema: ' : 'The problem: '}{project.problem[lang]}
                                    </p>
                                </div>
                                <button onClick={onClose} className="pd-close" aria-label="Close">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Media — 3D + optional desktop slides */}
                            {project.media3D && (
                                <div className="pd-media">
                                    {project.media3D()}
                                </div>
                            )}

                            {/* Description */}
                            <div className="pd-block">
                                <div className="pd-section-lbl">
                                    {lang === 'es' ? 'Resumen' : 'Overview'}
                                </div>
                                <p className="pd-desc">{project.description[lang]}</p>
                            </div>

                            {/* Features */}
                            {project.features.length > 0 && (
                                <div className="pd-block">
                                    <div className="pd-section-lbl">
                                        {lang === 'es' ? 'Características clave' : 'Key features'}
                                    </div>
                                    <ul className="pd-features">
                                        {project.features.map((f, i) => (
                                            <li key={i}>
                                                <span className="pd-feature-arrow" style={{ color: project.accentColor }}>→</span>
                                                <span>{f[lang]}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Architecture */}
                            <div className="pd-block">
                                <div className="pd-section-lbl">
                                    {lang === 'es' ? 'Arquitectura' : 'Architecture'}
                                </div>
                                <p className="pd-arch">{project.architecture[lang]}</p>
                            </div>

                            {/* Tags */}
                            {project.techTags.length > 0 && (
                                <div className="pd-block">
                                    <div className="pd-section-lbl">
                                        {lang === 'es' ? 'Stack' : 'Stack'}
                                    </div>
                                    <div className="pd-tags">
                                        {project.techTags.map(t => (
                                            <span key={t} className="pd-tag">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links */}
                            {(project.githubUrl || project.liveUrl) && (
                                <div className="pd-links">
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pd-link">
                                            <Github size={14} />
                                            {lang === 'es' ? 'Ver en GitHub' : 'View on GitHub'}
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="pd-link">
                                            <ExternalLink size={14} />
                                            {lang === 'es' ? 'Ver en vivo' : 'View live'}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

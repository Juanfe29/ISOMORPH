"use client";

import { ReactNode } from 'react';
import BoatyPhone3D from '../components/BoatyPhone3D';
import VisionMedia13D from '../components/VisionMedia13D';
import VisionMedia23D from '../components/VisionMedia23D';
import PrecisionBanking3D from '../components/PrecisionBanking3D';
import { DesktopSlide } from '../components/BoatyDesktopSlider';

export type ProjectCategory = 'all' | 'ai' | 'ml' | 'marketplace' | 'fintech';

export interface ProjectI18n {
    es: string;
    en: string;
}

export interface Project {
    slug: string;
    num: string;
    title: string;
    titleAccent?: string;
    accentColor: string;
    accentRgba: string;
    categories: Exclude<ProjectCategory, 'all'>[];
    categoryLabel: ProjectI18n;
    /** Problem-first hook (1 line) shown on the card */
    problem: ProjectI18n;
    /** Short solution sentence */
    tagline: ProjectI18n;
    /** Long-form description shown in the drawer */
    description: ProjectI18n;
    architecture: ProjectI18n;
    features: ProjectI18n[];
    techTags: string[];
    githubUrl?: string;
    liveUrl?: string;
    /** 3D component used as media fallback until image assets are provided */
    media3D?: () => ReactNode;
    /** Optional desktop slides (e.g. Boaty) shown inside the drawer */
    desktopSlides?: DesktopSlide[];
    /** When true, render as a "coming soon" placeholder card */
    comingSoon?: boolean;
    /** Bento span — controls grid footprint */
    span?: 'sm' | 'md' | 'lg';
}

export const boatyDesktopSlides: DesktopSlide[] = [
    { type: 'image', src: '/b71702ce-6867-48fe-a289-1cfeeb4fab7a.jpg', label: 'Boaty', caption: 'Vista del producto' },
    { type: 'image', src: '/5615f3b7-8bfb-421f-927e-dac42e655fe1.jpg', label: 'Reservas', caption: 'Gestión de reservas en tiempo real' },
    { type: 'image', src: '/a693bdae-b84c-4085-865b-1c39c732cdf6.jpg', label: 'Boaty Admin', caption: 'Panel de administración' },
    { type: 'image', src: '/3c4c92c2-7aa9-4b4d-96fd-6f2653cde1be.jpg', label: 'Mobile', caption: 'Experiencia móvil' },
];

export const projects: Project[] = [
    {
        slug: 'boaty',
        num: '01',
        title: 'BOATY',
        accentColor: '#c8522a',
        accentRgba: 'rgba(200,82,42,1)',
        categories: ['marketplace'],
        categoryLabel: {
            es: 'Producto Propio · App Móvil & Web',
            en: 'Own Product · Mobile & Web',
        },
        problem: {
            es: 'Reservar un bote es un caos.',
            en: 'Booking a boat is a nightmare.',
        },
        tagline: {
            es: 'Marketplace náutico premium con reserva instantánea y gestión de flota.',
            en: 'Premium nautical marketplace with instant booking and fleet management.',
        },
        description: {
            es: 'Los operadores náuticos en destinos turísticos gestionan sus reservas por WhatsApp, efectivo y hojas de cálculo. Los turistas no tienen forma de encontrarlos, compararlos ni pagarles online. Boaty resuelve ambos lados: marketplace premium con reserva instantánea, pagos seguros y gestión de flota para proveedores.',
            en: 'Nautical operators at tourist destinations manage bookings via WhatsApp, cash and spreadsheets. Tourists have no way to find, compare or pay them online. Boaty solves both sides: a premium marketplace with instant booking, secure payments and fleet management for providers.',
        },
        architecture: {
            es: 'React Native + Expo Router · Node.js · PostgreSQL · Stripe Connect · Geolocalización en tiempo real · Push notifications',
            en: 'React Native + Expo Router · Node.js · PostgreSQL · Stripe Connect · Real-time geolocation · Push notifications',
        },
        features: [
            { es: 'Marketplace bilateral con verificación de proveedores', en: 'Two-sided marketplace with provider verification' },
            { es: 'Reservas en tiempo real y geolocalización', en: 'Real-time bookings and geolocation' },
            { es: 'Pagos integrados con Stripe Connect', en: 'Integrated payments with Stripe Connect' },
            { es: 'Panel de administración para gestión de flota', en: 'Admin panel for fleet management' },
            { es: 'Apps nativas iOS & Android', en: 'Native iOS & Android apps' },
        ],
        techTags: ['React Native', 'Expo', 'Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'WebSockets'],
        githubUrl: 'https://github.com/mapube16/Boaty',
        liveUrl: 'https://boaty-production.up.railway.app/',
        media3D: () => <BoatyPhone3D />,
        desktopSlides: boatyDesktopSlides,
        span: 'lg',
    },
    {
        slug: 'vision-media-1',
        num: '02',
        title: 'VISION MEDIA',
        titleAccent: '1.0',
        accentColor: '#c8522a',
        accentRgba: 'rgba(200,82,42,1)',
        categories: ['ai'],
        categoryLabel: {
            es: 'AI · Social Media Automation',
            en: 'AI · Social Media Automation',
        },
        problem: {
            es: 'Crear contenido toma demasiado tiempo.',
            en: 'Content creation takes too much time.',
        },
        tagline: {
            es: 'Pipeline autónomo de contenido para Instagram, on-brand y a escala.',
            en: 'Autonomous Instagram content pipeline, on-brand at scale.',
        },
        description: {
            es: 'Un equipo de marketing invertía 40+ horas semanales generando contenido para Instagram — sin consistencia de marca y con resultados impredecibles. Vision Media 1.0 automatiza el pipeline completo: la IA lee la estrategia de marca y genera, programa y publica Posts, Stories y Reels en piloto automático.',
            en: 'A marketing team was spending 40+ hours per week creating Instagram content — with inconsistent branding and unpredictable results. Vision Media 1.0 automates the full pipeline: the AI reads the brand strategy and generates, schedules and publishes Posts, Stories and Reels on autopilot.',
        },
        architecture: {
            es: 'Clean Architecture · Async generation · Social adapter (social_adapter.py) · API docs /docs · Roadmap: Runway/Luma Reels, Analytics Dashboard, Multi-Tenant',
            en: 'Clean Architecture · Async generation · Social adapter (social_adapter.py) · API docs /docs · Roadmap: Runway/Luma Reels, Analytics Dashboard, Multi-Tenant',
        },
        features: [
            { es: 'Generación multi-formato: Feed Posts, Stories y Reels', en: 'Multi-format generation: Feed Posts, Stories and Reels' },
            { es: 'Dashboard React para gestión visual de campañas', en: 'React dashboard for visual campaign management' },
            { es: 'Adaptadores modulares: Instagram Graph API + Ayrshare', en: 'Modular adapters: Instagram Graph API + Ayrshare' },
            { es: 'Tasks asíncronas en background — UI siempre ágil', en: 'Async background tasks — UI always responsive' },
            { es: 'PostgreSQL para posts, campañas y tokens', en: 'PostgreSQL for posts, campaigns and tokens' },
        ],
        techTags: ['Python', 'FastAPI', 'AsyncPG', 'React', 'Vite', 'TailwindCSS', 'PostgreSQL', 'Docker', 'Gemini API', 'Pydantic'],
        githubUrl: 'https://github.com/Juanfe29/Instagram-automation-AI-generated-content',
        media3D: () => <VisionMedia13D />,
        span: 'md',
    },
    {
        slug: 'vision-media-2',
        num: '03',
        title: 'VISION MEDIA',
        titleAccent: '2.0',
        accentColor: '#3a8ab8',
        accentRgba: 'rgba(58,138,184,1)',
        categories: ['ai'],
        categoryLabel: {
            es: 'AI · Email Marketing Automation',
            en: 'AI · Email Marketing Automation',
        },
        problem: {
            es: 'El email masivo ya no convierte.',
            en: 'Mass email no longer converts.',
        },
        tagline: {
            es: 'Outreach hiper-personalizado por IA, escrito uno a uno a escala.',
            en: 'AI-powered hyper-personalized outreach, written one-to-one at scale.',
        },
        description: {
            es: 'Mandar el mismo email a miles de contactos genera tasas de apertura del 8% y spam. Vision Media 2.0 hace lo contrario: analiza cada lead individualmente — historial, industria, comportamiento — y redacta un email que parece escrito a mano. Resultado: outreach que escala sin perder el toque humano.',
            en: 'Blasting the same email to thousands of contacts yields 8% open rates and spam flags. Vision Media 2.0 does the opposite: it analyzes each lead individually — history, industry, behavior — and writes an email that feels handcrafted. Result: outreach that scales without losing the human touch.',
        },
        architecture: {
            es: 'Serverless Functions · LangChain · Vector Database (Pinecone) · SendGrid/Resend API Integration',
            en: 'Serverless Functions · LangChain · Vector Database (Pinecone) · SendGrid/Resend API Integration',
        },
        features: [
            { es: 'Micro-segmentación basada en LLMs', en: 'LLM-based micro-segmentation' },
            { es: 'A/B Testing autónomos generados por IA', en: 'Autonomous AI-generated A/B Testing' },
            { es: 'Sistema anti-spam y rotación de IPs', en: 'Anti-spam system & IP rotation' },
        ],
        techTags: ['TypeScript', 'Next.js', 'LangChain', 'Pinecone', 'SendGrid', 'OpenAI'],
        media3D: () => <VisionMedia23D />,
        span: 'md',
    },
    {
        slug: 'precision-banking',
        num: '04',
        title: 'PRECISION',
        titleAccent: 'BANKING',
        accentColor: '#50a050',
        accentRgba: 'rgba(80,160,80,1)',
        categories: ['ml', 'fintech'],
        categoryLabel: {
            es: 'Machine Learning · Fintech',
            en: 'Machine Learning · Fintech',
        },
        problem: {
            es: 'El banco llamaba a todos por igual.',
            en: 'The bank was calling everyone the same way.',
        },
        tagline: {
            es: 'ML que predice qué clientes convertirán antes de marcarles el teléfono.',
            en: 'ML that predicts which clients will convert before you dial.',
        },
        description: {
            es: 'Un banco ejecutaba campañas de marketing sin saber quién realmente convertiría. Llamadas en frío al 100% de la cartera, con una tasa de éxito del 11%. Precision Banking predice — antes del contacto — qué clientes tienen alta probabilidad de suscribirse a un depósito a plazo fijo, permitiendo enfocar los recursos donde importa.',
            en: 'A bank was running marketing campaigns without knowing who would actually convert. Cold-calling 100% of the portfolio with an 11% success rate. Precision Banking predicts — before contact — which clients are likely to subscribe to a term deposit, letting the team focus resources where they matter.',
        },
        architecture: {
            es: 'Scikit-Learn Pipeline · XGBoost Classifier · Streamlit UI · Pandas/Seaborn Analytics · CI/CD (GitHub Actions)',
            en: 'Scikit-Learn Pipeline · XGBoost Classifier · Streamlit UI · Pandas/Seaborn Analytics · CI/CD (GitHub Actions)',
        },
        features: [
            { es: 'Modelo XGBoost con Hyperparameter Tuning (GridSearch)', en: 'XGBoost Model with Hyperparameter Tuning (GridSearch)' },
            { es: 'SMOTE para balanceo de clases (Alta precisión en "Sí")', en: 'SMOTE for class balancing (High precision on "Yes")' },
            { es: 'Dashboard en tiempo real para analistas de marketing', en: 'Real-time dashboard for marketing analysts' },
        ],
        techTags: ['Python', 'Scikit-Learn', 'XGBoost', 'Streamlit', 'Pandas', 'Matplotlib'],
        githubUrl: 'https://github.com/Juanfe29/Precision-Banking-ML-Prediction/tree/main',
        media3D: () => <PrecisionBanking3D />,
        span: 'md',
    },
    {
        slug: 'coming-soon',
        num: '05',
        title: 'COMING SOON',
        accentColor: '#ffffff',
        accentRgba: 'rgba(255,255,255,1)',
        categories: ['ai'],
        categoryLabel: {
            es: 'En desarrollo',
            en: 'In development',
        },
        problem: {
            es: 'El próximo problema, en construcción.',
            en: 'The next problem, under construction.',
        },
        tagline: {
            es: 'Próximo lanzamiento',
            en: 'Next release',
        },
        description: {
            es: 'Estamos construyendo el siguiente caso de estudio. Mantente cerca.',
            en: 'We are building the next case study. Stay tuned.',
        },
        architecture: { es: '—', en: '—' },
        features: [],
        techTags: [],
        comingSoon: true,
        span: 'sm',
    },
];

export const filterCategories: { id: ProjectCategory; label: ProjectI18n }[] = [
    { id: 'all', label: { es: 'Todos', en: 'All' } },
    { id: 'ai', label: { es: 'AI', en: 'AI' } },
    { id: 'ml', label: { es: 'ML', en: 'ML' } },
    { id: 'marketplace', label: { es: 'Marketplace', en: 'Marketplace' } },
    { id: 'fintech', label: { es: 'Fintech', en: 'Fintech' } },
];

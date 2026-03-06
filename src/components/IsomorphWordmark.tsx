'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IsomorphLogo from './IsomorphLogo';

interface IsomorphWordmarkProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    dark?: boolean;
    animated?: boolean;
    className?: string;
    showSubtext?: boolean;
}

export default function IsomorphWordmark({
    size = 'md',
    dark = true,
    animated = true,
    className = "",
    showSubtext = false,
}: IsomorphWordmarkProps) {
    const sizeMap = {
        sm: { logo: 32, mobileLogo: 32, text: 'text-2xl', sub: 'text-[7px]' },
        md: { logo: 48, mobileLogo: 48, text: 'text-4xl', sub: 'text-[8px]' },
        lg: { logo: 64, mobileLogo: 48, text: 'text-6xl', sub: 'text-[9px]' },
        xl: { logo: 80, mobileLogo: 48, text: 'text-4xl md:text-7xl', sub: 'text-[8px] md:text-[10px]' },
    };

    const currentSize = sizeMap[size];
    const textColor = dark ? 'text-[#e8e4dc]' : 'text-[#0f0f0f]';
    const subColor = dark ? 'text-[#e8e4dc]/40' : 'text-[#0f0f0f]/40';

    const [resolvedLogoSize, setResolvedLogoSize] = useState(currentSize.logo);

    useEffect(() => {
        const update = () => {
            setResolvedLogoSize(window.innerWidth < 768 ? currentSize.mobileLogo : currentSize.logo);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [currentSize.logo, currentSize.mobileLogo]);

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div className="flex items-center gap-3">
                <motion.span
                    initial={animated ? { opacity: 0, x: -10 } : {}}
                    animate={animated ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`font-condensed font-bold uppercase tracking-[0.07em] leading-none ${currentSize.text} ${textColor}`}
                >
                    IS
                </motion.span>

                <IsomorphLogo
                    size={resolvedLogoSize}
                    dark={dark}
                    animated={animated}
                    className="relative -top-1"
                />

                <motion.span
                    initial={animated ? { opacity: 0, x: 10 } : {}}
                    animate={animated ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`font-condensed font-bold uppercase tracking-[0.07em] leading-none ${currentSize.text} ${textColor}`}
                >
                    MORPH
                </motion.span>
            </div>

            {showSubtext && (
                <motion.div
                    initial={animated ? { opacity: 0, y: 5 } : {}}
                    animate={animated ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className={`hidden sm:block font-mono uppercase tracking-[0.38em] whitespace-nowrap ${currentSize.sub} ${subColor}`}
                >
                    GRAPH INTELLIGENCE · TECHNOLOGY
                </motion.div>
            )}
        </div>
    );
}

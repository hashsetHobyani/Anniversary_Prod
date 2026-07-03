'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './graphic.module.css';
import { useScene } from '@/app/SceneContext';
import { ImageService, WordService } from '@/service/service';
import { Keyword } from '@/types/ViewModels';
import { motion, AnimatePresence } from 'framer-motion';
import MusicIslandComponent from '../music-component/music';

export default function GraphicMainComponent() {
    const { setScene } = useScene();
    const [visibleKeywords, setVisibleKeywords] = useState<Keyword[]>([]);
    const [progressIndex, setProgressIndex] = useState(0);
    const [pulsingImg, setPulsingImg] = useState<number | null>(null);
    const [animDone, setAnimDone] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const keywords = WordService.getKeywords();
    const Images = ImageService.getGraphic2Image();
    const totalImages = 6;

    // ── image pulse animation (runs once on mount) ──
    useEffect(() => {
        let current = 0;

        const pulseNext = () => {
            if (current >= totalImages) {
                setPulsingImg(null);
                setAnimDone(true);
                return;
            }
            setPulsingImg(current);
            current++;
            // grow(300ms) + shrink(300ms) + gap(150ms) = 750ms per image
            setTimeout(pulseNext, 750);
        };

        const startDelay = setTimeout(pulseNext, 400);
        return () => clearTimeout(startDelay);
    }, []);
// auto-scroll right panel when new keyword appears
    useEffect(() => {
        if (visibleKeywords.length === 0) return;

        // on mobile the container scrolls, on desktop .right scrolls
        const isMobile = window.innerWidth <= 1024;

        if (isMobile && containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        } else if (rightRef.current) {
            rightRef.current.scrollTo({
                top: rightRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [visibleKeywords]);
    // ── progressive keyword reveal (starts after image anim) ──
    useEffect(() => {
        if (!animDone) return;

        if (progressIndex >= keywords.length) {
            const timer = setTimeout(() => setScene("contentSummary"), 3000);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setVisibleKeywords(prev => [...prev, keywords[progressIndex]]);
            setProgressIndex(prev => prev + 1);
        }, 2500);

        return () => clearTimeout(timer);
    }, [progressIndex, animDone]);

    return (
        <section className={styles.container} ref={containerRef}>
            {/* LEFT IMAGE GRID */}
            <div className={styles.leftGrid}>
                <div className={styles.grid}>
                    {Images.map((src, i) => (
                        <motion.div
                            key={i}
                            className={`${styles.imgCell} ${animDone ? styles.imgCellDone : ''}`}
                            animate={pulsingImg === i
                                ? { scale: [1, 1.08, 1] }
                                : { scale: 1 }
                            }
                            transition={pulsingImg === i
                                ? { duration: 0.6, ease: 'easeInOut' }
                                : { duration: 0.3 }
                            }
                        >
                            <img
                                src={src}
                                alt=""
                                aria-hidden="true"
                                className={styles.imgFill}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* RIGHT TEXT AREA */}
            <div className={styles.right}  ref={rightRef}>
                <div className={styles.keywordGrid}>
                <AnimatePresence>
                    {visibleKeywords.map((item) => (
                        <motion.div
                            key={item.id}
                            className={styles.keywordBlock}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <p className={styles.keywordLine}>
                                <b>{item.keyword}</b>
                                {' — '}
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence></div>
            </div>
            {/* BOTTOM */}
            <div className={styles.bottomTimer}>
                still becoming something beautiful...
                {/* ── ROW 3: music island ── */}
                <MusicIslandComponent src={'/music/always.mp3'} artist={'Daniel Caeser'} title={'Always'} showIsland={true}/>

            </div>
              
        </section>
    );
}
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './graphic.module.css';
import { useScene } from '@/app/SceneContext';
import { ImageService, WordService } from '@/service/service';
import { motion, AnimatePresence } from 'framer-motion';
import MusicIslandComponent from '../music-component/music';
import { SummaryService } from '@/service/summary.service';

export default function GraphicMainComponent() {
    const { setScene } = useScene();
    const [pulsingImg, setPulsingImg] = useState<number | null>(null);
    const [animDone, setAnimDone] = useState(false);
    const [unlockedCount, setUnlockedCount] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const keywords = WordService.getKeywords();
    const Images = ImageService.getGraphic2Image();
    const totalImages = Images.length;
    const REVEAL_INTERVAL = 2200;

    // ── image pulse ──
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
            setTimeout(pulseNext, 750);
        };
        const t = setTimeout(pulseNext, 400);
        return () => clearTimeout(t);
    }, []);

    // ── progressive keyword reveal ──
    useEffect(() => {
        if (!animDone) return;
        if (unlockedCount >= keywords.length) return;

        const t = setTimeout(() => {
            setUnlockedCount(prev => prev + 1);
            setActiveSlide(unlockedCount);
        }, REVEAL_INTERVAL);

        return () => clearTimeout(t);
    }, [animDone, keywords.length, unlockedCount]);

    useEffect(() => {
    if (animDone) {
        SummaryService.getSummary().catch(() => {});
        }
    }, [animDone]);
    // ── manual nav ──
    const canPrev = activeSlide > 0;
    const canNext = activeSlide < unlockedCount - 1;
    const isLastSlide = activeSlide === keywords.length - 1
        && unlockedCount >= keywords.length;

    const scroll = (dir: 'prev' | 'next') => {
        if (dir === 'next') {
            if (isLastSlide) {
                setScene("contentSummary");
                return;
            }
            setActiveSlide(prev => Math.min(unlockedCount - 1, prev + 1));
        } else {
            setActiveSlide(prev => Math.max(0, prev - 1));
        }
    };

    const currentKeyword = keywords[activeSlide];

    return (
        <section className={styles.container} ref={containerRef}>

            {/* LEFT IMAGE GRID */}
            <div className={styles.leftGrid}>
                <div className={styles.leftHeading}>
                    <p className={styles.headingEyebrow}>our little world</p>
                    <h4 className={styles.bodyText}>
                        Watch Time Moving<br />Through Our Little<br />Responsibility
                    </h4>
                    <div className={styles.headingAccent} />
                    <p className={styles.kicker}>— Rhulani</p>
                </div>

                <div className={styles.grid}>
                    {Images.map((src, i) => (
                        <motion.div
                            key={i}
                            className={`${styles.imgCell} ${animDone ? styles.imgCellDone : ''}`}
                            animate={pulsingImg === i ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                            transition={pulsingImg === i
                                ? { duration: 0.6, ease: 'easeInOut' }
                                : { duration: 0.3 }
                            }
                        >
                            <img src={src} alt="" aria-hidden className={styles.imgFill} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* RIGHT — KEYWORD CAROUSEL */}
            <div className={styles.right}>
                {unlockedCount === 0 ? (
                    <div className={styles.carouselWaitingWrap}>
                        <div className={styles.carouselWaitingDot} />
                        <p className={styles.carouselWaiting}>
                            watch the images first...
                        </p>
                    </div>
                ) : (
                    <div className={styles.carousel}>

                        <AnimatePresence mode="wait">
                            {currentKeyword && (
                                <motion.div
                                    key={activeSlide}
                                    className={styles.carouselCard}
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                                >
                                    <span className={styles.carouselIndex}>
                                        {String(activeSlide + 1).padStart(2, '0')}
                                        <span style={{ opacity: 0.35 }}>
                                            {' / '}{String(keywords.length).padStart(2, '0')}
                                        </span>
                                    </span>
                                    <p className={styles.carouselKeyword}>
                                        {currentKeyword.keyword}
                                    </p>
                                    <p className={styles.carouselDesc}>
                                        {currentKeyword.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* dots */}
                        <div className={styles.carouselDots}>
                            {Array.from({ length: unlockedCount }, (_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.carouselDot} ${i === activeSlide ? styles.carouselDotActive : ''}`}
                                    onClick={() => setActiveSlide(i)}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                            {/* locked dots for unrevealed */}
                            {Array.from({ length: keywords.length - unlockedCount }, (_, i) => (
                                <span
                                    key={`locked-${i}`}
                                    className={styles.carouselDotLocked}
                                />
                            ))}
                        </div>

                        {/* nav buttons */}
                        <div className={styles.navButtons}>
                            <button
                                className={`${styles.navBtn} ${!canPrev ? styles.navBtnDisabled : ''}`}
                                onClick={() => scroll('prev')}
                                aria-label="Previous"
                                disabled={!canPrev}
                            >←</button>

                            <button
                                className={`${styles.navBtn} ${isLastSlide ? styles.navBtnEnd : ''} ${!canNext && !isLastSlide ? styles.navBtnDisabled : ''}`}
                                onClick={() => scroll('next')}
                                aria-label="Next"
                                disabled={!canNext && !isLastSlide}
                            >
                                {isLastSlide ? '→ continue' : '→'}
                            </button>
                        </div>

                        {/* hint when locked slides remain */}
                        {unlockedCount < keywords.length && (
                            <p className={styles.revealHint}>
                                {keywords.length - unlockedCount} more revealing...
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* BOTTOM */}
            <div className={styles.bottomTimer}>
                still becoming something beautiful...
                <MusicIslandComponent
                    src="/music/always.mp3"
                    artist="Daniel Caesar"
                    title="Always"
                    showIsland={true}
                />
            </div>
        </section>
    );
}
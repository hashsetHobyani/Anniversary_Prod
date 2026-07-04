'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './graphic.module.css';
import { useScene } from '@/app/SceneContext';
import { ImageService, WordService } from '@/service/service';
import { motion, AnimatePresence } from 'framer-motion';
import MusicIslandComponent from '../music-component/music';

export default function GraphicMainComponent() {
    const { setScene } = useScene();
    const [pulsingImg, setPulsingImg] = useState<number | null>(null);
    const [animDone, setAnimDone] = useState(false);
    const [unlockedCount, setUnlockedCount] = useState(0); // how many keywords revealed
    const [activeSlide, setActiveSlide] = useState(0);     // which keyword is showing
    const containerRef = useRef<HTMLDivElement>(null);
    const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
    const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userInterruptedRef = useRef(false);

    const keywords = WordService.getKeywords();
    const Images = ImageService.getGraphic2Image();
    const totalImages = Images.length;
    const REVEAL_INTERVAL = 2500;   // ms between keyword reveals
    const SLIDE_INTERVAL  = 4000;   // ms auto-advance carousel
    const INTERRUPT_BONUS = 6000;   // extra ms given when user taps nav
    const SCENE_DELAY     = 3000;   // ms after last keyword before next scene

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

    // ── progressive keyword reveal (after anim done) ──
    useEffect(() => {
        if (!animDone) return;
        if (unlockedCount >= keywords.length) return;

        const t = setTimeout(() => {
            setUnlockedCount(prev => prev + 1);
            setActiveSlide(unlockedCount); // show newest revealed keyword
        }, REVEAL_INTERVAL);

        return () => clearTimeout(t);
    }, [animDone, unlockedCount]);

    // ── auto-advance carousel (once keywords start showing) ──
    const resetAutoSlide = () => {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(() => {
            setActiveSlide(prev => {
                const next = prev + 1;
                if (next >= unlockedCount) return 0; // loop back
                return next;
            });
        }, SLIDE_INTERVAL);
    };

    useEffect(() => {
        if (unlockedCount === 0) return;
        resetAutoSlide();
        return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
    }, [unlockedCount]);

    // ── scene transition after all keywords revealed ──
    useEffect(() => {
        if (unlockedCount < keywords.length) return;

        const schedule = () => {
            if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
            sceneTimerRef.current = setTimeout(() => {
                setScene("contentSummary");
            }, userInterruptedRef.current ? INTERRUPT_BONUS : SCENE_DELAY);
        };

        schedule();
        return () => { if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current); };
    }, [unlockedCount]);

    // ── manual nav ──
    const canPrev = activeSlide > 0;
    const canNext = activeSlide < unlockedCount - 1;

    const scroll = (dir: 'prev' | 'next') => {
        userInterruptedRef.current = true;

        // reset scene timer to give extra time
        if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
        if (unlockedCount >= keywords.length) {
            sceneTimerRef.current = setTimeout(() => {
                setScene("contentSummary");
            }, INTERRUPT_BONUS);
        }

        // reset auto-slide
        resetAutoSlide();

        setActiveSlide(prev =>
            dir === 'prev'
                ? Math.max(0, prev - 1)
                : Math.min(unlockedCount - 1, prev + 1)
        );
    };

    const currentKeyword = keywords[activeSlide];

    return (
        <section className={styles.container} ref={containerRef}>

            {/* LEFT IMAGE GRID */}
            <div className={styles.leftGrid}>
                <h4 className={styles.bodyText}>
                    Watch Time Moving Through Our Little Responsibility...
                </h4>
                <p className={styles.kicker}>Rhulani</p>
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
                    <p className={styles.carouselWaiting}>
                        watch the images first...
                    </p>
                ) : (
                    <div className={styles.carousel}>

                        {/* card */}
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
                                        {String(activeSlide + 1).padStart(2, '0')} /
                                        {String(unlockedCount).padStart(2, '0')}
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
                                    onClick={() => {
                                        setActiveSlide(i);
                                        userInterruptedRef.current = true;
                                        resetAutoSlide();
                                        if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
                                        if (unlockedCount >= keywords.length) {
                                            sceneTimerRef.current = setTimeout(
                                                () => setScene("contentSummary"),
                                                INTERRUPT_BONUS
                                            );
                                        }
                                    }}
                                    aria-label={`Slide ${i + 1}`}
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
                                className={`${styles.navBtn} ${!canNext ? styles.navBtnDisabled : ''}`}
                                onClick={() => scroll('next')}
                                aria-label="Next"
                                disabled={!canNext}
                            >→</button>
                        </div>
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
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './graphic.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';
import { WordService } from '@/service/service';
import MusicIslandComponent from '../music-component/music';

const PHASES = WordService.getPhases();

const DURATIONS = [2200, 3800, 3800, 3800, 3800, 4500];

export default function GraphicIntroComponent() {
    const { setScene } = useScene();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showButton, setShowButton] = useState(false);
    const [textPhase, setTextPhase] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            for (let i = 0; i < PHASES.length; i++) {
                if (cancelled) return;
                setTextPhase(i);
                await new Promise(r => setTimeout(r, DURATIONS[i]));
            }
            if (!cancelled) setTextPhase(-1); // all done
        };
        run();
        return () => { cancelled = true; };
    }, []);

    const handleVideoEnd = () => setShowButton(true);
    const goNext = () => setScene("graphicMain");

    const current = textPhase >= 0 ? PHASES[textPhase] : null;

    return (
        <motion.section
            className={styles.container}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1 }}
        >
            {/* background video */}
            <video
                ref={videoRef}
                className={styles.video}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
            >
                <source src="/videos/a-year-time-lapse.mp4" type="video/mp4" />
            </video>

            <div className={styles.overlay} />
        {/* ── GLASS MUSIC ISLAND ── */}
        <MusicIslandComponent src={'/music/good-days.mp3'} artist={'SZA'} title={'Good Days'} showIsland={false}/>
            {/* text */}
            <div className={styles.left}>
                <AnimatePresence mode="wait">
                    {current && (
                        <motion.div
                            key={current.id}
                            className={styles.phaseBlock}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                        >
                            {current.eyebrow && (
                                <p className={styles.eyebrow}>{current.eyebrow}</p>
                            )}
                            <p className={
                                current.id === 'kicker'
                                    ? styles.kicker
                                    : current.id === 'close'
                                        ? styles.closeText
                                        : styles.bodyText
                            }>
                                {current.body.split('\n').map((line, i, arr) => (
                                    <span key={i}>
                                        {line}
                                        {i < arr.length - 1 && <br />}
                                    </span>
                                ))}
                            </p>
                            {current.sub && (
                                <p className={styles.subLine}>{current.sub}</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* button — appears after video ends */}
                <AnimatePresence>
                    {showButton && (
                        <motion.div
                            className={styles.actionArea}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <button
                                className={styles.navBtn}
                                onClick={goNext}
                                aria-label="Continue"
                            >
                                →
                            </button>
                            <p className={styles.navBtnLabel}>see what a year meant to me</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
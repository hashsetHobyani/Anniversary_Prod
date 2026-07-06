'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './graphic.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';
import { WordService } from '@/service/service';
import MusicIslandComponent from '../music-component/music';

const PHASES = WordService.getPhases();

const DURATIONS = [2200, 3800, 3800, 3800, 3800, 4500];

const VIDEO_TIMEOUT_MS = 6000;

export default function GraphicIntroComponent() {
    const { setScene } = useScene();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showButton, setShowButton] = useState(false);
    const [textPhase, setTextPhase] = useState(0);
    const [videoFailed, setVideoFailed] = useState(false);
    const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            for (let i = 0; i < PHASES.length; i++) {
                if (cancelled) return;
                setTextPhase(i);
                await new Promise(r => setTimeout(r, DURATIONS[i]));
            }
            if (!cancelled) setTextPhase(-1);
        };
        run();
        return () => { cancelled = true; };
    }, []);

    // fallback timer — if video hasn't started playing after N seconds, show button
    useEffect(() => {
        fallbackTimerRef.current = setTimeout(() => {
            setVideoFailed(true);
            setShowButton(true);
        }, VIDEO_TIMEOUT_MS);

        return () => {
            if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        };
    }, []);

    const handleVideoPlaying = () => {
        // video started — cancel fallback timer
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        setVideoFailed(false);
    };

    const handleVideoEnd = () => setShowButton(true);

    const handleVideoError = () => {
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        setVideoFailed(true);
        setShowButton(true);
    };

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
            {!videoFailed ? (
                <video
                    ref={videoRef}
                    className={styles.video}
                    autoPlay
                    muted
                    playsInline
                    onPlaying={handleVideoPlaying}
                    onEnded={handleVideoEnd}
                    onError={handleVideoError}
                    onStalled={handleVideoError}
                >
                    <source src="/videos/a-year-time-lapse.mp4" type="video/mp4" />
                </video>
            ) : (
                // fallback background when video fails
                <div className={styles.videoFallback} />
            )}

            <div className={styles.overlay} />

            <MusicIslandComponent
                src="/music/good-days.mp3"
                artist="SZA"
                title="Good Days"
                showIsland={false}
            />

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
                            <p className={styles.navBtnLabel}>
                                {videoFailed
                                    ? 'continue'
                                    : 'see what a year meant to me'
                                }
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './countdown.module.css';
import ParticlesScene from '../Particles-component/particles';
import { TimerService } from '@/service/time.service';
import { TimerDto } from '@/types/ViewModels';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';
import MusicIslandComponent from '../music-component/music';
import { Group, Loader,Text } from '@mantine/core';
import { InfoIcon } from '@phosphor-icons/react';


export default function CountDowncomponent() {
    const [timer, setTimer] = useState<TimerDto | null>(null);
    const [now, setNow] = useState(new Date());
    const [testSecondsLeft, setTestSecondsLeft] = useState<number | null>(null);
    const firedConfetti = useRef(false);
    const scrollTriggered = useRef(false);

    const { setScene } = useScene();

    useEffect(() => {
        const load = async () => {
            const data = await TimerService.getTimer();
            setTimer(data);

            if (!data.isActive) {
                setTestSecondsLeft(10);
            }
        };
        load();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (testSecondsLeft === null) return; // not in test mode
        if (testSecondsLeft <= 0) return;     // already fired

        const timeout = setTimeout(() => {
            setTestSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [testSecondsLeft]);

    // Derive values — test mode overrides isComplete when countdown hits 0
    const start = timer ? new Date(timer.dateStart) : null;
    const end = timer ? new Date(timer.dateEnd) : null;

    const diffToStart = start ? Math.max(0, now.getTime() - start.getTime()) : 0;
    const diffToEnd = end ? end.getTime() - now.getTime() : 1;

    const testModeComplete = testSecondsLeft !== null && testSecondsLeft <= 0;
    const isComplete = timer ? (diffToEnd <= 0 || testModeComplete) : false;

    useEffect(() => {
        if (!timer || !isComplete || firedConfetti.current) return;

        firedConfetti.current = true;
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 }
        });
    }, [isComplete, timer]);

    useEffect(() => {
        if (!timer || !isComplete) return;

        const handleScroll = () => {
            if (scrollTriggered.current) return;
            scrollTriggered.current = true;

            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });

            setTimeout(() => {
                setScene("dictionary");
            }, 1200);
        };

        window.addEventListener('wheel', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, [isComplete, timer, setScene]);

    if (!timer) return null;

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / (1000 * 60)) % 60;
        const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
        const remDays = days % 365;
        return { years, days: remDays, hours, minutes, seconds };
    };

    const progress = formatTime(diffToStart);

if (!progress) {
    return (
        <section className={styles.container} style={{ background: '#0a0a0a' }}>
            <Group justify="center" align="center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader color="white" size="md" type="dots" />
                <Text size="sm" c="dimmed">getting ready, Please wait...</Text>
            </Group>
        </section>
    );
}
    return (
        <AnimatePresence mode="wait">
            <motion.section
                className={styles.intro}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -120, opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <ParticlesScene />
                <MusicIslandComponent src={'/music/Superpowers.mp3'} artist={'Daniel Caeser'} title={'Superpowers'} showIsland={false}/>
                <div className={styles.overlay} />

                <div className={styles.content}>
                    {!isComplete ? (
                        <>
                            <h1 className={styles.title}>Time Together</h1>

                            <div className={styles.timer}>
                                {progress.years > 0 && <div>{progress.years}y</div>} 
                                <div>{progress.days}d</div>
                                <div>{progress.hours}h</div>
                                <div>{progress.minutes}m</div>
                                <div>{progress.seconds}s</div>
                            </div>

                            <p className={styles.subtitle}>{timer.timerName}</p>

                            {testSecondsLeft !== null && testSecondsLeft > 0 && (
                                <div className={styles.devBanner}>
                                    🧪 Test mode activating in {testSecondsLeft}s
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <motion.h1
                                className={styles.titleComplete}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                🎉 Happy Anniversary
                            </motion.h1>

                            <div className={styles.timer}>
                                <div>{progress.years}y</div>
                                <div>{progress.days}d</div>
                                <div>{progress.hours}h</div>
                                <div>{progress.minutes}m</div>
                                <div>{progress.seconds}s</div>
                            </div>
                            <div className={styles.swipeHint}>
                               <InfoIcon/>  Tap to Play Music
                            </div>
                            <div className={styles.swipeHint}>
                                ↓ Swipe / Scroll to continue
                            </div>
                        </>
                    )}
                </div>
            </motion.section>
        </AnimatePresence>
    );
}
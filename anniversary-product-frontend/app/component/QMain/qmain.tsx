
'use client';

import { useEffect, useState } from 'react';
import styles from './qmain.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';
import { TimerService } from '@/service/time.service';
import { TimerDto } from '@/types/ViewModels';
import MusicIslandComponent from '../music-component/music';

export default function QMainComponent() {
    const { setScene } = useScene();

    const [stage, setStage] = useState<
        "intro" | "normal" | "no1" | "no2" | "no3" | "no4" | "dark" | "redemption"
    >("intro");

    const [noClicks, setNoClicks] = useState(0);

    const handleYes = () => setScene("qYes");

    const handleNo = () => {
        const next = noClicks + 1;
        setNoClicks(next);
        if (next === 1) setStage("no1");
        if (next === 2) setStage("no2");
        if (next === 3) setStage("no3");
        if (next >= 4) {
            setStage("dark");
            setTimeout(() => setStage("redemption"), 5000);
        }
    };

    const subMessages: Record<string, string> = {
        intro:  '',
        normal: '',
        no1:    'are you sure about that?',
        no2:    'take another look...',
        no3:    'one more chance.',
        dark:   '',
        redemption: '',
    };
    
const [timer, setTimer] = useState<TimerDto | null>(null);
    const [now, setNow] = useState(new Date());
    const [loading, setLoading] = useState(false);

    // fetch timer
    useEffect(() => {
        const load = async () => {
            const data = await TimerService.getTimer();
            setTimer(data);
        };
        load();
    }, []);

    // clock tick
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!timer) return null;

    const start = new Date(timer.dateStart);

    const diffToStart = now.getTime() - start.getTime();

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

    return (
        <section className={styles.container}>

        {/* ── audio control — single source of truth ── */}
            {stage !== "dark" && stage !== "redemption" && (
                <MusicIslandComponent
                    key="sjava"
                    src="/music/Iphisi.mp3"
                    artist="Sjava"
                    title="Iphisi"
                    showIsland={false}
                />
            )}
            {(stage === "dark" || stage === "redemption") && (
                <MusicIslandComponent
                    key="avemaria"
                    src="/music/avemaria.mp3"
                    artist="Schubert"
                    title="Ave Maria"
                    showIsland={false}
                />
        )}
            <AnimatePresence mode="wait">
                {stage !== "dark" && stage !== "redemption" && (
                    <motion.div
                        key="normal"
                        className={styles.center}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        
                <div className={styles.eyebrow}>
                     <div className={styles.timer}>
                    <div>{progress.years}y</div>
                    <div>{progress.days}d</div>
                    <div>{progress.hours}h</div>
                    <div>{progress.minutes}m</div>
                    <div>{progress.seconds}s</div>
                </div> later</div>

                        <h1 className={styles.question}>
                            Does it feel like<br />one year?
                        </h1>

                        <p className={styles.subtext}>
                            {subMessages[stage] || '\u00A0'}
                        </p>

                        <div className={styles.buttons}>
                            <button className={styles.btnYes} onClick={handleYes}>
                                Yes
                            </button>
                            <button className={styles.btnNo} onClick={handleNo}>
                                No
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {stage === "no1" && (
                                <motion.div
                                    key="img1"
                                    className={styles.imageWrap}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    
                                    <img src="/images/old1.jpeg" className={styles.image} alt="" />
                                    <p className={styles.imageCaption}>remember this?</p>
                                </motion.div>
                            )}
                            {stage === "no2" && (
                                <motion.div
                                    key="img2"
                                    className={styles.imageWrap}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <img src="/images/old2.jpeg" className={styles.image} alt="" />
                                    <p className={styles.imageCaption}>and this one?</p>
                                </motion.div>
                            )}
                            {stage === "no3" && (
                                <motion.div
                                    key="img3"
                                    className={styles.imageWrap}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <img src="/images/old3.jpeg" className={styles.image} alt="" />
                                    <p className={styles.imageCaption}>this was us.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {stage === "dark" && (
                    <motion.div
                        key="dark"
                        className={styles.dark}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <img src="/images/graveyard.png" className={styles.darkImage} alt="" />
                        <p className={styles.darkText}>
                            well done. you killed us.<br />you really wanted this.
                        </p>
                    </motion.div>
                )}

                {stage === "redemption" && (
                    <motion.div
                        key="redemption"
                        className={styles.redemption}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
                        <h1 className={styles.topText}>
                            does it feel like<br />a year?
                        </h1>
                        <p className={styles.redemptionHint}>be honest this time.</p>
                        <button
                            className={styles.redemptionButton}
                            onClick={handleYes}
                        >
                            I take it back — yes
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </section>
    );
}
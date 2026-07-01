'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './content.module.css';
import { SummaryService } from '@/service/summary.service';
import { MessageStats } from '@/types/ViewModels';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';

import { LiaCommentsSolid } from "react-icons/lia";
import { FaImages, FaVideo, FaChartLine } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";
import MusicIslandComponent from '../music-component/music';

// bg colour + blob colours per slide
const SLIDE_THEMES = [
    { bg: '#0a0a0a',  blob1: '#1db954', blob2: '#7c3aed', blob3: '#f59e0b' }, // intro
    { bg: '#0d0a1a',  blob1: '#7c3aed', blob2: '#3b82f6', blob3: '#a855f7' }, // messages
    { bg: '#0a1a10',  blob1: '#10b981', blob2: '#1db954', blob3: '#34d399' }, // photos
    { bg: '#1a0a0a',  blob1: '#ef4444', blob2: '#f97316', blob3: '#fbbf24' }, // videos
    { bg: '#0a0f1a',  blob1: '#3b82f6', blob2: '#6366f1', blob3: '#8b5cf6' }, // pages
    { bg: '#1a150a',  blob1: '#f59e0b', blob2: '#f97316', blob3: '#fbbf24' }, // avg/day
    { bg: '#0f0a1a',  blob1: '#ec4899', blob2: '#8b5cf6', blob3: '#f43f5e' }, // peak day
    { bg: '#080808',  blob1: '#ffffff', blob2: '#94a3b8', blob3: '#cbd5e1' }, // final
];

const DURATIONS = [1900, 1900, 1900, 1900, 1900, 1900, 1900, 3100];

const slideVariants = {
    initial: { opacity: 0, scale: 0.94, y: 30 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        scale: 1.04,
        y: -20,
        transition: { duration: 0.4, ease: "easeIn" },
    },
} as const;

export default function ContentSummaryComponent() {
    const { setScene } = useScene();
    const [stats, setStats] = useState<MessageStats | null>(null);
    const [step, setStep] = useState(0);
    const hasRun = useRef(false);

    useEffect(() => {
        SummaryService.getSummary().then(setStats);
    }, []);

    useEffect(() => {
        if (!stats || hasRun.current) return;
        hasRun.current = true;

        let i = 1;
        const run = () => {
            if (i >= DURATIONS.length) {
                setTimeout(() => setScene("qMain"), 1800);
                return;
            }
            setStep(i);
            setTimeout(run, DURATIONS[i]);
            i++;
        };
        setStep(1);
        setTimeout(run, DURATIONS[0]);
    }, [stats, setScene]);

    if (!stats) return null;

    const theme = SLIDE_THEMES[Math.min(step, SLIDE_THEMES.length - 1)];
    const totalSlides = 7; // slides 1–7 (step 0 = intro)

    return (
        <section
            className={styles.container}
            style={{ background: theme.bg } as React.CSSProperties}
        >
            <MusicIslandComponent src={'/music/wetdreamz.mp3'} artist={'Jcole'} title={'Wet Dreamz'} showIsland={false}/>
            {/* animated blobs */}
            <div
                className={`${styles.blob} ${styles.blob1}`}
                style={{ '--blob1': theme.blob1 } as React.CSSProperties}
            />
            <div
                className={`${styles.blob} ${styles.blob2}`}
                style={{ '--blob2': theme.blob2 } as React.CSSProperties}
            />
            <div
                className={`${styles.blob} ${styles.blob3}`}
                style={{ '--blob3': theme.blob3 } as React.CSSProperties}
            />

            {/* progress dots */}
            {step > 0 && step < 8 && (
                <div className={styles.dots}>
                    {Array.from({ length: totalSlides }, (_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${step === i + 1 ? styles.dotActive : ''}`}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* INTRO */}
                {step === 0 && (
                    <motion.div
                        key="intro"
                        className={styles.introSlide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h1 className={styles.introTitle}>
                            Are you ready to see<br />what a year looks like?
                        </h1>
                        <p className={styles.introSub}>in numbers.</p>
                    </motion.div>
                )}

                {/* MESSAGES */}
                {step === 1 && (
                    <motion.div
                        key="messages"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>what we exchanged </p>
                        <div className={styles.slideIcon}><LiaCommentsSolid /></div>
                        <p className={styles.slideNumber}>
                            {stats.chatStats.count.toLocaleString()}
                        </p>
                        <p className={styles.slideLabel}>messages</p>
                        <p className={styles.slideSub}>every word, a little piece of us.</p>
                    </motion.div>
                )}

                {/* PHOTOS */}
                {step === 2 && (
                    <motion.div
                        key="photos"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>we captured & sent</p>
                        <div className={styles.slideIcon}><FaImages /></div>
                        <p className={styles.slideNumber}>
                            {stats.imageStats.count.toLocaleString()}
                        </p>
                        <p className={styles.slideLabel}>photos</p>
                        <p className={styles.slideSub}>moments worth keeping forever.</p>
                    </motion.div>
                )}

                {/* VIDEOS */}
                {step === 3 && (
                    <motion.div
                        key="videos"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>we recorded & sent </p>
                        <div className={styles.slideIcon}><FaVideo /></div>
                        <p className={styles.slideNumber}>
                            {stats.videoStats.count}
                        </p>
                        <p className={styles.slideLabel}>videos</p>
                        <p className={styles.slideSub}>laughter you can replay forever.</p>
                    </motion.div>
                )}

                {/* PAGES */}
                {step === 4 && (
                    <motion.div
                        key="pages"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>that fills</p>
                        <div className={styles.slideIcon}><IoDocumentTextOutline /></div>
                        <p className={styles.slideNumber}>
                            {stats.chatStats.pageCount}
                        </p>
                        <p className={styles.slideLabel}>pages</p>
                        <p className={styles.slideSub}>Each own story, written together.</p>
                    </motion.div>
                )}

                {/* AVG / DAY */}
                {step === 5 && (
                    <motion.div
                        key="avg"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>on average</p>
                        <div className={styles.slideIcon}><FaChartLine /></div>
                        <p className={styles.slideNumber}>
                            {stats.chatStats.averageMessagesPerDay}
                        </p>
                        <p className={styles.slideLabel}>messages every single day</p>
                        <p className={styles.slideSub}>consistency has never been this impressive .</p>
                    </motion.div>
                )}

                {/* PEAK DAY */}
                {step === 6 && (
                    <motion.div
                        key="peak"
                        className={styles.slide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.slideEyebrow}>Our biggest day had</p>
                        <div className={styles.slideIcon}><MdTrendingUp /></div>
                        <p className={styles.slideNumber}>
                            {stats.chatStats.busiestDayMessageCount}
                        </p>
                        <p className={styles.slideLabel}>messages in one day</p>
                        <p className={styles.slideSub}>Turns out we are big texters .</p>
                    </motion.div>
                )}

                {/* FINAL */}
                {step === 7 && (
                    <motion.div
                        key="final"
                        className={styles.finalSlide}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className={styles.finalBadge}>memory duration</p>
                        <p className={styles.finalDays}>{stats.totalMemoryDays}</p>
                        <p className={styles.finalDaysLabel}>days together</p>
                        <div className={styles.finalDivider} />
                        <p className={styles.finalDateRange}>
                            {stats.firstMemoryDate} → {stats.lastMemoryDate}
                        </p>
                        <p className={styles.finalTagline}>
                            a year that became something neither of us expected.
                        </p>
                    </motion.div>
                )}

            </AnimatePresence>
        </section>
    );
}
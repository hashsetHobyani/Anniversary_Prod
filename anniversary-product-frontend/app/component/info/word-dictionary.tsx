'use client';

import { useEffect, useState } from 'react';
import styles from './word.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/app/SceneContext';
import MusicIslandComponent from '../music-component/music';

const WORD = "anniversary";

export default function WordDictionaryComponent({ onNext }: { onNext?: () => void }) {
    const [exit, setExit] = useState(false);
    const { setScene } = useScene();

    const handleNext = () => setScene("graphicIntro");

    return (
        <AnimatePresence mode="wait">
            {!exit && (
                <motion.section
                    className={styles.container}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                    {/* ── ROW 1: GIF ── */}
                    <div className={styles.gifRow}>
                        <img
                            className={styles.bgMedia}
                            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWljZ2dyMGNzcWZqamJubWxoOXZtNW5qMjV2eGxncWVsaGFyeGo0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KjvlWLTmKqAww/giphy.gif"
                            alt=""
                            aria-hidden="true"
                        />
                    </div>

                    {/* ── ROW 2: dictionary entry + button ── */}
                    <div className={styles.contentRow}>
                        <div className={styles.left}>
                            {/* wave letters */}
                            <div className={styles.wordRow}>
                                {WORD.split("").map((char, i) => (
                                    <span
                                        key={i}
                                        className={styles.letter}
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.phonetic}>/ˌanəˈvərs(ə)rē/</div>

                            <div className={styles.partOfSpeech}>noun</div>

                            <hr className={styles.dividerLight} />

                            <div className={styles.definition}>
                                <b>1.</b> the yearly recurrence of the date of a past event,
                                especially one of personal or romantic significance.
                            </div>

                            <div className={styles.example}>
                                &quot;A year that became more than time — it became memory.&quot;
                            </div>
                        </div>

                        {/* button panel */}
                        <div className={styles.right}>
                            <button
                                className={styles.navBtn}
                                onClick={handleNext}
                                aria-label="Continue"
                            >
                                →
                            </button>
                            <span className={styles.navBtnLabel}>see what a year looks like</span>
                        </div>
                        {/* ── ROW 3: music island ── */}
                        <MusicIslandComponent src={'/music/annversary-start.mp3'} artist={'Toni Toni '} title={'Anniversary'}/>

                    </div>

                    
                </motion.section>
            )}
        </AnimatePresence>
    );
}
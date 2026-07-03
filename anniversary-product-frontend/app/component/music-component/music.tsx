'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './music.module.css';

type Props = {
    src: string;
    artist: string;
    title: string;
    albumArt?: string;
    loop?: boolean;
    volume?: number;
    showIsland?: boolean; 
};

export default function MusicIslandComponent({
    src,
    artist,
    title,
    albumArt = 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b',
    loop = true,
    volume = 0.35,
    showIsland = true, 
}: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    // attempt 1 — immediate (works if user already interacted)
    const tryPlay = () => {
        audio.play().catch(() => {
            // attempt 2 — wait for first touch/click then retry
            const retry = () => {
                audio.play().catch(() => {});
                window.removeEventListener('touchstart', retry);
                window.removeEventListener('click', retry);
            };
            window.addEventListener('touchstart', retry, { once: true, passive: true });
            window.addEventListener('click',      retry, { once: true });
        });
    };

    tryPlay();

    return () => {
        audio.pause();
        audio.src = '';
    };
}, [src, loop, volume]);



    if (!showIsland) return null;


    return (
        <div className={styles.musicRow}>
            <motion.div
                className={styles.islandWrap}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <div className={styles.islandPill}>
                    <img
                        className={styles.albumArt}
                        src={albumArt}
                        alt={`${title} album cover`}
                    />
                    <div className={styles.islandInfo}>
                        <span className={styles.islandTrack}>{title}</span>
                        <span className={styles.islandArtist}>{artist}</span>
                    </div>
                    <div className={styles.islandBars} aria-hidden="true">
                        <span /><span /><span /><span /><span />
                    </div>
                </div>
                <div className={styles.islandProgress}>
                    <div className={styles.islandProgressFill} />
                </div>
            </motion.div>
        </div>
    );
}
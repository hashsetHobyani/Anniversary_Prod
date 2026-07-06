'use client';
 
import { useState } from 'react';
import styles from './aboutcard.module.css';
import { IoInformationCircleOutline, IoCloseOutline } from 'react-icons/io5';
import { FaQuestion } from 'react-icons/fa';
import { Tooltip } from '@mantine/core';
 
type About = {
    heading: string;
    description: string;
    summary: string;
};
 
const tooltip: About = {
    heading: "About this app",
    description: "A full-stack cinematic memory timeline where a .NET backend and Next.js frontend transform your external exported data chats, images, and videos into an interactive experience and a Memory Instance holder transforming information and raw data into processed special information. The backend uses ASP.NET Core with PostgreSQL to store processed memories grouped by days, with media files on Cloudflare R2. It generates analytics like message counts, activity streaks, and busiest days. The frontend uses GSAP for animated sequences, Three.js for 3D particle effects, FullCalendar for the day-by-day timeline view, Howler.js for audio, and Canvas Confetti for milestone moments. The site adds the dyanmic ability to import new dataset and alter event name to make the app reusable for any special moment ",
    summary: "This app turns messages, photos, and videos ,calls into a beautiful memory system you can watch and explore. Open the calendar, Play around and click any day, to see what happened - your chats, pictures, and videos all in one place. It doesn't feel like a normal app; it feels like a movie about your memories.    (Try using the hint Feature to view suggested special memories)",
};
 
export default function AboutCardComponent() {

    const [opened, setOpened] = useState(true);
    const [showSimple, setShowSimple] = useState(false);

    return (
        <div className={styles.alertWrapper}>

            {/* ===================== */}
            {/* CLOSED STATE BUTTON */}
            {/* ===================== */}
            {!opened && (
                <Tooltip
                    label=" What is this About?"
                    position="left"
                    withArrow
                    openDelay={300}
                >
                    <button
                        className={styles.floatingAboutBtn}
                        onClick={() => setOpened(true)}
                    >
                        <FaQuestion size={14} />
                    </button>
                </Tooltip>
            )}

            {/* ===================== */}
            {/* OPEN STATE CARD */}
            {/* ===================== */}
            {opened && (
                <div className={styles.alert}>

                    <div className={styles.iconCol}>
                        <IoInformationCircleOutline size={22} />
                    </div>

                    <div className={styles.body}>

                        <div className={styles.topRow}>
                            <span className={styles.heading}>
                                {tooltip.heading}
                            </span>

                            <button
                                className={styles.closeBtn}
                                onClick={() => setOpened(false)}
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        </div>

                        <p className={styles.content}>
                            {showSimple ? tooltip.summary : tooltip.description}
                        </p>

                        <button
                            className={styles.toggleBtn}
                            onClick={() => setShowSimple(prev => !prev)}
                        >
                            {showSimple
                                ? "Show technical details"
                                : "Show simple summary"}
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}
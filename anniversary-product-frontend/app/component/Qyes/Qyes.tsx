'use client';

import { useEffect, useState } from 'react';
import styles from './Qyes.module.css';
import { TimerService } from '@/service/time.service';
import { TimerDto } from '@/types/ViewModels';
import { useRouter } from 'next/navigation';

import { FaWifi, FaLightbulb } from "react-icons/fa6";
import { BsBatteryFull } from "react-icons/bs";
import { MdSignalCellularAlt } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import MusicIslandComponent from '../music-component/music';

export default function QYesComponent() {
    const router = useRouter();
    const [timer, setTimer] = useState<TimerDto | null>(null);
    const [now, setNow] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        TimerService.getTimer().then(setTimer);
    }, []);


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
        const hours   = Math.floor(ms / (1000 * 60 * 60)) % 24;
        const days    = Math.floor(ms / (1000 * 60 * 60 * 24));
        const years   = Math.floor(days / 365);
        return { years, days: days % 365, hours, minutes, seconds };
    };

    const progress = formatTime(diffToStart);

    const handleGift = () => {
        setLoading(true);
        setTimeout(() => router.push("/calendar"), 1000);
    };

    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <section className={styles.container}>

            {/* page loader overlay */}
            {loading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.loaderSpinner} />
                    <p className={styles.loaderText}>Unlocking...</p>
                </div>
            )}

            {/* ── LEFT: iOS lockscreen ── */}
            <div className={styles.left}>
                <div className={styles.phoneOuter}>
                <div className={styles.phone}>

                    {/* background image */}
                    <img
                        src="/images/lockscreen.jpeg"
                        alt=""
                        className={styles.phoneBg}
                        aria-hidden="true"
                    />

                    {/* dim overlay */}
                    <div className={styles.phoneDim} />

                    {/* STATUS BAR */}
                    <div className={styles.statusBar}>
                        <span className={styles.carrier}>Vodacom</span>
                        <div className={styles.statusIcons}>
                            <MdSignalCellularAlt size={16} />
                            <FaWifi size={14} />
                            <BsBatteryFull size={18} />
                        </div>
                    </div>

                    {/* DATE + TIME */}
                    <div className={styles.clockArea}>
                        <p className={styles.lockDate}>{dateStr}</p>
                        <p className={styles.lockTime}>{timeStr}</p>
                    </div>

                    {/* MUSIC PLAYER — glass */}
                    <div className={styles.musicPlayer}>
                        <div className={styles.musicLeft}>
                            <img
                                src="https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b"
                                alt="Album"
                                className={styles.musicAlbum}
                            />
                            <div className={styles.musicInfo}>
                                <span className={styles.musicTrack}>Snooze</span>
                                <span className={styles.musicArtist}>SZA</span>
                            </div>
                        </div>
                        <div className={styles.musicBars} aria-hidden="true">
                            <span /><span /><span /><span /><span />
                        </div>

                        {/* progress */}
                        <div className={styles.musicProgress}>
                            <div className={styles.musicFill} />
                        </div>

                        {/* controls */}
                        <div className={styles.musicControls}>
                            <button className={styles.ctrlBtn} aria-label="Previous">⏮</button>
                            <button className={styles.ctrlBtn} aria-label="Pause">⏸</button>
                            <button className={styles.ctrlBtn} aria-label="Next">⏭</button>
                        </div>
                    </div>

                    {/* BOTTOM ACTIONS */}
                    <div className={styles.bottomActions}>
                        <button className={styles.iconBtn} aria-label="Torch">
                            <FaLightbulb size={20} />
                        </button>
                        <div className={styles.homeIndicator} />
                        <button className={styles.iconBtn} aria-label="Camera">
                            <IoCameraOutline size={22} />
                        </button>
                    </div>

                    {/* home pill */}
                    <div className={styles.homePill} />
                </div>
                </div>

            </div>

            {/* ── RIGHT: timer ── */}
            <div className={styles.right}>
                <p className={styles.timerLabel}>we have been us for</p>

                <div className={styles.timer}>
                    {[
                        { val: progress.years,   unit: 'yr'  },
                        { val: progress.days,    unit: 'd'   },
                        { val: progress.hours,   unit: 'h'   },
                        { val: progress.minutes, unit: 'm'   },
                        { val: progress.seconds, unit: 's'   },
                    ].map(({ val, unit }) => (
                        <div key={unit} className={styles.timerCell}>
                            <span className={styles.timerVal}>{String(val).padStart(2, '0')}</span>
                            <span className={styles.timerUnit}>{unit}</span>
                        </div>
                    ))}
                </div>

                <p className={styles.subtext}>Time never stops, my love.</p>

                <button className={styles.navBtn} onClick={handleGift} disabled={loading}>
                    →
                </button>
                <p className={styles.navBtnLabel}>see your gift</p>
            </div>
            <MusicIslandComponent src={'/music/snooze.mp3'} artist={'Jcole'} title={'Wet Dreamz'} showIsland={false}/>
        </section>
    );
}
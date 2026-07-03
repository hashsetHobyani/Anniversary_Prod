'use client';
 
import ParticlesScene from '../component/Particles-component/particles';
import styles from './calender.module.css';
import CalendarViewComponent from '../component/calender-component/calenderview-component/calenderview';
import AboutCardComponent from '../component/calender-component/about-component/aboutcard';
import ChartsComponent from '../component/calender-component/charts-component/chats';
import { useEffect, useRef, useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { IconCalendar,IconSparkles } from '@tabler/icons-react'
import { SuggestedDate } from '@/types/ViewModels';
import { DateService } from '@/service/service';
import { Tooltip, ActionIcon } from '@mantine/core';
export default function CalendarPage() {
    const [jumpDate, setJumpDate] = useState<Date | null>(null);
    const [suggestions] = useState<SuggestedDate[]>(DateService.getSuggestedDates());
    const [currentHint, setCurrentHint] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // rotate hint every 3s
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentHint(prev => (prev + 1) % suggestions.length);
        }, 3000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [suggestions.length]);

    const handleHintClick = () => {
        const s = suggestions[currentHint];
        setJumpDate(new Date(s.date));
    };

    const hint = suggestions[currentHint];
    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <ParticlesScene />
                    <AboutCardComponent />
                <ChartsComponent/>
                <div className={styles.calendarWrapper}>

                    {/* ── date search header ── */}
                    <div className={styles.calendarHeader}>
                        <div className={styles.calendarHeaderLeft}>
                            <p className={styles.calendarTitle}>Calendar</p>
                            <p className={styles.calendarSub}>browse every memory, day by day</p>
                        </div>

                        <div className={styles.dateWrapper}>
                            <p className={styles.dateLabel}>Jump to a date</p>
                            <DatePickerInput
                                leftSection={<IconCalendar size={15} />}
                                placeholder="Select a date..."
                                value={jumpDate}
                                onChange={(val) => setJumpDate(val ? new Date(val) : null)}
                                clearable
                                classNames={{ input: styles.dateInput }}
                                styles={{
                                    input: {
                                        borderRadius: '999px',
                                        border: '1.5px solid #e5e7eb',
                                        fontSize: '0.85rem',
                                        height: '40px',
                                        paddingLeft: '2.2rem',
                                        minWidth: '220px',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    },
                                }}
                            />
                             {/* ── hint carousel ── */}
                            {hint && (
                                <Tooltip
                                    label={hint.description}
                                    position="bottom"
                                    withArrow
                                    arrowSize={6}
                                >
                                    <button
                                        className={styles.hintPill}
                                        onClick={handleHintClick}
                                    >
                                        <IconSparkles size={11} className={styles.hintIcon} />
                                        <span className={styles.hintTry}>try</span>
                                        <span className={styles.hintDate}>{hint.date}</span>
                                        {/* dot indicators */}
                                        <span className={styles.hintDots}>
                                            {suggestions.map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`${styles.hintDot} ${i === currentHint ? styles.hintDotActive : ''}`}
                                                />
                                            ))}
                                        </span>
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    <hr className={styles.calendarDivider} />

                    <div className={styles.calendarBody}>
                    <CalendarViewComponent jumpDate={jumpDate} />
                </div>
                </div>
            </div>
           
        </div>
    );
}
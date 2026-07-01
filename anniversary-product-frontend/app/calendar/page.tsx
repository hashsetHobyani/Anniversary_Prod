'use client';
 
import ParticlesScene from '../component/Particles-component/particles';
import styles from './calender.module.css';
import CalendarViewComponent from '../component/calender-component/calenderview-component/calenderview';
import AboutCardComponent from '../component/calender-component/about-component/aboutcard';
import ChartsComponent from '../component/calender-component/charts-component/chats';
import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { IconCalendar } from '@tabler/icons-react'
export default function CalendarPage() {
    const [jumpDate, setJumpDate] = useState<Date | null>(null);
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
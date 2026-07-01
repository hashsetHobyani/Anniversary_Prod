'use client';
 
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useRef, useState, useCallback } from 'react';
import { EventInput } from '@fullcalendar/core';
import { CalendarEventDto, HistoryInstanceItemDto } from '@/types/ViewModels';
import { MemoryService } from '@/service/memory.service';
import MemoryModalComponent from '../memory/memorymodal';
import styles from '@/app/calendar/calender.module.css';
import { IconMessage, IconPhoto, IconVideo } from '@tabler/icons-react';


interface Props {
    jumpDate?: Date | null;
}


export default function CalendarViewComponent({ jumpDate }: Props) {
    const calendarRef = useRef<FullCalendar>(null);

    const [events, setEvents] = useState<EventInput[]>([]);
    const [selectedDay, setSelectedDay] =
        useState<HistoryInstanceItemDto | null>(null);

    const [opened, setOpened] = useState(false);

    const loadCalendar = useCallback(async (year: number, month: number) => {

        const result = await MemoryService.getCalendar(year, month);

        const mapped: EventInput[] = result.map((x: CalendarEventDto) => ({
            title: '',
            date: x.date,
            extendedProps: {
                hasChats: x.hasChats,
                hasImages: x.hasImages,
                hasVideos: x.hasVideos,
                chatCount: x.chatCount,
                imageCount: x.imageCount,
                videoCount: x.videoCount
            }
        }));

        setEvents(mapped);

    }, []);

    const handleDayClick = async (date: string) => {
        const history = await MemoryService.getHistoryByDay(date);
        setSelectedDay(history);
        setOpened(true);
    };
        // Jump calendar when date picked
    useEffect(() => {
        if (jumpDate && calendarRef.current) {
            setTimeout(() => {
                calendarRef.current?.getApi().gotoDate(jumpDate);
            }, 0);
        }
    }, [jumpDate]);

    return (
        <div className={styles.calendarCard}>

            <FullCalendar
                ref={calendarRef} 
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"

                datesSet={(dateInfo) => {                          
                    const mid = new Date(dateInfo.start);
                    mid.setDate(mid.getDate() + 7);                
                    loadCalendar(mid.getFullYear(), mid.getMonth() + 1);
                }}

                eventContent={(eventInfo) => {
                    const e = eventInfo.event.extendedProps as any;
                    return (
                        <div
                            onClick={() => handleDayClick(eventInfo.event.startStr)} 
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '2px 4px', cursor: 'pointer', width: '100%',background:'none' }}
                        >
                            {e.hasChats && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <IconMessage size={13} />
                                    <span style={{ fontSize: '11px' }}>Messages</span>
                                </div>
                            )}
                            {e.hasImages && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px',backgroundColor:'orange' }}>
                                    <IconPhoto size={13} />
                                    <span style={{ fontSize: '11px' }}>Images</span>
                                </div>
                            )}
                            {e.hasVideos && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px',backgroundColor:'green' }}>
                                    <IconVideo size={13} />
                                    <span style={{ fontSize: '11px' }}>Videos</span>
                                </div>
                            )}
                        </div>
                    );
                }}
            />

            <MemoryModalComponent
                opened={opened}
                close={() => setOpened(false)}
                data={selectedDay}
            />

        </div>
    );
}


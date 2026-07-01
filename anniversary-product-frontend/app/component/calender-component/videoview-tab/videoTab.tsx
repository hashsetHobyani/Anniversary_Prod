'use client';

import { Text } from '@mantine/core';
import { VideoItemDto } from '@/types/ViewModels';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import styles from './videoTab.module.css';

type Props = {
    videos: VideoItemDto[];
};

export default function VideoTabComponent({ videos }: Props) {
    if (!videos || videos.length === 0) {
        return (
            <div className={styles.emptyState}>
                <MagnifyingGlassIcon size={48} className={styles.emptyIcon} />
                <Text size="lg" fw={500} c="dimmed">Hmmm.. This is odd.</Text>
                <Text size="sm" c="dimmed">We don&apos;t have videos for this day.</Text>
            </div>
        );
    }

    return (
        <div className={styles.videoGrid}>
            {videos.map(video => (
                <div key={video.videoId} className={styles.videoCell}>
                    <video
                        controls
                        className={styles.video}
                        preload="metadata"
                    >
                        <source src={video.fileDetails} />
                    </video>
                    {video.title && (
                        <p className={styles.videoTitle}>{video.title}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
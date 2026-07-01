'use client';

import { SimpleGrid, Image, Paper, Text, Stack } from '@mantine/core';
import { ImageItemDto } from '@/types/ViewModels';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import styles from './imageTab.module.css'
type Props = {
    images: ImageItemDto[];
};

export default function ImageTabComponent({ images }: Props) {
        if (!images || images.length === 0) {
            return (
<div className={styles.emptyState}>
                        <MagnifyingGlassIcon  size={48} className={styles.emptyIcon} />
                    <Text size="lg" fw={500} c="dimmed">Hmmm.. This is odd.</Text>
                    <Text size="sm" c="dimmed">We don&apos;t have pictures for this day.</Text>
                </div>
            );
        }
    return (
    <div className={styles.imageGrid}>
    {images.map(image => (
        <div key={image.imageId} className={styles.imageCell}>                
            <Image
                src={image.fileDetails}
                radius="md"
                fit="cover"
                height={50}
                className={styles.image}
            />
            {image.title && (
                <p className={styles.imageTitle}>{image.title}</p>
            )}
        </div>
    ))}
</div>
    );

}
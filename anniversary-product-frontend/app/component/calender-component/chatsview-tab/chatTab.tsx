// ChatTabComponent.tsx
'use client';

import { Stack, Text, Paper } from '@mantine/core';
import { ChatItemDto, AuthorEnum, MessageFormatEnum } from '@/types/ViewModels';
import {
    IconMessage,
    IconPhoto,
    IconVideo,
    IconMicrophone,
    IconPhone,
    IconPhoneOff,
    IconVideoOff,
    IconPaperclip,
    IconClock,
} from '@tabler/icons-react';
import styles from './chatTab.module.css';

type Props = {
    chats: ChatItemDto[];
};

const getMessageIcon = (type: MessageFormatEnum, isMissed: boolean) => {
    if (isMissed) {
        return type === MessageFormatEnum.VideoCall
            ? <IconVideoOff size={22} />
            : <IconPhoneOff size={22} />;
    }
    switch (type) {
        case MessageFormatEnum.VoiceNote:        return <IconMicrophone size={22} />;
        case MessageFormatEnum.VoiceCall:        return <IconPhone size={22} />;
        case MessageFormatEnum.VideoCall:        return <IconVideo size={22} />;
        case MessageFormatEnum.ViewOnce:         return <IconClock size={22} />;
        case MessageFormatEnum.ImageShared:      return <IconPhoto size={22} />;
        case MessageFormatEnum.AttachmentShared: return <IconPaperclip size={22} />;
        default: return null;
    }
};

const getMessageLabel = (type: MessageFormatEnum, description: string): string => {
    const isMissed = description.toLowerCase().includes('missed');
    switch (type) {
        case MessageFormatEnum.VoiceNote:        return 'Voice note';
        case MessageFormatEnum.VoiceCall:        return isMissed ? 'Missed voice call' : `Voice call — ${description.match(/\d+ min/)?.[0] ?? ''}`.trim();
        case MessageFormatEnum.VideoCall:        return isMissed ? 'Missed video call' : `Video call — ${description.match(/\d+ min/)?.[0] ?? ''}`.trim();
        case MessageFormatEnum.ViewOnce:         return 'View once';
        case MessageFormatEnum.ImageShared:      return 'Image';
        default: return description;
    }
};

const isMediaType = (type: MessageFormatEnum) => type !== MessageFormatEnum.Message;

function Avatar({ isMe }: { isMe: boolean }) {
    return (
        <div className={`${styles.avatar} ${isMe ? styles.avatarMe : styles.avatarHer}`}>
            {isMe ? 'Me' : 'Her'}
        </div>
    );
}

export default function ChatTabComponent({ chats }: Props) {

    if (!chats || chats.length === 0) {
        return (
            <Stack align="center" justify="center" className={styles.emptyState}>
                <IconMessage size={48} className={styles.emptyIcon} />
                <Text size="lg" fw={500} c="dimmed">Hmmm.. This is odd.</Text>
                <Text size="sm" c="dimmed">We don&apos;t have memories for this day.</Text>
            </Stack>
        );
    }

    return (
        <Stack gap={4} className={styles.chatStack}>
            {chats.map(chat => {
                const isMe = chat.author === AuthorEnum.Me;
                const isMedia = isMediaType(chat.messageType);
                const isMissed = chat.messageDescription.toLowerCase().includes('missed');

                return (
                    <div
                        key={chat.chatId}
                        className={`${styles.messageRow} ${isMe ? styles.messageRowMe : styles.messageRowHer}`}
                    >
                        <Avatar isMe={isMe} />

                        <Paper
                            radius="lg"
                            withBorder
                            className={`
                                ${styles.bubble}
                                ${isMe ? styles.bubbleMe : styles.bubbleHer}
                                ${isMedia ? styles.bubbleMedia : ''}
                                ${isMissed ? styles.bubbleMissed : ''}
                            `}
                        >
                            {isMedia ? (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span className={`${styles.iconCircle} ${isMissed ? styles.iconCircleMissed : ''}`}>
                                        {getMessageIcon(chat.messageType, isMissed)}
                                    </span>
                                    <div>
                                        <Text className={styles.bubbleMediaText}>
                                            {getMessageLabel(chat.messageType, chat.messageDescription)}
                                        </Text>
                                        <Text className={styles.timestamp}>
                                            {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Text className={styles.bubbleText}>
                                        {chat.messageDescription}
                                    </Text>
                                    <Text ta="right" className={styles.timestamp}>
                                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </>
                            )}
                        </Paper>
                    </div>
                );
            })}
        </Stack>
    );
}
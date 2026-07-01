import { HistoryInstanceItemDto } from "@/types/ViewModels";
import { Modal, Tabs } from "@mantine/core";
import ChatTabComponent from "../chatsview-tab/chatTab";
import ImageTabComponent from "../imageview-tab/imageTab";
import VideoTabComponent from "../videoview-tab/videoTab";
import { IconMessage, IconPhoto, IconVideo } from "@tabler/icons-react";
import styles from "./memory.module.css";

type Props = {
    opened: boolean;
    close: () => void;
    data: HistoryInstanceItemDto | null;
};

export default function MemoryModalComponent({ opened, close, data }: Props) {
    const totalMessages = data?.chatItems?.length ?? 0;
    const totalImages   = data?.imageItems?.length ?? 0;
    const totalVideos   = data?.videoItems?.length ?? 0;

    console.log("data",{totalImages,totalMessages,totalVideos});

    return (
        <Modal
            opened={opened}
            onClose={close}
            size="80%"
            padding={0}
            radius="xl"
            withCloseButton={false}
            styles={{
                body:    { padding: 0, height: '82vh', display: 'flex', flexDirection: 'column' },
                content: { borderRadius: '20px', overflow: 'hidden', height: '82vh' },
                overlay: { backdropFilter: 'blur(6px)' },
            }}
        >
            <div className={styles.modalShell}>
            <div className={styles.decorRing} />
            <div className={styles.decorBlob} />
                {/* ── top bar ── */}
                <div className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <div className={styles.topBarDot} />
                        <span className={styles.topBarTitle}>Memory</span>
                    </div>
                    <button className={styles.closeBtn} onClick={close} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* ── tabs ── */}
                <Tabs
                    defaultValue="chat"
                    classNames={{
                        root:  styles.tabs,
                        list:  styles.tabList,
                        tab:   styles.tab,
                        panel: styles.tabPanel,
                    }}
                >
                    <Tabs.List className={styles.tabList}>
                        <Tabs.Tab value="chat" className={styles.tab}>
                            <span className={styles.tabInner}>
                                <IconMessage size={14} />
                                Messages
                                {totalMessages > 0 && (
                                    <span className={styles.tabBadge}>{totalMessages}</span>
                                )}
                            </span>
                        </Tabs.Tab>
                        <Tabs.Tab value="images" className={styles.tab}>
                            <span className={styles.tabInner}>
                                <IconPhoto size={14} />
                                Images
                                {totalImages > 0 && (
                                    <span className={styles.tabBadge}>{totalImages}</span>
                                )}
                            </span>
                        </Tabs.Tab>
                        <Tabs.Tab value="videos" className={styles.tab}>
                            <span className={styles.tabInner}>
                                <IconVideo size={14} />
                                Videos
                                {totalVideos > 0 && (
                                    <span className={styles.tabBadge}>{totalVideos}</span>
                                )}
                            </span>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="chat" className={styles.tabPanel}>
                        <ChatTabComponent chats={data?.chatItems ?? []} />
                    </Tabs.Panel>
                    <Tabs.Panel value="images" className={styles.tabPanel}>
                        <ImageTabComponent images={data?.imageItems ?? []} />
                    </Tabs.Panel>
                    <Tabs.Panel value="videos" className={styles.tabPanel}>
                        <VideoTabComponent videos={data?.videoItems ?? []} />
                    </Tabs.Panel>
                </Tabs>
            </div>
        </Modal>
    );
}
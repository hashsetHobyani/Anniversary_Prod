'use client';
import { useEffect, useState } from 'react';
import {
    Card, Grid, Group, SimpleGrid, Stack,
    Text, Title, ThemeIcon, Loader, Tooltip, Badge, Divider,
} from '@mantine/core';
import { PieChart, BarChart } from '@mantine/charts';
import {
    IconMessage, IconPhoto, IconVideo, IconFlame,
    IconPhone, IconClock, IconCalendar, IconAlphabetLatin,
    IconFileText, IconChartBar, IconInfoCircle, IconTrendingUp,
    IconPhoneOff,
} from '@tabler/icons-react';
import { SummaryService } from '@/service/summary.service';
import { MessageStats } from '@/types/ViewModels';
import styles from './charts.module.css';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    tooltip: string;
    badge?: string;
    accentClass?: string;
}

function StatCard({ icon, label, value, tooltip, badge, accentClass }: StatCardProps) {
    return (
        <Card
            className={`${styles.statCard} ${accentClass ?? ''}`}
            withBorder
            radius="md"
        >
            <Group justify="space-between" align="flex-start" mb={4}>
                <div style={{ color: 'inherit', opacity: 0.7 }}>{icon}</div>
                <Tooltip label={tooltip} multiline w={220} withArrow position="top-end">
                    <IconInfoCircle size={14} className={styles.infoIcon} />
                </Tooltip>
            </Group>
            <Text className={styles.statLabel}>{label}</Text>
            <Title order={3} className={styles.statValue}>{value}</Title>
            {badge && (
                <Badge size="xs" variant="light" mt="xs" style={{ fontSize: 10 }}>
                    {badge}
                </Badge>
            )}
        </Card>
    );
}

function SectionBlock({
    icon,
    iconClass,
    title,
    children,
}: {
    icon: React.ReactNode;
    iconClass: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={`${styles.sectionIcon} ${iconClass}`}>{icon}</div>
                <span className={styles.sectionTitle}>{title}</span>
            </div>
            {children}
        </div>
    );
}

function HighlightCard({
    number, label, sub,
}: { number: string | number; label: string; sub?: string }) {
    return (
        <div className={styles.highlightCard}>
            <div className={styles.highlightNumber}>{number}</div>
            <div className={styles.highlightLabel}>{label}</div>
            {sub && <div className={styles.highlightSub}>{sub}</div>}
        </div>
    );
}

export default function ChartsComponent() {
    const [stats, setStats] = useState<MessageStats | null>(null);

    useEffect(() => {
        SummaryService.getSummary().then(setStats);
    }, []);

    if (!stats) {
        return (
            <Group justify="center" py="xl">
                <Loader color="blue" size="sm" />
            </Group>
        );
    }

const mediaData = [
    { name: 'Chats',  value: stats.chatStats.count,  color: '#3b82f6' },
    { name: 'Images', value: stats.imageStats.count, color: '#14b8a6' },
    { name: 'Videos', value: stats.videoStats.count, color: '#8b5cf6' },
];

const engagementData = [
    { metric: 'Avg/Day',  value: stats.chatStats.averageMessagesPerDay,    label: String(stats.chatStats.averageMessagesPerDay) },
    { metric: 'Peak Day', value: stats.chatStats.busiestDayMessageCount,   label: String(stats.chatStats.busiestDayMessageCount) },
    { metric: 'Streak',   value: stats.longestStreak,                      label: `${stats.longestStreak}d` },
];

const callData = [
    { metric: 'Voice',    value: stats.callStats?.voiceCalls ?? 0,    label: String(stats.callStats?.voiceCalls ?? 0) },
    { metric: 'Video',    value: stats.callStats?.videoCalls ?? 0,    label: String(stats.callStats?.videoCalls ?? 0) },
    { metric: 'Missed',   value: stats.callStats?.missedCalls ?? 0,   label: String(stats.callStats?.missedCalls ?? 0) },
    { metric: 'Answered', value: stats.callStats?.answeredCalls ?? 0, label: String(stats.callStats?.answeredCalls ?? 0) },
];

    return (
        <div className={styles.wrapper}>
            {/* Header */}
            <div className={styles.header}>
                <Group align="center" gap="sm">
                    <ThemeIcon size="md" color="blue" variant="light" radius="md">
                        <IconChartBar size={16} />
                    </ThemeIcon>
                    <Title order={2} className={styles.headerTitle}>Memory Analytics</Title>
                </Group>
                <Text size="sm" c="dimmed" mt={4}>
                    Every message, call, image and video — counted.
                </Text>
            </div>

            <Divider className={styles.divider} />

            <Stack gap="lg" className={styles.content}>

                {/* ── MESSAGES ── */}
                <SectionBlock
                    icon={<IconMessage size={15} />}
                    iconClass={styles.iconBlue}
                    title="Messages"
                >
                    {/* highlight row */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                        <HighlightCard
                            number={stats.chatStats.count.toLocaleString()}
                            label="total messages sent"
                            sub="every text, every moment"
                        />
                        <HighlightCard
                            number={`${stats.longestStreak}d`}
                            label="longest streak"
                            sub="consecutive days of conversation"
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 2, sm: 2, lg: 4 }} spacing="sm">
                        <StatCard
                            icon={<IconTrendingUp size={16} />}
                            label="Avg / Day"
                            value={stats.chatStats.averageMessagesPerDay}
                            tooltip="Total messages divided by active days."
                            accentClass={styles.accentBlue}
                        />
                        <StatCard
                            icon={<IconChartBar size={16} />}
                            label="Busiest Day"
                            value={stats.chatStats.busiestDayMessageCount}
                            tooltip="Most messages sent in a single day."
                            badge="peak"
                            accentClass={styles.accentBlue}
                        />
                        <StatCard
                            icon={<IconAlphabetLatin size={16} />}
                            label="Total Words"
                            value={stats.chatStats.totalWords.toLocaleString()}
                            tooltip="Combined word count of every message."
                            accentClass={styles.accentBlue}
                        />
                        <StatCard
                            icon={<IconFileText size={16} />}
                            label="A4 Pages"
                            value={stats.chatStats.pageCount}
                            tooltip="Equivalent pages if messages were printed."
                            accentClass={styles.accentBlue}
                        />
                    </SimpleGrid>
                </SectionBlock>

                {/* ── MEDIA ── */}
                <SectionBlock
                    icon={<IconPhoto size={15} />}
                    iconClass={styles.iconTeal}
                    title="Media"
                >
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                        <HighlightCard
                            number={stats.imageStats.count.toLocaleString()}
                            label="photos shared"
                            sub="moments worth keeping"
                        />
                        <HighlightCard
                            number={stats.videoStats.count.toLocaleString()}
                            label="videos shared"
                            sub={`${stats.videoStats.totalHours?.toLocaleString() ?? '—'} hours of footage`}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                        <StatCard
                            icon={<IconClock size={16} />}
                            label="Video Minutes"
                            value={stats.videoStats.totalMinutes.toLocaleString()}
                            tooltip="Total duration of all shared videos in minutes."
                            accentClass={styles.accentViolet}
                        />
                        <StatCard
                            icon={<IconClock size={16} />}
                            label="Video Hours"
                            value={stats.videoStats.totalHours.toLocaleString()}
                            tooltip="Total duration converted to hours."
                            accentClass={styles.accentViolet}
                        />
                        <StatCard
                            icon={<IconFileText size={16} />}
                            label="Characters"
                            value={stats.chatStats.totalCharacters.toLocaleString()}
                            tooltip="Total character count of all messages."
                            accentClass={styles.accentTeal}
                        />
                    </SimpleGrid>
                </SectionBlock>

                {/* ── CALLS ── */}
                <SectionBlock
                    icon={<IconPhone size={15} />}
                    iconClass={styles.iconGreen}
                    title="Calls"
                >
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                        <HighlightCard
                            number={stats.callStats?.count?.toLocaleString() ?? '—'}
                            label="total calls made"
                            sub="voice and video combined"
                        />
                        <HighlightCard
                            number={stats.callStats?.totalHours?.toLocaleString() ?? '—'}
                            label="hours on call"
                            sub={stats.callStats?.averageCallLength
                                ? `avg ${stats.callStats.averageCallLength} min each`
                                : undefined}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 2, sm: 2, lg: 4 }} spacing="sm">
                        <StatCard
                            icon={<IconPhone size={16} />}
                            label="Voice Calls"
                            value={stats.callStats?.voiceCalls?.toLocaleString() ?? '—'}
                            tooltip="Number of voice-only calls."
                            accentClass={styles.accentGreen}
                        />
                        <StatCard
                            icon={<IconVideo size={16} />}
                            label="Video Calls"
                            value={stats.callStats?.videoCalls?.toLocaleString() ?? '—'}
                            tooltip="Number of video calls."
                            accentClass={styles.accentGreen}
                        />
                        <StatCard
                            icon={<IconPhoneOff size={16} />}
                            label="Missed"
                            value={stats.callStats?.missedCalls?.toLocaleString() ?? '—'}
                            tooltip="Calls that went unanswered."
                            accentClass={styles.accentRed}
                        />
                        <StatCard
                            icon={<IconTrendingUp size={16} />}
                            label="Avg Length"
                            value={stats.callStats?.averageCallLength
                                ? `${stats.callStats.averageCallLength}m`
                                : '—'}
                            tooltip="Average call duration in minutes."
                            badge={stats.callStats?.longestCall
                                ? `longest: ${stats.callStats.longestCall}m`
                                : undefined}
                            accentClass={styles.accentGreen}
                        />
                    </SimpleGrid>
                </SectionBlock>

                {/* ── CHARTS ── */}
                <SectionBlock
                    icon={<IconChartBar size={15} />}
                    iconClass={styles.iconBlue}
                    title="Visualised"
                >
                    <Grid style={{ gap: '16px' }}>

                        {/* Media Distribution — Pie */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card withBorder radius="md" className={styles.chartCard} p="lg">
                                <Text className={styles.chartTitle} mb="xs">Media Distribution</Text>

                                {/* legend always visible */}
                                <Group gap="md" mb="md" wrap="wrap">
                                    {mediaData.map(d => (
                                        <Group key={d.name} gap={6} align="center">
                                            <div style={{
                                                width: 10, height: 10, borderRadius: '50%',
                                                background: d.color, flexShrink: 0,
                                            }} />
                                            <Text size="xs" c="dimmed">{d.name}</Text>
                                            <Text size="xs" fw={700} style={{ color: d.color }}>
                                                {d.value.toLocaleString()}
                                            </Text>
                                        </Group>
                                    ))}
                                </Group>

                                <PieChart
                                    data={mediaData}
                                    withLabels
                                    labelsType="percent"
                                    withLabelsLine
                                    h={220}
                                    tooltipAnimationDuration={0}
                                    strokeWidth={2}
                                />
                            </Card>
                        </Grid.Col>

                        {/* Engagement — Bar with custom labels */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card withBorder radius="md" className={styles.chartCard} p="lg">
                                <Text className={styles.chartTitle} mb="xs">Engagement</Text>

                                {/* always-visible value pills above bars */}
                                <Group justify="space-around" mb="sm">
                                    {engagementData.map(d => (
                                        <Stack key={d.metric} align="center" gap={2}>
                                            <Text size="xl" fw={800} style={{ color: '#3b82f6', lineHeight: 1 }}>
                                                {d.label}
                                            </Text>
                                            <Text size="xs" c="dimmed">{d.metric}</Text>
                                        </Stack>
                                    ))}
                                </Group>

                                <BarChart
                                    h={180}
                                    data={engagementData}
                                    dataKey="metric"
                                    series={[{
                                        name: 'value',
                                        color: 'blue.5',
                                    }]}
                                    barProps={{ radius: 6 }}
                                    withXAxis
                                    withYAxis={false}
                                    gridAxis="none"
                                    tooltipAnimationDuration={0}
                                />
                            </Card>
                        </Grid.Col>

                        {/* Call Breakdown — Bar with always-visible values */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card withBorder radius="md" className={styles.chartCard} p="lg">
                                <Text className={styles.chartTitle} mb="xs">Call Breakdown</Text>

                                <Group justify="space-around" mb="sm">
                                    {callData.map((d, i) => {
                                        const colours = ['#22c55e', '#14b8a6', '#ef4444', '#3b82f6'];
                                        return (
                                            <Stack key={d.metric} align="center" gap={2}>
                                                <Text
                                                    size="xl"
                                                    fw={800}
                                                    style={{ color: colours[i], lineHeight: 1 }}
                                                >
                                                    {d.label}
                                                </Text>
                                                <Text size="xs" c="dimmed">{d.metric}</Text>
                                            </Stack>
                                        );
                                    })}
                                </Group>

                                <BarChart
                                    h={180}
                                    data={callData}
                                    dataKey="metric"
                                    series={[
                                        { name: 'value', color: 'green.5' },
                                    ]}
                                    barProps={{ radius: 6 }}
                                    withXAxis
                                    withYAxis={false}
                                    gridAxis="none"
                                    tooltipAnimationDuration={0}
                                />
                            </Card>
                        </Grid.Col>

                    </Grid>
                </SectionBlock>

                {/* ── TIMELINE ── */}
                <SectionBlock
                    icon={<IconCalendar size={15} />}
                    iconClass={styles.iconGray}
                    title="Timeline"
                >
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
                        <HighlightCard
                            number={stats.totalMemoryDays}
                            label="days of memories"
                            sub={`${new Date(stats.firstMemoryDate).toLocaleDateString()} → ${new Date(stats.lastMemoryDate).toLocaleDateString()}`}
                        />
                        <StatCard
                            icon={<IconCalendar size={16} />}
                            label="First Memory"
                            value={new Date(stats.firstMemoryDate).toLocaleDateString()}
                            tooltip="The date of the very first recorded memory."
                            accentClass={styles.accentGray}
                        />
                        <StatCard
                            icon={<IconCalendar size={16} />}
                            label="Latest Memory"
                            value={new Date(stats.lastMemoryDate).toLocaleDateString()}
                            tooltip="The most recent memory recorded."
                            accentClass={styles.accentGray}
                        />
                    </SimpleGrid>
                </SectionBlock>

            </Stack>
        </div>
    );
}
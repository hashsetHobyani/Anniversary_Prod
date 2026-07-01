'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Stack,
    Group,
    Button,
    Select,
    FileInput,
    TextInput,
    Badge,
    Title,
    Text,
    SimpleGrid,
    Switch,Progress,ThemeIcon, Loader
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import styles from './admin.module.css'
import { notifications } from '@mantine/notifications';
import { TimerService } from '@/service/time.service';
import { HistoryService } from '@/service/history.service';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { ChatFileFormatEnum, FileTypeEnum, FileUsed, TimerDto } from '@/types/ViewModels';
import ParticlesScene from '../component/Particles-component/particles';

const FILE_TYPE_OPTIONS = [
    { value: '1', label: 'Chat' },
    { value: '2', label: 'Video' },
    { value: '3', label: 'Images' },
    { value: '4', label: 'Media' },
];
const CHAT_TYPE_OPTIONS = [
    { value: '1', label: 'txt' },
    { value: '2', label: 'pdf' },
    { value: '3', label: 'docx' },
];

export default function AdminPage() {
    const [fileName, setFileName] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [filesUsed, setFilesUsed] = useState<FileUsed[]>([]);


    const [importType, setImportType] = useState<string | null>(null);
    const [chatType, setChatType] = useState<string | null>(null);
    const [importLoading, setImportLoading] = useState(false);

    const [progress, setProgress]       = useState(0);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);
    const [done, setDone]               = useState(false);

    const [timer, setTimer] = useState<TimerDto | null>(null);
    const [timerLoading, setTimerLoading] = useState(false);
    const [timerSaving, setTimerSaving] = useState(false);
    
    const [clearType, setClearType] = useState<string | null>(null);
    const [clearLoading, setClearLoading] = useState(false);

    const [deleteType, setDeleteType] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const notify = (title: string, message: string, color: string) =>
        notifications.show({ title, message, color });

    // ── IMPORT ──
    const handleImport = async () => {
        if (!files || !importType || !chatType) {
            notify('Missing fields', 'Select file and type', 'red');
            return;
        }

        try {
            setImportLoading(true);
            setProgress(0);
            setDone(false);
            
            await HistoryService.importFiles({
                name:fileName ?? importType,
                type: Number(importType) as FileTypeEnum,
                chatType: Number(chatType) as ChatFileFormatEnum,
                formFile: files,
            },
            (pct, batch, total) => {
                setProgress(pct);
                setCurrentBatch(batch);
                setTotalBatches(total);
            });

            notify('Success', 'File imported successfully', 'green');
            setDone(true);
            setFiles([]);
            setImportType(null);
            setChatType(null);
        } catch {
            notify('Error', 'Import failed', 'red');
        } finally {
            setImportLoading(false);
        }
    };

    const handleImportNew = async () => {
        if (!files || !importType) {
            notify('Missing fields', 'Select file and type', 'red');
            return;
        }

        try {
            setImportLoading(true);
            await HistoryService.importAsNew({
                oldFileType: Number(importType) as FileTypeEnum,
                newFileImport: {
                    type: Number(importType) as FileTypeEnum,
                    formFile: files,
                },
            });

            notify('Success', 'Imported as new dataset', 'green');

            setFiles([]);
            setImportType(null);
            setChatType(null);
        } catch {
            notify('Error', 'Import as new failed', 'red');
        } finally {
            setImportLoading(false);
        }
    };

    // ── CLEAR ──
    const handleClear = async () => {
        if (!clearType) {
            notify('Missing type', 'Select a data type', 'yellow');
            return;
        }

        try {
            setClearLoading(true);

            await HistoryService.clearByType(
                Number(clearType) as FileTypeEnum
            );

            notify('Cleared', 'Data removed successfully', 'yellow');

            setClearType(null);
        } catch {
            notify('Error', 'Clear failed', 'red');
        } finally {
            setClearLoading(false);
        }
    };
useEffect(() => {
    const loadTimer = async () => {
        try {
            setTimerLoading(true);

            const res = await TimerService.getTimer();
            setTimer(res); // adjust if your api wrapper differs
        } catch (err) {
            console.error('Failed to load timer', err);
        } finally {
            setTimerLoading(false);
        }
    };
    const loadFiles = async () =>{
        try{
           setImportLoading(true)
             setFilesUsed(await HistoryService.getFileUsed())
        }catch(err){
             notifications.show({
            title: 'Error',
            message:'Failed to update timer',
            color: 'red'
        });
        }finally{
            setImportLoading(false)
        }
    }
    loadFiles();
    loadTimer();
}, []);
    // ── DELETE ──
    const handleDelete = async () => {
        if (!deleteId || !deleteType) {
            notify('Missing fields', 'Enter ID and type', 'red');
            return;
        }

        try {
            setDeleteLoading(true);

            await HistoryService.clearById(
                Number(deleteId),
                Number(deleteType) as FileTypeEnum
            );

            notify('Deleted', `Record ${deleteId} removed`, 'red');

            setDeleteId('');
            setDeleteType(null);
        } catch {
            notify('Error', 'Delete failed', 'red');
        } finally {
            setDeleteLoading(false);
        }
    };
    //---Timer Update
    const updateTimerField = <K extends keyof TimerDto>(
    key: K,
    value: TimerDto[K]
) => {
    if (!timer) return;

    setTimer({
        ...timer,
        [key]: value
    });
};
const handleSaveTimer = async () => {
    if (!timer) return;

    try {
        setTimerSaving(true);

        await TimerService.updateTimer(timer);

        notifications.show({
            title: 'Timer Updated',
            message: 'Timer saved successfully',
            color: 'green'
        });
    } catch {
        notifications.show({
            title: 'Error',
            message: 'Failed to update timer',
            color: 'red'
        });
    } finally {
        setTimerSaving(false);
    }
};const toIsoStringSafe = (value: unknown): string => {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value as string);

    if (isNaN(date.getTime())) return '';

    return date.toISOString();
};

    return (
        <div style={{ position: 'relative' }}>
            {/* ── progress block ── */}
            {(importLoading || done) && (
                <Stack gap="xs" mt="sm">

                    <Group justify="space-between" align="center">
                        <Group gap="xs">
                            {importLoading
                                ? <Loader size="xs" color="blue" />
                                : <ThemeIcon size="xs" color="green" radius="xl">
                                    <IconCheck size={10} />
                                </ThemeIcon>
                            }
                            <Text size="xs" c="dimmed">
                                {importLoading
                                    ? `Batch ${currentBatch} of ${totalBatches}`
                                    : 'Import complete'
                                }
                            </Text>
                        </Group>
                        <Badge
                            size="xs"
                            color={done ? 'green' : 'blue'}
                            variant="light"
                        >
                            {progress}%
                        </Badge>
                    </Group>

                    <Progress
                        value={progress}
                        color={done ? 'green' : 'blue'}
                        size="sm"
                        radius="xl"
                        animated={importLoading}
                    />

                    {importLoading && (
                        <Text size="xs" c="dimmed" ta="center">
                            {files.length} files · uploading in batches of 100
                        </Text>
                    )}

                    {done && (
                        <Text size="xs" c="green" ta="center">
                            All {files.length} files imported successfully
                        </Text>
                    )}

                </Stack>
            )}
            <ParticlesScene />

            <Container size="lg" py="xl">
                <Stack gap="xl">

                    {/* HEADER */}
                    <Stack gap={4}>
                        <Title order={2}>Admin Dashboard</Title>
                        <Text c="dimmed">
                            Manage memory data: imports, clears, deletions
                        </Text>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, md: 1 }}>
                        <Stack>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.08em' }}>
                                Files currently in use
                            </Text>

                            <div className={styles.usedFilesRow}>
                                {filesUsed.map((file, i) => (
                                    <div key={i} className={styles.usedFile}>
                                        <div className={styles.fileDot} />
                                        <p className={styles.fileText}>
                                            {file.name}
                                            <span style={{ opacity: 0.45, marginLeft: 4 }}>
                                                ({file.countFiles})
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Stack>
                        {/* ───────── IMPORT ───────── */}
                        <Card shadow="md" radius="md" withBorder>
                            <Stack>
                                <Group justify="space-between">
                                    <Badge color="blue">Import</Badge>
                                </Group>

                                <Text size="sm" c="dimmed">
                                    Add data or create a new dataset
                                </Text>
                                <TextInput
                                    label="File Name"
                                    value={fileName}
                                    placeholder="e.g all videos"
                                    onChange={e=>setFileName(e.target.value)}
                                />
                                <FileInput
                                    label="File"
                                    placeholder="Choose files or folder"
                                    value={files}
                                    onChange={(val) => setFiles(val ?? [])}
                                    multiple                        
                                    accept="image/*,video/*,.txt,.zip"
                                />

                                <Select
                                    label="Data Type"
                                    placeholder="Select type"
                                    data={FILE_TYPE_OPTIONS}
                                    value={importType}
                                    onChange={setImportType}
                                />

                                <Select
                                    label="Chat Type"
                                    placeholder="Select chat type"
                                    data={CHAT_TYPE_OPTIONS}
                                    value={chatType}
                                    onChange={setChatType}
                                />

                                <Group>
                                    <Button
                                        loading={importLoading}
                                        onClick={handleImport}
                                        disabled={importLoading || files.length === 0}
                                    >
                                        {importLoading ? 'Importing...' : `Import ${files.length > 0 ? `(${files.length} files)` : ''}`}
                                    </Button>

                                    <Button
                                        variant="light"
                                        loading={importLoading}
                                        onClick={handleImportNew}
                                        disabled={importLoading || files.length === 0}
                                    >
                                        Import as New
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>

                        {/* ───────── CLEAR ───────── */}
                        <Card shadow="md" radius="md" withBorder>
                            <Stack>
                                <Badge color="yellow">Clear</Badge>

                                <Text size="sm" c="dimmed">
                                    Remove all records of a type
                                </Text>

                                <Select
                                    label="Data Type"
                                    placeholder="Select type"
                                    data={FILE_TYPE_OPTIONS}
                                    value={clearType}
                                    onChange={setClearType}
                                />

                                <Button
                                    color="yellow"
                                    loading={clearLoading}
                                    onClick={handleClear}
                                >
                                    Clear All
                                </Button>
                            </Stack>
                        </Card>

                        {/* ───────── DELETE ───────── */}
                        <Card shadow="md" radius="md" withBorder>
                            <Stack>
                                <Badge color="red">Delete</Badge>

                                <Text size="sm" c="dimmed">
                                    Remove a single record by ID
                                </Text>

                                <Select
                                    label="Data Type"
                                    placeholder="Select type"
                                    data={FILE_TYPE_OPTIONS}
                                    value={deleteType}
                                    onChange={setDeleteType}
                                />

                                <TextInput
                                    label="Record ID"
                                    placeholder="e.g. 1042"
                                    value={deleteId}
                                    onChange={(e) => setDeleteId(e.target.value)}
                                />

                                <Button
                                    color="red"
                                    loading={deleteLoading}
                                    onClick={handleDelete}
                                >
                                    Delete Record
                                </Button>
                            </Stack>
                        </Card>
                        {/* Timer */}
                        <Card shadow="md" radius="md" withBorder>
                            <Stack>

                                <Group justify="space-between">
                                    <Badge color="grape">Timer</Badge>
                                </Group>

                                <Text size="sm" c="dimmed">
                                    Manage system countdown timer
                                </Text>

                                {timerLoading || !timer ? (
                                    <Text>Loading timer...</Text>
                                ) : (
                                    <>
                                        <TextInput
                                            label="Timer Name"
                                            value={timer.timerName}
                                            onChange={(e) =>
                                                updateTimerField('timerName', e.target.value)
                                            }
                                        />

                                        <DateTimePicker
                                            label="Start Date"
                                            value={new Date(timer.dateStart)}
                                            onChange={(val) =>
                                                updateTimerField(
                                                    'dateStart',
                                                    toIsoStringSafe(val)
                                                )
                                            }
                                        />

                                        <DateTimePicker
                                            label="End Date"
                                            value={new Date(timer.dateEnd)}
                                            onChange={(val) =>
                                                updateTimerField(
                                                    'dateEnd',
                                                    toIsoStringSafe(val)
                                                )
                                            }
                                        />

                                        <Switch
                                            label="Active"
                                            checked={timer.isActive}
                                            onChange={(event) =>
                                                updateTimerField('isActive', event.currentTarget.checked)
                                            }
                                        />

                                        <Button
                                            onClick={handleSaveTimer}
                                            loading={timerSaving}
                                            color="grape"
                                        >
                                            Save Timer
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    </SimpleGrid>
                </Stack>
            </Container>
        </div>
    );
}
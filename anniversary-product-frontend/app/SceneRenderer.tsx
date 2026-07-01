'use client';

import { useScene } from './SceneContext';
import { AnimatePresence, motion } from 'framer-motion';

import CountDowncomponent from './component/Countdown/countdown';
import WordDictionaryComponent from './component/info/word-dictionary';
import GraphicIntroComponent from './component/Video/graphic-intro';
import GraphicMainComponent from './component/Video2/graphic-main';
import ContentSummaryComponent from './component/Content/content-intro';
import QMainComponent from './component/QMain/qmain';
import QNoComponent from './component/QNo/qno';
import QYesComponent from './component/Qyes/Qyes';
import QEndComponent from './component/QNo/qend';
import CalendarViewComponent from './component/calender-component/calenderview-component/calenderview';
import { Scene } from '@/types/ViewModels';

const slideVariants = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit:    { y: '-100%', opacity: 0 },
};

const sceneMap: Record<Scene, React.ReactElement> = {
  intro:          <CountDowncomponent />,
  dictionary:     <WordDictionaryComponent />,
  graphicIntro:   <GraphicIntroComponent />,
  graphicMain:    <GraphicMainComponent />,
  contentSummary: <ContentSummaryComponent />,
  qMain:          <QMainComponent />,
  qNo:            <QNoComponent />,
  qYes:           <QYesComponent />,
  qEnd:           <QEndComponent />,
  memoryCalendar: <CalendarViewComponent />,
};

export default function SceneRenderer() {
  const { scene } = useScene();

  return (
    // overflow-hidden is critical — clips the slide-in/out motion
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}                   // key change triggers exit → enter
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {sceneMap[scene]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
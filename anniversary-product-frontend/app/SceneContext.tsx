'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Scene } from '@/types/ViewModels';

type SceneContextType = {
    scene: Scene;
    setScene: (scene: Scene) => void;
};

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
    const [scene, setScene] = useState<Scene>("intro");

    return (
        <SceneContext.Provider value={{ scene, setScene }}>
            {children}
        </SceneContext.Provider>
    );
}

export function useScene() {
    const context = useContext(SceneContext);
    if (!context) throw new Error("useScene must be used inside SceneProvider");
    return context;
}
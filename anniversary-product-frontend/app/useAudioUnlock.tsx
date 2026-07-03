// hooks/useAudioUnlock.ts
'use client';

import { useEffect } from 'react';

let unlocked = false;

export function useAudioUnlock() {
    useEffect(() => {
        if (unlocked) return;

        const unlock = () => {
            if (unlocked) return;

            // create and immediately pause a silent buffer
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buf = ctx.createBuffer(1, 1, 22050);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            src.start(0);
            ctx.resume();

            unlocked = true;

            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('touchend', unlock);
            window.removeEventListener('click', unlock);
        };

        window.addEventListener('touchstart', unlock, { passive: true });
        window.addEventListener('touchend',   unlock, { passive: true });
        window.addEventListener('click',      unlock, { passive: true });

        return () => {
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('touchend',   unlock);
            window.removeEventListener('click',      unlock);
        };
    }, []);
}
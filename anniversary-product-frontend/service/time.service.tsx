import { api } from "./api";
import { TimerDto } from "@/types/ViewModels";
let cachedTime: TimerDto | null = null;
export const TimerService = {
    getTimer: async () => {
        if (cachedTime) return cachedTime;
        const response = await api.get<TimerDto>("/Times");

        cachedTime = response;
        return cachedTime;
    },
    updateTimer: async (payload: TimerDto) => {
        payload.id = 1;
        return await api.put<void>(
            "/Times/updateTimer",
            payload
        );
    }
};


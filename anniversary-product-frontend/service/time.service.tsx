import { api } from "./api";
import { TimerDto } from "@/types/ViewModels";
export const TimerService = {
    getTimer: async () => {

        return await api.get<TimerDto>("/Times");
    },
    updateTimer: async (payload: TimerDto) => {
        payload.id = 1;
        return await api.put<void>(
            "/Times/updateTimer",
            payload
        );
    }
};


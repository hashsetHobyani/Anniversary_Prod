import { CalendarEventDto, HistoryInstanceItemDto } from "@/types/ViewModels";
import { api } from "./api";
export const MemoryService = {
    getHistoryByDay: async (date: string) => {
        return await api.get<HistoryInstanceItemDto>(
            `/memoryItems/day?date=${date}`
        );
    },

    getCalendar: async (year: number, month: number) => {
        return await api.get<CalendarEventDto[]>(
            `/memoryItems/calendar?year=${year}&month=${month}`
        );
    }
};
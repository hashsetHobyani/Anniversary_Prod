import { api } from "./api";
import { MessageStats } from "@/types/ViewModels";
let cachedStats: MessageStats | null = null;

export const SummaryService = {
    getSummary: async () => {
        if (cachedStats) return cachedStats;

        const response = await api.get<MessageStats>("/Summary/SummaryStats");
                
        cachedStats = response;
        return cachedStats;
    },

};
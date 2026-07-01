import { api } from "./api";
import { MessageStats } from "@/types/ViewModels";
export const SummaryService = {
    getSummary: async () => {
        return await api.get<MessageStats>("/Summary/SummaryStats");
    },

};
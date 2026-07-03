import { DefaultSettings,Keyword,Phase,SuggestedDate,TimeSettings, User } from "@/types/ViewModels"
import { author,defaultSettings, keywords, PHASES } from "@/data/data"

// hardcoded data service here
export type Scene =
  | "intro"
  | "dictionary"
  | "graphicIntro"
  | "memoryCalendar";
  
export const UserService={
    getAuthor():User{
        return author
    },
}
export const DefaultService={
    getSettings():DefaultSettings{
        return defaultSettings
    }
}
export const WordService ={
    getKeywords():Keyword[]{
        return keywords
    },
    getPhases():Phase[]{
        return PHASES
    }
}
export const ImageService=
{
    getGraphic2Image(){
                const IMAGES = [
            '/images/plant0.jpeg',
            '/images/plant1.jpeg',
            '/images/plant2.jpeg',
            '/images/plant3.jpeg',
            '/images/plant4.jpeg',
            '/images/plant5.jpeg',
            
        ];
        return IMAGES
    }
}
export const DateService = {
    getSuggestedDates(): SuggestedDate[] {
        return [
            { date: "2026-04-06", description: "Favourite Day 😏 " },
            { date: "2025-05-18", description: "First photo together" },
            { date: "2024-08-14", description: "The day everything changed" },
            { date: "2024-12-25", description: "First christmas" },
            { date: "2025-01-01", description: "New year together" },
            { date: "2024-06-21", description: "Our first date" },
        ];
    }
}


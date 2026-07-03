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
            { date: "2026-04-06", description: "Favourite Movie Day 😏 " },
            { date: "2025-10-09", description: "The day everything changed" },
            { date: "2025-07-13", description: "First I love you from her" },
            { date: "2025-06-21", description: "Rejection Day / Anniversary Day " },
            { date: "2025-05-23", description: "First Meet Up" },
            { date: "2025-04-12", description: "My favourite unexplainable memory" },
            { date: "2025-03-25", description: "The day everything changed" },
        ];
    }
}


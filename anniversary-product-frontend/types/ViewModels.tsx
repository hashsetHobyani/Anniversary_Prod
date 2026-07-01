export type User={
    id:string
    fullName:string
    firstName:string
    lastName:string
    email:string
    heroImage:string;
    aboutImage:string;
}
export type DefaultSettings={
    email:string
    date:number
    mode:'lightMode'|'DarkMode'|'SystemDefault'
}
export type EmailService={
    message:string
    to :string 
    from :string 
    subject:string
    acknowledgement:string
}
export type CustomReciept={
    // thanks for connecting
    messageResponse:string

}
export type TimeSettings ={
    countdownName:string;
    formatTime:string;
    local:string;
    start:Date;
    end:Date;
}
export type Scene =
  | "intro"
  | "dictionary"
  | "graphicIntro"
  | "graphicMain"
  | "contentSummary"
  | "qMain"
  | "qNo"
  | "qYes"
  | "qEnd"
  | "memoryCalendar";

  export type QState =
  | "intro"
  | "normal"
  | "no_stage_1"
  | "no_stage_2"
  | "no_stage_3"
  | "no_stage_4"
  | "dark"
  | "redemption";

  export type Phase={
        id: string;
    eyebrow: string|null;
    body: string;
    sub: string | null;
  }
//
//
// historyService Types
//
//
export type FileImportDto ={
    name?: string | undefined;
    type: FileTypeEnum;
    chatType?: number;
    formFile: File[];
}
export enum FileTypeEnum {
    chat = 1,
    video = 2,
    images = 3,
    media = 4,
}export enum ChatFileFormatEnum {
    txt=1,
    pdf=2,
    docx=3,
}
export enum FileImportFunctionEnum {
    importAsNew="importAsNew",
    importFile="importFile"

}
export type FileUsed ={
    name: string,
    countFiles:number


}

//
//
// MemoryService Types
//
//
export enum AuthorEnum {
    Me = "Me",
    Her = "Her",
}export enum MessageFormatEnum {
    Message = "Message",
    VoiceNote = "VoiceNote",
    VoiceCall = "VoiceCall",
    VideoCall = "VideoCall",
    ViewOnce = "ViewOnce",
    ImageShared = "ImageShared",
    AttachmentShared = "AttachmentShared",
}
export interface ChatItemDto {
    chatId: number;
    createdAt: string;
    author: AuthorEnum;
    messageDescription: string;
    messageType: MessageFormatEnum;
}

export interface VideoItemDto {
    videoId: number;
    createdAt: string;
    title: string;
    fileDetails: string;
}

export interface ImageItemDto {
    imageId: number;
    createdAt: string;
    title: string;
    fileDetails: string;
}

export interface HistoryInstanceItemDto {
    chatItems: ChatItemDto[];
    videoItems: VideoItemDto[];
    imageItems: ImageItemDto[];
    date: string;
}

export interface CalendarEventDto {
    date: string;
    hasChats: boolean;
    hasImages: boolean;
    hasVideos: boolean;
    chatCount: number;
    imageCount: number;
    videoCount: number;
}
//
//
// TimerService Types
//
//
export interface TimerDto {
    id: number;
    timerName: string;
    dateStart: string;
    dateEnd: string;
    isActive: boolean;
}
export type Keyword = {
    id: number;
    keyword: string;
    description: string;
};



//
//
// SummaryService Types
//
//
export interface MessageStats {
  chatStats: {
    count: number;
    totalWords: number;
    totalCharacters: number;
    pageCount: number;
    averageMessagesPerDay:number;
    busiestDayMessageCount:number;
  };

  imageStats: {
    count: number;
  };

  videoStats: {
    count: number;
    totalMinutes: number;
    totalHours: number;
  };
  

 callStats :{
    count: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    longestCall: number;
    averageCallLength: number;
    videoCalls: number;
    voiceCalls: number;
    missedCalls: number;
    answeredCalls: number;
};

  totalMemoryDays: number;
  firstMemoryDate: string;
  lastMemoryDate: string;
  longestStreak: number;


}
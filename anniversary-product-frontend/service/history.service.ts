
import { number } from "framer-motion";
import { api } from "./api";
import { FileTypeEnum, FileImportDto ,FileImportFunctionEnum,FileUsed} from "@/types/ViewModels";

export const HistoryService = {

// importFiles: async (fileImport: FileImportDto) => {

//     const formData = new FormData();

//     if (fileImport.name)
//         formData.append("Name", fileImport.name);

//     formData.append("Type", String(fileImport.type));

//     if (fileImport.chatType !== undefined)
//         formData.append("ChatType", String(fileImport.chatType));


//         console.log("number of files",fileImport.formFile.length);


//     fileImport.formFile.forEach((file) => {
//         formData.append("formFile", file);
//     });
// for (const pair of formData.entries()) {
//     console.log(pair[0], pair[1]);
// }
//     return await api.postForm(
//         "/history/import",
//         formData
//     );
// },
importFiles: async (
    fileImport: FileImportDto,
    onProgress?: (pct: number, batch: number, totalBatches: number) => void
) => {
    const BATCH_SIZE = 100;
    const files = fileImport.formFile;
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    //convert into private method for import as new use
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const formData = new FormData();

        if (fileImport.name)
            formData.append("Name", fileImport.name);

        formData.append("Type", String(fileImport.type));

        if (fileImport.chatType !== undefined)
            formData.append("ChatType", String(fileImport.chatType));

        batch.forEach(file => formData.append("formFile", file));

        await api.postForm("/history/import", formData);

        const pct = Math.round(((i + batch.length) / files.length) * 100);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
        onProgress?.(pct, currentBatch, totalBatches);
    }
},
    importAsNew: async (payload: {
        oldFileType: FileTypeEnum;
        newFileImport:FileImportDto;onProgress?: (pct: number, batch: number, totalBatches: number) => void
    }) => {

        return await api.post<{
            message: string;
            data: any;
        }>("/history/import/new", payload);
    },    
    
    clearByType: async (fileType: FileTypeEnum) => {

        return await api.delete<{
            message: string;
        }>("/history/clear", fileType);
    },    
    clearById: async (id: number, fileType: FileTypeEnum) => {

        return await api.delete<{
            message: string;
            id: number;
        }>(`/history/clear/${id}?fileType=${fileType}`);
    },
    getFileUsed: async ()=>{
        return await api.get<FileUsed[]>(`/history/filesUsed`)
    }
    // processMediaBatch: async(type:FileImportFunctionEnum,file:File[]){
        
    //     if(type==FileImportFunctionEnum.importAsNew) 
    //          await api.postForm("/history/import", formData);


    // }
};
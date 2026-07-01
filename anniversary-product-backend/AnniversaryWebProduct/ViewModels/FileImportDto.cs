namespace AnniversaryWebProduct.ViewModels
{
    public class FileImportDto
    {
        public string? Name { get; set; }
        public FileTypeEnum Type { get; set; } = FileTypeEnum.chat;
        public ChatFileFormatEnum? ChatType { get; set; } = ChatFileFormatEnum.txt;

        public List<IFormFile> formFile { get; set; }

    }
    public class ImportAsNewRequestDto
    {
        public FileTypeEnum OldFileType { get; set; }
        public FileImportDto NewFileImport { get; set; }
    }
    public class ImportResultDto
    {
        public FileTypeEnum Type { get; set; }
        public int TotalMessages { get; set; }
        public int HistoryInstancesCreated { get; set; }
        public int? ChatsCreated { get; set; } = 0;
        public int? VideosCreated { get; set; } = 0;
        public int? ImagesCreated { get; set; }= 0;

        public int MemoryItemsCreated { get; set; }
    }
    public enum FileTypeEnum
    {
        chat=1,
        video = 2,
        images = 3,
        media = 4,
    }
    public enum ChatFileFormatEnum
    {
        txt=1,
        pdf=2,
        docx=3,
        //img=4, soon 
       
    }
}

using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;

namespace AnniversaryWebProduct.Factory
{
    public interface IHistoryData
    {
        Task<DataPlaceHolderClass> getChatHistoryToDate(string? Todate);
        Task<DataPlaceHolderClass> getImageToDate(string? Todate);
        Task<DataPlaceHolderClass> getVideoToDate(string? Todate);
        Task<DataPlaceHolderClass> getHistoryInstancesToDate(string? Todate); // get all images , videos and chats dates to populate on to callendar frontend

    }
    public class HistoryData : IHistoryData
    {
        private readonly AppDbContext _context;
        public HistoryData(AppDbContext context)
        {
            _context = context;
        }
        public Task<DataPlaceHolderClass> getChatHistoryToDate(string? Todate)
        {
            throw new NotImplementedException();
        }

        public Task<DataPlaceHolderClass> getHistoryInstancesToDate(string? Todate)
        {
            throw new NotImplementedException();
        }

        public Task<DataPlaceHolderClass> getImageToDate(string? Todate)
        {
            throw new NotImplementedException();
        }

        public Task<DataPlaceHolderClass> getVideoToDate(string? Todate)
        {
            throw new NotImplementedException();
        }
    }
}

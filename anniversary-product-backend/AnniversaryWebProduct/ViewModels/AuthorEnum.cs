
using System.Text.Json.Serialization;
namespace AnniversaryWebProduct.ViewModels
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum AuthorEnum
    {
       Me= 0,
       Her= 1,
    }
}

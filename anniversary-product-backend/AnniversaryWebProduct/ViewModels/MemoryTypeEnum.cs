using System.Text.Json.Serialization;

namespace AnniversaryWebProduct.ViewModels
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MemoryTypeEnum
    {
        Chat= 0,
        Video= 0,
        Image= 1,
        //Audio= 2, cant export audio from chat
    }
}

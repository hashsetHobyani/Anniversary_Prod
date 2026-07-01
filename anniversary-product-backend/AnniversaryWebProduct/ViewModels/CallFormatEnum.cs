using System.Text.Json.Serialization;

namespace AnniversaryWebProduct.ViewModels
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CallStateEnum
    {
        Answered =0,
        Missed =1,
    }
}

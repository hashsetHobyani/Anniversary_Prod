using System.Text.Json.Serialization;

namespace AnniversaryWebProduct.ViewModels
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MessageFormatEnum
    {
        Message = 0,
        VoiceNote = 1,
        VoiceCall = 2,
        VideoCall = 3,
        ViewOnce = 4,
        ImageShared= 5,
        AttachmentShared = 6,  // any other image video text message sent
    }
}
//audio omitted
//Video omitted
//Audio omitted
//Video call

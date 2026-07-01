import { CalendarEventDto } from "@/types/ViewModels";
import { BsChatHeart } from "react-icons/bs";
import { IoImagesOutline } from "react-icons/io5";
import { PiVideoLight } from "react-icons/pi";

type Props = {
    event: CalendarEventDto;
};

export default function EventContentComponent({
    event
}: Props) {

    return (

        <div>

            {
                event.hasChats &&
                <BsChatHeart />
            }

            {
                event.hasImages &&
                <IoImagesOutline />
            }

            {
                event.hasVideos &&
                <PiVideoLight />
            }

        </div>

    );
}
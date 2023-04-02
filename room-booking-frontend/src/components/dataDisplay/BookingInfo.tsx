import { Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";


const bookingInfo = (props: {booking:any}) => {
    const booking = props.booking;
    return (
      <Stack>
        <Text>
          Room: {booking.building_name} {booking.room_number}
        </Text>
        <Text>Number of occupants: {booking.num_occupants}</Text>
        <Text>
          Day: {format(new Date(booking.start_datetime), "MMMM d, yyyy")}
        </Text>
        <Text>
          Time: {format(new Date(booking.start_datetime), "h:mm aaa")}
        </Text>
        <Text>Duration: {booking.duration} minutes</Text>
        <Text>
          End Time:  {format(
            new Date(
              new Date(booking.start_datetime).getTime() + booking.duration * 60000
            ),
            "h:mm aaa"
          )}
        </Text>
      </Stack>
    );
}

export default bookingInfo;
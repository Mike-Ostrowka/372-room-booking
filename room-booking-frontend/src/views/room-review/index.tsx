import { Box, Stack } from "@chakra-ui/react";
import { useState } from "react";
import PreviousBookings from "./components/PreviousBookings";
import RoomReviewForm from "./components/RoomReviewForm";

const RoomReview = () => {
    const [bookingID, setBookingID] = useState(0);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center">
        <PreviousBookings setBookingId={setBookingID}/>
        <RoomReviewForm bookingID={bookingID}/>
      </Stack>
    </Box>
  );
};

export default RoomReview;

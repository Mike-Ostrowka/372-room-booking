import { Box, Stack } from "@chakra-ui/react";
import RoomBookingForm from "./components/RoomBookingForm";

const RoomBooking = () => {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center">
        <RoomBookingForm />
      </Stack>
    </Box>
  );
};

export default RoomBooking;

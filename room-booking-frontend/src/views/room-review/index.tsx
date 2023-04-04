import { Box, Stack, useDisclosure } from "@chakra-ui/react";
import PreviousBookingsTable from "./components/PreviousBookingTable";

const RoomReview = () => {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center">
          <PreviousBookingsTable />
      </Stack>
    </Box>
  );
};

export default RoomReview;

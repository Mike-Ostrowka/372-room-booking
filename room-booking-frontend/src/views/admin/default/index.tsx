// Chakra imports
import { Box, Stack } from "@chakra-ui/react";
import MiniCalendar from "components/calendar/MiniCalendar";
import Statistics from "./components/Statistics";

export default function Dashboard() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center" spacing={2}>
        <MiniCalendar selectRange={false} />
        <Statistics />
      </Stack>
    </Box>
  );
}

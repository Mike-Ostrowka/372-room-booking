import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import RoomSearchForm from "./components/RoomSearchForm";
import ResultsTable from "./components/ResultsTable";

const RoomSearch = () => {
  const [rooms, setRooms] = useState([]);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack spacing={4}>
        <RoomSearchForm setRooms={setRooms} />
        <ResultsTable rooms={rooms} setRooms={setRooms} />
      </Stack>
    </Box>
  );
};

export default RoomSearch;

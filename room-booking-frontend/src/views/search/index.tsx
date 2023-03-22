import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import RoomSearchForm from "./components/RoomSearchForm";
import ResultsTable from "./components/ResultsTable";

const RoomSearch = () => {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack spacing={4}>
        <RoomSearchForm />
        <ResultsTable />
      </Stack>
    </Box>
  );
};

export default RoomSearch;

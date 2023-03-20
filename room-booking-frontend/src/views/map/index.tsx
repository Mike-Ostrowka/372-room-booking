import { Box, Stack } from "@chakra-ui/react";
import Map from "./components/Map";

const MapTab = () => {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center">
        <Map />
      </Stack>
    </Box>
  );
};

export default MapTab;

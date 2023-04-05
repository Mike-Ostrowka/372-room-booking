import { Box } from "@chakra-ui/react";
import LostItemsTable from "./components/LostItemsTable";

const StaffLostItems = () => {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <LostItemsTable />
    </Box>
  );
};

export default StaffLostItems;

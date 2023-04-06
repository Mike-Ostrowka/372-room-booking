import { Box, Stack } from "@chakra-ui/react";
import LostItemsForm from "./components/LostItemsForm";
import LostItemsTable from "./components/LostItemsTable";
import { useContext } from "react";
import { UserContext } from "contexts/UserContext";
import { useState, useEffect } from "react";

const LostItems = () => {
  const [lostItems, setLostItems] = useState([]);

  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await fetch(
          `/lost-and-found/${loggedInUser.u_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const lostItemsRes = await res.json();
        setLostItems(lostItemsRes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchLostItems();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack width="100%" alignItems="center" spacing={2}>
        <LostItemsForm setLostItems={setLostItems} />
        <LostItemsTable lostItems={lostItems} setLostItems={setLostItems} />
      </Stack>
    </Box>
  );
};

export default LostItems;

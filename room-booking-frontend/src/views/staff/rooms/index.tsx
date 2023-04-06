import { useState, useEffect } from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import RoomsTable from "./components/RoomsTable";
import AddRoomModal from "./components/AddRoomModal";

const StaffRoomsComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [openAddRoomDialog, setOpenAddRoomDialog] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/rooms`, {
          method: "GET",
          credentials: "include",
        });
        const roomsRes = await res.json();
        setRooms(roomsRes);
      } catch (e) {
        console.log(e);
      }
    };

    fetchRooms();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Stack spacing={2}>
        <Stack width="25%">
          <Button colorScheme="red" onClick={() => setOpenAddRoomDialog(true)}>
            Create Room
          </Button>
        </Stack>
        <RoomsTable rooms={rooms} setRooms={setRooms} />
      </Stack>
      {openAddRoomDialog && (
        <AddRoomModal
          setOpenAddRoomDialog={setOpenAddRoomDialog}
          openAddRoomDialog={openAddRoomDialog}
          setRooms={setRooms}
        />
      )}
    </Box>
  );
};

export default StaffRoomsComponent;

import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import RoomsTable from "./components/RoomsTable";

const StaffRoomsComponent = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:8080/rooms`, {
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
      <RoomsTable rooms={rooms} />
    </Box>
  );
};

export default StaffRoomsComponent;

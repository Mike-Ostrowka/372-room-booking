import { useState, useEffect, useContext } from "react";
import { Box } from "@chakra-ui/react";
import RoomsTable from "./components/RoomsTable";
import { UserContext } from "contexts/UserContext";

const StaffRoomsComponent = () => {
  const [rooms, setRooms] = useState([]);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/rooms/${loggedInUser.u_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
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

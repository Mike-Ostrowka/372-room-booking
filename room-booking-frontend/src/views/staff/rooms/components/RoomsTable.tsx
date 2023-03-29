import {
  TableContainer,
  Table,
  Thead,
  TableCaption,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";
import EditRoomModal from "./EditRoomModal";

const RoomsTable = ({ rooms, setRooms }: any) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const toast = useToast();

  const handleRoomDeletion = async (room: any) => {
    try {
      const res = await fetch(
        `http://localhost:8080/rooms/${room.room_number}/${room.building_name}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const roomsRes = await res.json();
      setRooms(roomsRes);
      if (res.status === 200) {
        toast({
          title: "Room Deleted",
          description: `You have deleted room ${room.building_name} ${room.room_number}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Room Deletion Failed",
          description:
            "The system could not delete a room at this time. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>All rooms currently in system</TableCaption>
        <Thead>
          <Tr>
            <Th>Building Name</Th>
            <Th>Room Number</Th>
            <Th>Has Projector</Th>
            <Th>Has White Board</Th>
            <Th>Capacity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms.map((room: any) => (
            <Tr key={room.room_number}>
              <Td>{room.building_name}</Td>
              <Td>{room.room_number}</Td>
              <Td>{room.hasprojector ? "Yes" : "No"}</Td>
              <Td>{room.haswhiteboard ? "Yes" : "No"}</Td>
              <Td>{room.capacity}</Td>
              <Td>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenEditDialog(true);
                    setSelectedRoom(room);
                  }}
                >
                  <MdEdit />
                </Button>
              </Td>
              <Td>
                <Button
                  variant="outline"
                  onClick={() => handleRoomDeletion(room)}
                >
                  <MdDelete />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {openEditDialog && (
        <EditRoomModal
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          roomData={selectedRoom}
          rooms={rooms}
          setRooms={setRooms}
        />
      )}
    </TableContainer>
  );
};

export default RoomsTable;

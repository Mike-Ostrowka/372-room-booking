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
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";
import EditRoomModal from "./EditRoomModal";

const RoomsTable = ({ rooms }: any) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
                <Button variant="outline">
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
        />
      )}
    </TableContainer>
  );
};

export default RoomsTable;

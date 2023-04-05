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
import { useHistory } from "react-router-dom";
import { RoomContext } from "contexts/RoomContext";
import { useContext } from "react";

const ResultsTable = ({ rooms }: any) => {
  const { setRoomData } = useContext(RoomContext);
  const history = useHistory();

  const navigateToBooking = (roomData: any) => {
    setRoomData(roomData);
    history.push("/admin/room-booking");
  };
  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>Available Rooms for Search Criteria</TableCaption>
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
          {rooms.map((r: any) => (
            <Tr>
              <Td>{r.building_name}</Td>
              <Td>{r.room_number}</Td>
              <Td>{r.hasprojector ? "Yes" : "No"}</Td>
              <Td>{r.haswhiteboard ? "Yes" : "No"}</Td>
              <Td>{r.capacity}</Td>
              <Td>
                <Button onClick={() => navigateToBooking(r)}>Book</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;

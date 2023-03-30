import {
  TableContainer,
  Table,
  Thead,
  TableCaption,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const ResultsTable = ({ rooms }: any) => {
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
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;

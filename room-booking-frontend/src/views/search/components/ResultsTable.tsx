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

const ResultsTable = () => {
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
          <Tr>
            <Td>SUB</Td>
            <Td>4200</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>25</Td>
          </Tr>
          <Tr>
            <Td>SUB</Td>
            <Td>2120</Td>
            <Td>Yes</Td>
            <Td>No</Td>
            <Td>20</Td>
          </Tr>
          <Tr>
            <Td>SUB</Td>
            <Td>4101</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>50</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;

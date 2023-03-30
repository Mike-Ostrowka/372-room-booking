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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import RoomReviewModal from "./RoomReviewModal";

const PreviousBookingTable = () => {

    const [roomBookings, setRoomBookings] = useState([]);

    const createReviewModal = (bookingID: any) => {
        RoomReviewModal(bookingID);
    }

    const fetchBookings = async () => {
        if(roomBookings.length > 0) {
            return;
        }
        const response = await fetch("http://localhost:8080/room-booking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const responseData = await response.json();
        responseData.sort(function(a:any, b:any) {
            return Date.parse(b.start_datetime) - Date.parse(a.start_datetime);
        })
        setRoomBookings(responseData);
    };

    useEffect (() => {
        fetchBookings().catch(console.error);
    });
  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>Available Rooms for Search Criteria</TableCaption>
        <Thead>
          <Tr>
            <Th>Building Name</Th>
            <Th>Room Number</Th>
            <Th>Date</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roomBookings.map((room: any) => (
            <Tr 
            // onClick={createReviewModal()}
            >
              <Td>{room.building_name}</Td>
              <Td>{room.room_number}</Td>
              <Td>{format(new Date(room.start_datetime), 'MMMM d, yyyy')}</Td>
              <Td>{room.duration} minutes</Td>
              <Td><Button>Create Review</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PreviousBookingTable;

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "assets/css/MiniCalendar.css";
import { Icon, Tag } from "@chakra-ui/react";
// Chakra imports
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// Custom components
import Card from "components/card/Card";

export default function MiniCalendar(props: {
  selectRange: boolean;
  [x: string]: any;
}) {
  const { selectRange, ...rest } = props;
  const [value, onChange] = useState(new Date());
  const [roomBookings, setRoomBookings] = useState([]);

  const getTileContent = ({ date }: any) => {
    const roomBooking = roomBookings.find(
      (rb: any) =>
        new Date(rb.start_datetime).toDateString() === date.toDateString()
    );
    return roomBooking ? (
      <Tag
        marginLeft={5}
      >{`${roomBooking.building_name} ${roomBooking.room_number}`}</Tag>
    ) : null;
  };

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await fetch("/room-booking", {
          method: "GET",
          credentials: "include",
        });
        const responseData = await response.json();
        console.log("ROOM BOOKINGS HERE: ", responseData);
        setRoomBookings(responseData);
      } catch (e) {
        console.log(e);
      }
    };

    fetchRoomBookings();
  }, []);
  return (
    <Card
      alignItems="center"
      flexDirection="column"
      w="100%"
      maxW="max-content"
      p="20px 15px"
      h="max-content"
      {...rest}
    >
      <Calendar
        onChange={onChange}
        value={value}
        selectRange={selectRange}
        view={"month"}
        tileContent={getTileContent}
        prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" mt="4px" />}
        nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" mt="4px" />}
      />
    </Card>
  );
}

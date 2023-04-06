import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "assets/css/MiniCalendar.css";
import { Button, Center, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Tag, useDisclosure } from "@chakra-ui/react";
// Chakra imports
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// Custom components
import Card from "components/card/Card";
import CalendarReview from "components/rating/CalendarReview";
import { UserContext } from "contexts/UserContext";
import { useContext } from "react";
import CalendarModal from "components/modals/CalendarModal";

export default function MiniCalendar(props: {
  selectRange: boolean;
  [x: string]: any;
}) {
  const { selectRange, ...rest } = props;
  const [value, onChange] = useState(new Date());
  const [roomBookings, setRoomBookings] = useState([]);
  const [allRoomBookings, setAllRoomBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

  const { loggedInUser } = useContext(UserContext);

  const getTileContent = ({ date }: any) => {
    const roomBooking = roomBookings.find(
      (rb: any) =>
        new Date(rb.start_datetime).toDateString() === date.toDateString()
    );
    return roomBooking ? (
      <Stack>
        <Stack onClick={() => {
          setCurrentReviews(getReviews(roomBooking.room_number));
          setCurrentBooking(roomBooking);
          onOpen();
        }}>
          <Tag
            marginLeft={5}
          >{`${roomBooking.building_name} ${roomBooking.room_number}`}</Tag>
          <Center>
            <Tag
              width="52px"
              color="white"
              background="blackAlpha.800"
              marginLeft="20px"
              padding={0}
              paddingLeft="8px"
            >{`${calcAverageReview(roomBooking.room_number)} ⭐`}</Tag>
          </Center>
        </Stack>
      </Stack>
    ) : null;
  };

  const getReviews = (room_number:any) => {
    const bookings = allRoomBookings.filter(
      (b: any) => b.room_number === room_number
    );

    const roomReviews = reviews.filter((r: any) => {
      return bookings.some((b: any) => b.booking_id === r.booking_id);
    });
    return roomReviews;
  };

  const calcAverageReview = (room_number:any) => {

    const bookings = allRoomBookings.filter((b:any) => b.room_number === room_number);

    const roomReviews = reviews.filter((r:any) => {
      return bookings.some((b:any) => b.booking_id === r.booking_id);
    });
    let sum = 0;
    roomReviews.forEach((r:any) => {
      sum += r.room_rating;
    });
    if(roomReviews.length === 0) return 5;
    return sum / roomReviews.length;
  }

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await fetch(
          `/room-booking/${loggedInUser.u_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const responseData = await response.json();

        setRoomBookings(responseData);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchAllRoomBookings = async () => {
      try {
        const response = await fetch(
          `room-booking/`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const responseData = await response.json();

        setAllRoomBookings(responseData);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `room-review`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const responseData = await response.json();

        setReviews(responseData);
      } catch (e) {
        console.log(e);
      }
    };
    fetchReviews();
    fetchRoomBookings();
    fetchAllRoomBookings();
  }, [isOpen]);
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
      <CalendarModal
        isOpen={isOpen}
        onClose={onClose}
        reviews={currentReviews}
        booking={currentBooking}
      />
    </Card>
  );
}


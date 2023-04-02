import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import BookingInfo from "components/dataDisplay/BookingInfo";
import ReviewList from "components/dataDisplay/ReviewList";
import { useEffect, useState } from "react";

const CalendarModal = (props: { isOpen:any, onClose:any, reviews: any, booking:any}) => {

    const { isOpen, onClose, reviews, booking } = props;
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>Booking Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row" spacing="50px">
              <BookingInfo booking={booking} />
              <ReviewList reviews={reviews} />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
};

export default CalendarModal;
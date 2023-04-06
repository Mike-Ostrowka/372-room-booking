import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";

import RoomBookingForm from "views/room-booking/components/RoomBookingForm";

const RoomBookingModal = (props: {
  isOpen: any;
  onClose: any;
  setOpenRoomBookingDialog: any;
  setRooms: any;
}) => {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Stack direction="row" spacing="50px">
            <RoomBookingForm
              setOpenRoomBookingDialog={props.setOpenRoomBookingDialog}
              setRooms={props.setRooms}
            />
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

export default RoomBookingModal;

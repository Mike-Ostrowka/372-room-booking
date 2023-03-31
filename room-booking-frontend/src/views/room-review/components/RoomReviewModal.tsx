import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import RoomReviewForm from "./RoomReviewForm";

const RoomReviewModal = (bookingID: any, isOpen:any, onClose:any) => {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
          <ModalContent>
            <ModalHeader>Create a review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RoomReviewForm bookingID={bookingID} />
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  alert(1);
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default RoomReviewModal;
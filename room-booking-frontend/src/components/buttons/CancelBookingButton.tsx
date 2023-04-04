import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Stack, Toast, useDisclosure, useToast } from "@chakra-ui/react";
import { UserContext } from "contexts/UserContext";
import { useContext, useRef } from "react";

const CancelBookingButton = (props: {booking_id:any, isHidden: any, onClose: any} ) => {

      const { loggedInUser } = useContext(UserContext);
      const toast = useToast();

      const { isOpen, onOpen, onClose } = useDisclosure();
      const cancelRef = useRef();

    const handleClick = async () => {
        const response = await fetch(`http://localhost:8080/room-booking/`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: props.booking_id,
            user_id: loggedInUser.u_id,
          }),
        });
        const responseData = await response.json();
        if(responseData.length == 0) {
            toast({
              title: "Deleted Booking",
              description: "Booking deleted successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
        }
        onClose();
        props.onClose();
    }

    return props.isHidden ? (
      <Stack>
        <Button onClick={onOpen} colorScheme="red" mt="20px">
          Cancel Booking
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Booking
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleClick} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    ) : null;

}

export default CancelBookingButton;
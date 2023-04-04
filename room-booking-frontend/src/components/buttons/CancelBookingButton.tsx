import { Button, Stack, Toast, useToast } from "@chakra-ui/react";
import { UserContext } from "contexts/UserContext";
import { useContext } from "react";

const CancelBookingButton = (props: {booking_id:any, isHidden: any, onClose: any} ) => {

      const { loggedInUser } = useContext(UserContext);
      const toast = useToast();

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
        props.onClose();
    }

    return props.isHidden? (
        <Stack>
            <Button onClick={handleClick} 
            colorScheme="red"
            mt="20px"
            >
                Cancel Booking
            </Button>
        </Stack>
    ): null

}

export default CancelBookingButton;
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormHelperText,
  Stack,
  Input,
  Button,
  useToast,
  Checkbox,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import * as Yup from "yup";

const AddRoomModal = ({
  setOpenAddRoomDialog,
  openAddRoomDialog,
  setRooms,
}: any) => {
  const onClose = () => {
    setOpenAddRoomDialog(false);
  };
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    capacity: Yup.number()
      .typeError("Capacity must be a number")
      .required("Capacity is Required"),
    building_name: Yup.string().required("Building Name is Required"),
    room_number: Yup.number()
      .typeError("Room Number must be a number")
      .required("Room Number is Required"),
  });
  const formik = useFormik({
    initialValues: {
      capacity: "",
      building_name: "",
      room_number: "",
      has_projector: false,
      has_whiteboard: false,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      const data = {
        capacity: parseInt(values.capacity),
        building_name: values.building_name,
        room_number: parseInt(values.room_number),
        has_projector: values.has_projector,
        has_whiteboard: values.has_whiteboard,
      };
      try {
        const response = await fetch(`http://localhost:8080/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });

        if (response.status === 200) {
          const roomsRes = await response.json();
          setRooms(roomsRes);
          toast({
            title: "New Room Added",
            description: `You have successfully added room ${data.building_name} ${data.room_number}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Room Addition Failed",
            description:
              "The system could not add a room at this time. Please ensure this room does not already exist.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        setOpenAddRoomDialog(false);
        setSubmitting(false);
      } catch (e) {
        console.log(e);
        setSubmitting(false);
      }
      formik.resetForm();
    },
    validationSchema: validationSchema,
  });

  return (
    <Modal isOpen={openAddRoomDialog} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={5} alignItems="center">
                <Stack width="100%" spacing={4}>
                  <Input
                    placeholder="Capacity"
                    size="lg"
                    name="capacity"
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.capacity && formik.touched.capacity && "red"
                    }
                  />
                  {formik.errors.capacity && formik.touched.capacity && (
                    <FormHelperText>
                      {formik.errors.capacity.toString()}
                    </FormHelperText>
                  )}
                  <Input
                    placeholder="Building Name"
                    size="lg"
                    name="building_name"
                    value={formik.values.building_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.building_name &&
                      formik.touched.building_name &&
                      "red"
                    }
                  />
                  {formik.errors.building_name &&
                    formik.touched.building_name && (
                      <FormHelperText>
                        {formik.errors.building_name.toString()}
                      </FormHelperText>
                    )}
                  <Input
                    placeholder="Room Number"
                    size="lg"
                    name="room_number"
                    value={formik.values.room_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.room_number &&
                      formik.touched.room_number &&
                      "red"
                    }
                  />
                  {formik.errors.room_number && formik.touched.room_number && (
                    <FormHelperText>
                      {formik.errors.room_number.toString()}
                    </FormHelperText>
                  )}
                  <Checkbox
                    name="has_projector"
                    defaultChecked={formik.values.has_projector}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    Has a Projector
                  </Checkbox>

                  <Checkbox
                    name="has_whiteboard"
                    defaultChecked={formik.values.has_whiteboard}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    Has a whiteboard
                  </Checkbox>
                </Stack>
                <Stack width="50%">
                  <Button
                    variant="solid"
                    colorScheme="red"
                    type="submit"
                    isLoading={formik.isSubmitting}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </form>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddRoomModal;

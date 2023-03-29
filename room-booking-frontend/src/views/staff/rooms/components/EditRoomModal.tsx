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
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { useContext } from "react";
import { UserContext } from "contexts/UserContext";

import { useFormik } from "formik";
import * as Yup from "yup";

const EditRoomModal = ({
  openEditDialog,
  setOpenEditDialog,
  rooms,
  roomData,
}: any) => {
  const onClose = () => {
    setOpenEditDialog(false);
  };
  const toast = useToast();
  const { loggedInUser } = useContext(UserContext);
  const buildings = new Set(rooms.map((r: any) => r.building_name));

  console.log("ROOM DATA: ", rooms);

  const validationSchema = Yup.object().shape({
    capacity: Yup.string().required("Capacity is Required"),
    building_name: Yup.string().required("Building Name is Required"),
    room_number: Yup.string().required("Room Number is Required"),
  });
  const formik = useFormik({
    initialValues: {
      capacity: roomData.capacity.toString(),
      building_name: roomData.building_name.toString(),
      room_number: roomData.room_number.toString(),
      has_projector: roomData.hasprojector,
      has_whiteboard: roomData.haswhiteboard,
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
        const response = await fetch(
          `http://localhost:8080/rooms/${loggedInUser.u_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }
        );
        if (response.status === 200) {
          toast({
            title: "Room Changes Saved",
            description: "You have successfully edited a room",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Room Changes Failed",
            description:
              "The system could not edit a room at this time. Please try again later",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        setSubmitting(false);
      } catch (e) {
        console.log(e);
        setSubmitting(false);
      }
      formik.resetForm();
    },
    validationSchema: validationSchema,
  });

  console.log("FORMIK DATA", formik.values);

  return (
    <Modal isOpen={openEditDialog} onClose={onClose}>
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
                  <Select
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
                  >
                    {Array.from(buildings).map((b: any) => (
                      <option value={b} key={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.building_name &&
                    formik.touched.building_name && (
                      <FormHelperText>
                        {formik.errors.building_name.toString()}
                      </FormHelperText>
                    )}
                  <Select
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
                  >
                    {rooms.map((r: any) => (
                      <option
                        value={r.room_number.toString()}
                        key={r.room_number}
                      >
                        {r.room_number.toString()}
                      </option>
                    ))}
                  </Select>
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
                    Save Changes
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

export default EditRoomModal;

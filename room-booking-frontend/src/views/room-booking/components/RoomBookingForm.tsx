import {
  Stack,
  Input,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  FormHelperText,
  FormControl,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "contexts/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const RoomBookingForm = () => {
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [buildingNames, setBuildingNames] = useState([]);

  const toast = useToast();
  const { loggedInUser } = useContext(UserContext);
  console.log("LOGGED IN USER: ", loggedInUser);
  const validationSchema = Yup.object().shape({
    duration: Yup.number()
      .typeError("Duration must be a number")
      .required("Duration is Required"),
    num_occupants: Yup.number()
      .typeError("Number of Occupants must be a number")
      .required("Number of Occupants is Required"),
    building_name: Yup.string().required("Building Name is Required"),
    room_number: Yup.number()
      .typeError("Room Number must be a number")
      .required("Room Number is Required"),
  });
  const formik = useFormik({
    initialValues: {
      start_datetime: new Date().toISOString().slice(0, 16),
      duration: "",
      num_occupants: "",
      building_name: "",
      room_number: "",
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      const data = {
        start_datetime: values.start_datetime,
        duration: parseInt(values.duration),
        num_occupants: parseInt(values.num_occupants),
        building_name: values.building_name,
        room_number: parseInt(values.room_number),
        user_id: parseInt(loggedInUser.u_id),
      };
      try {
        const response = await fetch("http://localhost:8080/room-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });
        if (response.status === 200) {
          toast({
            title: "New Room Booking",
            description: "You have successfully created a new room booking",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Room Booking Failed",
            description:
              "The system could not book a room at this time. Please ensure the room number and building are valid.",
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

  useEffect(() => {
    const fetchRoomsAndBuildings = async () => {
      try {
        const res = await fetch("http://localhost:8080/rooms", {
          method: "GET",
          credentials: "include",
        });
        const roomsRes = await res.json();
        console.log("ROOMS RES", roomsRes);
        const roomNums = formik.values.building_name
          ? roomsRes
              .filter(
                (r: any) => r.building_name == formik.values.building_name
              )
              .map((r: any) => r.room_number)
          : roomsRes.map((r: any) => r.room_number);
        const buildings = new Set(roomsRes.map((r: any) => r.building_name));
        setRoomNumbers(roomNums);
        setBuildingNames(Array.from(buildings));
      } catch (e) {
        console.log(e);
      }
    };
    fetchRoomsAndBuildings();
  }, [formik.values.building_name]);

  return (
    <Card width="75%">
      <CardHeader>
        <Heading size="md">New Room Booking</Heading>
      </CardHeader>
      <CardBody>
        <FormControl>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={5} alignItems="center">
              <Stack width="100%" spacing={4}>
                <Input
                  placeholder="Duration (Minutes)"
                  size="lg"
                  name="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.errors.duration && formik.touched.duration && "red"
                  }
                />
                {formik.errors.duration && formik.touched.duration && (
                  <FormHelperText>{formik.errors.duration}</FormHelperText>
                )}
                <Input
                  placeholder="Number of Occupants"
                  size="lg"
                  name="num_occupants"
                  value={formik.values.num_occupants}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.errors.num_occupants &&
                    formik.touched.num_occupants &&
                    "red"
                  }
                />
                {formik.errors.num_occupants &&
                  formik.touched.num_occupants && (
                    <FormHelperText>
                      {formik.errors.num_occupants}
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
                  {buildingNames.map((b) => (
                    <option value={b} key={b}>
                      {b}
                    </option>
                  ))}
                </Select>
                {formik.errors.building_name &&
                  formik.touched.building_name && (
                    <FormHelperText>
                      {formik.errors.building_name}
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
                  {roomNumbers.map((r) => (
                    <option value={r} key={r}>
                      {r}
                    </option>
                  ))}
                </Select>
                {formik.errors.room_number && formik.touched.room_number && (
                  <FormHelperText>{formik.errors.room_number}</FormHelperText>
                )}
                <Input
                  placeholder="Select Date and Time"
                  size="lg"
                  type="datetime-local"
                  name="start_datetime"
                  value={formik.values.start_datetime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Stack>
              <Stack width="50%">
                <Button
                  variant="solid"
                  colorScheme="red"
                  type="submit"
                  isLoading={formik.isSubmitting}
                >
                  Create Booking
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormControl>
      </CardBody>
    </Card>
  );
};
export default RoomBookingForm;

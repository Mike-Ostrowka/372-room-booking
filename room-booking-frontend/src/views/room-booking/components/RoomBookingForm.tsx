import {
  Stack,
  Input,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const RoomBookingForm = () => {
  const validationSchema = Yup.object().shape({
    duration: Yup.string().required("Duration is Required"),
    num_occupants: Yup.string().required("Number of Occupants is Required"),
    building_name: Yup.string().required("Building Name is Required"),
    room_number: Yup.string().required("Room Number is Required"),
  });
  const formik = useFormik({
    initialValues: {
      booking_datetime: new Date().toISOString(),
      duration: "",
      num_occupants: "",
      building_name: "",
      room_number: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: validationSchema,
  });
  return (
    <Card width="75%">
      <CardHeader>
        <Heading size="md">New Room Booking</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5} alignItems="center">
            <Stack width="100%" spacing={4}>
              <Input
                placeholder="Duration"
                size="lg"
                name="duration"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.errors.duration && formik.touched.duration && "red"
                }
              />
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
              <Input
                placeholder="Select Date and Time"
                size="lg"
                type="datetime-local"
                name="booking_datetime"
                value={formik.values.booking_datetime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.errors.booking_datetime &&
                  formik.touched.booking_datetime &&
                  "red"
                }
              />
            </Stack>
            <Stack width="50%">
              <Button variant="solid" colorScheme="red" type="submit">
                Create Booking
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
};
export default RoomBookingForm;

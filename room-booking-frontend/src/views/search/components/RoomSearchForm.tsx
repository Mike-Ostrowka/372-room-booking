import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Stack,
  Input,
  Checkbox,
  Button,
  CardHeader,
  Card,
  CardBody,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { SearchContext } from "contexts/SearchContext";
import { useContext } from "react";

const RoomSearchForm = ({ setRooms }: any) => {
  const { setSearchCriteria } = useContext(SearchContext);

  const toast = useToast();
  const validationSchema = Yup.object().shape({
    duration: Yup.number()
      .typeError("Duration must be a number")
      .required("Duration is Required"),
    num_occupants: Yup.number()
      .typeError("Number of Occupants must be a number")
      .required("Number of Occupants is Required"),
  });
  const formik = useFormik({
    initialValues: {
      start_datetime: new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: "",
      num_occupants: "",
      hasprojector: false,
      haswhiteboard: false,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      const data = {
        start_datetime: values.start_datetime.toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: parseInt(values.duration),
        num_occupants: parseInt(values.num_occupants),
        hasprojector: values.hasprojector,
        haswhiteboard: values.haswhiteboard,
      };
      setSearchCriteria(data);
      try {
        const response = await fetch("/search-rooms", {
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
        } else {
          toast({
            title: "Room Search Failed",
            description:
              "The system could not search for a room at this time. Please try again later.",
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
    },
    validationSchema: validationSchema,
  });
  return (
    <Card width="100%">
      <CardHeader>
        <Heading size="md">Search Criteria</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <Stack direction="row" spacing={2} width="100%">
            <Stack direction="row" spacing={2} width="80%">
              <Input
                placeholder="Select Date and Time"
                size="lg"
                type="datetime-local"
                name="start_datetime"
                value={formik.values.start_datetime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
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
              <Stack spacing={1} width="70%">
                <Checkbox
                  name="hasprojector"
                  checked={formik.values.hasprojector}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  Projector
                </Checkbox>
                <Checkbox
                  name="haswhiteboard"
                  checked={formik.values.haswhiteboard}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  White Board
                </Checkbox>
              </Stack>
            </Stack>
            <Stack width="20%">
              <Button
                variant="solid"
                colorScheme="red"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Search
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
};

export default RoomSearchForm;

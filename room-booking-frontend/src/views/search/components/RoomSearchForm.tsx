import React from "react";
import {
  Stack,
  Input,
  Checkbox,
  Button,
  CardHeader,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";

const RoomSearchForm = () => {
  return (
    <Card width="100%">
      <CardHeader>
        <Heading size="md">Search Criteria (Work in progress...)</Heading>
      </CardHeader>
      <CardBody>
        <Stack direction="row" spacing={2} width="100%">
          <Stack direction="row" spacing={2} width="80%">
            <Input
              placeholder="Select Date and Time"
              size="lg"
              type="datetime-local"
              name="start_datetime"
              // value={formik.values.start_datetime}
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
            />
            <Input
              placeholder="Duration"
              size="lg"
              name="duration"
              // value={formik.values.duration}
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // borderColor={formik.errors.duration && formik.touched.duration && "red"}
            />
            <Input
              placeholder="Number of Occupants"
              size="lg"
              name="num_occupants"
              // value={formik.values.num_occupants}
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // borderColor={
              //   formik.errors.num_occupants && formik.touched.num_occupants && "red"
              // }
            />
            <Stack spacing={1} width="70%">
              <Checkbox>Projector</Checkbox>
              <Checkbox>White Board</Checkbox>
            </Stack>
          </Stack>
          <Stack width="20%">
            <Button variant="solid" colorScheme="red">
              Search
            </Button>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RoomSearchForm;

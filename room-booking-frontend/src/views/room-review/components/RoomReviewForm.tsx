import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import RoomReview from "components/rating/RoomReview";

import { useFormik } from "formik";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";

const RoomReviewForm = (bookingID: any) => {
    const [rating, setRating] = useState(0);
  const validationSchema = Yup.object().shape({
    reviewText: Yup.string().required("Review is Required"),
    roomRating: Yup.number().required("Rating is Required"),
    noiseLevel: Yup.number().required("Noise Level is Required"),
    functioningRoom: Yup.boolean().required("Functioning Room is Required"),
    issueDetails: Yup.string().optional(),
  });
  const formik = useFormik({
    initialValues: {
      reviewText: "",
      roomRating: rating,
      noiseLevel: 0,
      functioningRoom: true,
      issueDetails: "",
      bookingID: bookingID,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      formik.resetForm();
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
  });
  return (
    <Card width="75%">
      <CardHeader>
        <Heading size="md">New Room Review</Heading>
      </CardHeader>
      <CardBody>
        <FormControl>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={5} alignItems="center">
              <Stack width="100%" spacing={4}>
                <Stack width="100%" padding="2" margin="2">
                  <Text mb="8px">Enter a rating:</Text>
                  <RoomReview setRating={setRating} />
                </Stack>
                <Stack>
                  <Text mb="8px">Provide details about your review:</Text>
                  <Textarea
                    placeholder="Enter your review"
                    size="lg"
                    name="reviewText"
                    value={formik.values.reviewText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.reviewText && formik.touched.reviewText && "red"
                    }
                  />
                </Stack>
                <Stack width="50%">
                  <Button
                    variant="solid"
                    colorScheme="red"
                    type="submit"
                    isLoading={formik.isSubmitting}
                  >
                    Create Review
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </form>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default RoomReviewForm;

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  FormControl,
  Heading,
  Input,
  Modal,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import RoomReview from "components/rating/RoomReview";

import { useFormik } from "formik";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";

const RoomReviewForm = (bookingID: any) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

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
      setSubmitting(false);
      setSubmitted(true);
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
  });
  return !submitted ? (
    <Card width="100%">
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
                      formik.errors.reviewText &&
                      formik.touched.reviewText &&
                      "red"
                    }
                  />
                </Stack>
                <Stack>
                  <Slider
                    defaultValue={0}
                    min={0}
                    max={10}
                    step={1}
                    value={formik.values.noiseLevel}
                    onChangeEnd={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.noiseLevel &&
                      formik.touched.noiseLevel &&
                      "red"
                    }
                  >
                    <SliderTrack bg="red.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="teal.500"
                      color="white"
                      placement="top"
                      isOpen={showTooltip}
                      label={`${sliderValue}%`}
                    >
                    <SliderThumb boxSize={6} />
                    </Tooltip>
                  </Slider>
                </Stack>
                <Stack>
                  <Checkbox defaultChecked>
                    All the equipment in the room was functioning
                  </Checkbox>
                </Stack>
                <Stack width="100%" alignContent="center" alignItems="center">
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
  ) : (
    <Card width="75%">
      <CardHeader>
        <Heading size="md">Thanks for submitting a review 🥳</Heading>
      </CardHeader>
    </Card>
  );
};

export default RoomReviewForm;

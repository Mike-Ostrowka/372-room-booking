import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  FormControl,
  Heading,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import HiddenField from "components/fields/HiddenField";
import NoiseReview from "components/rating/NoiseReview";
import RoomReview from "components/rating/RoomReview";
import { UserContext } from "contexts/UserContext";

import { useFormik } from "formik";
import { useContext, useRef, useState } from "react";
import * as Yup from "yup";

const RoomReviewForm = (props: { bookingID: any, setBookingID: any }) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState("");
  const [issues, setIssues] = useState("");
  const [checked, setChecked] = useState(true);
  const [noise, setNoise] = useState(0);

  const { loggedInUser } = useContext(UserContext);
  const toast = useToast();

  const submitReview = async () => {
    const res = await fetch("/room-review/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
        room_rating: rating,
        noise_level: noise,
        functioning_room: checked,
        issue_details: issues,
        booking_id: props.bookingID,
      }),
      credentials: "include",
    });
  };

  const validationSchema = Yup.object().shape({
    reviewText: Yup.string().required("Review is Required"),
    roomRating: Yup.number().required("Rating is Required"),
    noiseLevel: Yup.number().required("Noise Level is Required"),
    functioningRoom: Yup.boolean().required("Functioning Room is Required"),
    issueDetails: Yup.string().optional(),
  });
  const formik = useFormik({
    initialValues: {
      reviewText: review,
      roomRating: rating,
      noiseLevel: noise,
      functioningRoom: checked,
      issueDetails: issues,
      bookingID: props.bookingID,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      if (!checked && issues === "") {
        toast({
          title: "Review",
          description: "Please enter details about the room issues",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (rating === 0) {
        toast({
          title: "Review",
          description: "Please enter the room rating",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (noise === 0) {
        toast({
          title: "Review",
          description: "Please enter the room noise level",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log(values);
      submitReview();
      formik.resetForm();
      setSubmitting(false);
      setSubmitted(true);
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
  });
  return !submitted ? (
    <Card width="100%" color="telegram" variant="outline" background="gray.100">
      <CardHeader>
        <Heading size="md">New Room Review</Heading>
      </CardHeader>
      <CardBody>
        <FormControl>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={5} alignItems="center">
              <Stack width="100%" spacing={4}>
                <Stack width="100%">
                  <Text mb="8px">Enter a rating:</Text>
                  <RoomReview setRating={setRating} />
                </Stack>
                <Stack paddingTop="20px" paddingBottom="20px">
                  <Text mb="8px">Provide details about your review:</Text>
                  <Textarea
                    placeholder="Enter your review"
                    size="lg"
                    name="reviewText"
                    value={review}
                    onChange={(e) => {
                      setReview(e.target.value);
                    }}
                    borderColor={
                      (formik.errors.reviewText &&
                        formik.touched.reviewText &&
                        "red") ||
                      "black"
                    }
                  />
                </Stack>
                <Stack>
                  <NoiseReview setNoise={setNoise} />
                </Stack>
                <Stack paddingTop="20px">
                  <Checkbox
                    defaultChecked
                    isChecked={checked}
                    onChange={() => {
                      setChecked(!checked);
                    }}
                  >
                    All the equipment in the room was functioning
                  </Checkbox>
                </Stack>
                <HiddenField
                  isHidden={checked}
                  issues={issues}
                  setIssues={setIssues}
                />
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

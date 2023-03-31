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
} from "@chakra-ui/react";
import HiddenField from "components/fields/HiddenField";
import NoiseReview from "components/rating/NoiseReview";
import RoomReview from "components/rating/RoomReview";
import { UserContext } from "contexts/UserContext";

import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";

const RoomReviewForm = (bookingID: any) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [issues, setIssues] = useState("");
  const [checked, setChecked] = useState(true);
  const [noise, setNoise] = useState(1);

  const { loggedInUser } = useContext(UserContext);

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
      noiseLevel: noise,
      functioningRoom: true,
      issueDetails: issues,
      bookingID: bookingID,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      console.log(values);
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
                    value={formik.values.reviewText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.reviewText &&
                      formik.touched.reviewText &&
                      "red" || "black"
                    }
                  />
                </Stack>
                <Stack>
                  <NoiseReview setNoise={setNoise}/>
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

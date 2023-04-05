import { Card, Stack, Text, Textarea } from "@chakra-ui/react";
import NoiseReview from "components/rating/NoiseReview";
import RoomReview from "components/rating/RoomReview";

const ReviewCard = (props: { review: any }) => {
  const { review } = props;
  console.log("REVIEW OBJECT: ", review);
  return (
    <Stack>
      <Card border="2px" p="20px">
        <Stack spacing={2}>
          <Text fontWeight="bold">Rating: </Text>
          <RoomReview rating={review.room_rating} />
          <Textarea
            value={review.review}
            readOnly={true}
            mt="20px"
            mb="20px"
          ></Textarea>
          <Text fontWeight="bold">Noise Level: </Text>
          <NoiseReview value={true} noiseLevel={review.review_level} />
          {review.issue_details && (
            <>
              <Text fontWeight="bold">Other Issues: </Text>
              <Text>{review.issue_details}</Text>
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default ReviewCard;

import { Stack, Text } from "@chakra-ui/react";
import ReviewCard from "components/card/ReviewCard";


const ReviewMap = (props: {reviews: any}) => {

    const reviews = props.reviews;

    return reviews.length > 0 ? (
      <Stack>
        {reviews.map((review: any) => (
          <Stack key={review.review_id}>
            <ReviewCard review={review} />
          </Stack>
        ))}
      </Stack>
    ) : <Stack>
        <Text pl="10px" fontSize="20px">No reviews yet</Text>
    </Stack>;
}


export default ReviewMap;
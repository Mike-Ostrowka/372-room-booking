import { Button, Spacer, Stack, Text } from "@chakra-ui/react";
import ReviewCard from "components/card/ReviewCard";
import { useEffect, useState } from "react";


const ReviewList = (props: {reviews: any}) => {

    const [isHidden, setIsHidden] = useState(true);
    const reviews = props.reviews;

    return isHidden ? (
      <Stack paddingTop="150px" paddingLeft="50px">
        <Button
          variant="solid"
          colorScheme="teal"
          mr={3}
          onClick={() => {
            setIsHidden(false);
          }}
        >
          Show Reviews
        </Button>
      </Stack>
    ) : (
      <Stack>
        <Button
          variant="solid"
          colorScheme="teal"
          mr={3}
          onClick={() => {
            setIsHidden(true);
          }}
        >
          Hide Reviews
        </Button>
        <Stack>
          {reviews.map((review: any) => (
            <Stack key={review.review_id}>
              <ReviewCard review={review} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
}

export default ReviewList;
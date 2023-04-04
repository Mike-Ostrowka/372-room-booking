import { Card, Stack, Text, Textarea } from "@chakra-ui/react";
import NoiseReview from "components/rating/NoiseReview";
import RoomReview from "components/rating/RoomReview";


const ReviewCard = (props: {review:any}) => {
    const {review} = props;
    return (
      <Stack>
        <Card border="2px" p="20px">
          <Text>Rating: </Text>
          <RoomReview rating={review.room_rating}/>
          <Textarea value={review.review} readOnly={true} mt="20px" mb="20px">
          </Textarea>
          <NoiseReview value={true}/>
          <Text>{review.issue_details}</Text>
        </Card>
      </Stack>
    );    
}

export default ReviewCard;
import { Card, CardBody, Stack, Text } from "@chakra-ui/react";

const Statistics = () => {
  return (
    <Stack direction="row" spacing={2} width="100%" justifyContent="center">
      <Card flex={1}>
        <CardBody>
          <Stack direction="row" justifyContent="space-around">
            <Text fontWeight="bold" fontSize={24}>
              Rooms Booked
            </Text>
            <Text fontWeight="bold" fontSize={24} color="red">
              0
            </Text>
          </Stack>
        </CardBody>
      </Card>
      <Card flex={1}>
        <CardBody>
          <Stack direction="row" justifyContent="space-around">
            <Text fontWeight="bold" fontSize={24}>
              Rooms Available
            </Text>
            <Text fontWeight="bold" fontSize={24} color="green">
              0
            </Text>
          </Stack>
        </CardBody>
      </Card>
      <Card flex={1}>
        <CardBody>
          <Stack direction="row" justifyContent="space-around">
            <Text fontWeight="bold" fontSize={24}>
              Upcoming Bookings
            </Text>
            <Text fontWeight="bold" fontSize={24} color="blue">
              0
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
};

export default Statistics;

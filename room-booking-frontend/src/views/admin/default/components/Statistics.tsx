import { Card, CardBody, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/statistics", {
          method: "GET",
          credentials: "include",
        });
        const statisticsRes = await res.json();
        console.log("STATS: ", statisticsRes);
        setStatistics(statisticsRes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchStats();
  }, []);
  return (
    <Stack direction="row" spacing={2} width="100%" justifyContent="center">
      <Card flex={1}>
        <CardBody>
          <Stack direction="row" justifyContent="space-around">
            <Text fontWeight="bold" fontSize={24}>
              Rooms Reviewed
            </Text>
            <Text fontWeight="bold" fontSize={24} color="red">
              {statistics ? statistics.reviews : "0"}
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
              {statistics ? statistics.available : "0"}
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
};

export default Statistics;

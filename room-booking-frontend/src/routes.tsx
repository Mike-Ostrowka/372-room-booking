import { Icon } from "@chakra-ui/react";
import { MdHome, MdSensorDoor } from "react-icons/md";

import MainDashboard from "views/admin/default";
import RoomBooking from "views/room-booking";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Book a Room",
    layout: "/admin",
    path: "/room-booking",
    icon: <Icon as={MdSensorDoor} width="20px" height="20px" color="inherit" />,
    component: RoomBooking,
  },
];

export default routes;

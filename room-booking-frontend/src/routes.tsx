import { Icon } from "@chakra-ui/react";
import { MdHome, MdSensorDoor, MdMap, MdSearch } from "react-icons/md";

import MainDashboard from "views/admin/default";
import RoomBooking from "views/room-booking";
import MapTab from "views/map";
import RoomSearch from "views/search";

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
  {
    name: "Map",
    layout: "/admin",
    path: "/map",
    icon: <Icon as={MdMap} width="20px" height="20px" color="inherit" />,
    component: MapTab,
  },
  {
    name: "Room Search",
    layout: "/admin",
    path: "/search",
    icon: <Icon as={MdSearch} width="20px" height="20px" color="inherit" />,
    component: RoomSearch,
  },
];

export default routes;

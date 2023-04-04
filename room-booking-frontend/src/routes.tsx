import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdSensorDoor,
  MdMap,
  MdReport,
  MdSearch,
  MdSettings,
} from "react-icons/md";

import MainDashboard from "views/admin/default";
import RoomBooking from "views/room-booking";
import MapTab from "views/map";
import RoomSearch from "views/search";
import StaffRoomsComponent from "views/staff/rooms";
import StaffLostItems from "views/staff/lost-items";
import LostItems from "views/lost-and-found";

import { useContext } from "react";
import { UserContext } from "contexts/UserContext";

const routes = () => {
  const { loggedInUser } = useContext(UserContext);

  return loggedInUser !== null && loggedInUser.is_staff
    ? [
        {
          name: "Manage Rooms",
          layout: "/admin",
          path: "/default",
          icon: (
            <Icon as={MdSettings} width="20px" height="20px" color="inherit" />
          ),
          component: StaffRoomsComponent,
        },
        {
          name: "Manage Lost Items",
          layout: "/admin",
          path: "/admin-lost-items",
          icon: (
            <Icon as={MdReport} width="20px" height="20px" color="inherit" />
          ),
          component: StaffLostItems,
        },
      ]
    : [
        {
          name: "Dashboard",
          layout: "/admin",
          path: "/default",
          icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
          component: MainDashboard,
        },
        {
          name: "Room Search",
          layout: "/admin",
          path: "/search",
          icon: (
            <Icon as={MdSearch} width="20px" height="20px" color="inherit" />
          ),
          component: RoomSearch,
        },
        {
          name: "Book a Room",
          layout: "/admin",
          path: "/room-booking",
          icon: (
            <Icon
              as={MdSensorDoor}
              width="20px"
              height="20px"
              color="inherit"
            />
          ),
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
          name: "Lost and Found",
          layout: "/admin",
          path: "/lost-and-found",
          icon: (
            <Icon as={MdReport} width="20px" height="20px" color="inherit" />
          ),
          component: LostItems,
        },
      ];
};

export default routes;

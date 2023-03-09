// Image
import sfssLogo from "assets/img/logos/sfss-logo.png";
// Chakra imports
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <Image width="50%" marginBottom={5} src={sfssLogo} />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;

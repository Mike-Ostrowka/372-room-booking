import ReactDOM from "react-dom";
import App from "./root";
import theme from "./theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./contexts/UserContext";
import { SearchProvider } from "contexts/SearchContext";
import { RoomProvider } from "contexts/RoomContext";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <UserProvider>
      <SearchProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </SearchProvider>
    </UserProvider>
  </ChakraProvider>,
  document.getElementById("root")
);

import ReactDOM from "react-dom";
import App from "./root";
import theme from "./theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <UserProvider>
      <App />
    </UserProvider>
  </ChakraProvider>,
  document.getElementById("root")
);

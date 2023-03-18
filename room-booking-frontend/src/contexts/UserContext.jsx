import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem("user") 
    return storedUser ? JSON.parse(storedUser) : null
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(loggedInUser))
  }, [loggedInUser])

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

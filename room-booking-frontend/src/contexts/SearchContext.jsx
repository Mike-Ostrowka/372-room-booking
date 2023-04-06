import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchCriteria, setSearchCriteria] = useState(null);

  return (
    <SearchContext.Provider value={{ searchCriteria, setSearchCriteria }}>
      {children}
    </SearchContext.Provider>
  ); 
};

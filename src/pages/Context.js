import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const useHeaderContext = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
  const [headerStyle, setHeaderStyle] = useState({});

  return (
    <HeaderContext.Provider value={{ headerStyle, setHeaderStyle }}>
      {children}
    </HeaderContext.Provider>
  );
};

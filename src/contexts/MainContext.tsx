import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export const MainContext = createContext({
  isLoading: false,
  setIsLoading: (value: boolean) => {},
  buttonType: "",
  setButtonType: (value: string) => {},
});

export const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonType, setButtonType] = useState<string>("");

  return (
    <MainContext.Provider value={{ isLoading, setIsLoading, buttonType, setButtonType }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => {
  return useContext(MainContext);
};

export default MainProvider;

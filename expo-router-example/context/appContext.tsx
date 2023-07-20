import React, { ReactNode, useContext } from "react";


interface AppContextValue {
  test: string
}

type AppContextProviderProps = {
  children: ReactNode
};

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {

  return (
    <AppContext.Provider
      value={{
        test: "toto"
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  return context;
}

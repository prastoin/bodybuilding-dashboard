import { createProgramBuilderMachine, ProgramBuilderMachineInterpreter } from "@/machines/ProgramBuilderMachine";
import { IS_TEST } from "@/types";
import { useInterpret } from "@xstate/react";
import React, { ReactNode, useContext, useMemo } from "react";


interface AppContextValue {
  programBuilderService: ProgramBuilderMachineInterpreter;
}

type AppContextProviderProps = {
  children: ReactNode
};

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {

  const programBuilderMachine = useMemo(
    () => createProgramBuilderMachine(),
    []
  );

  const programBuilderService = useInterpret(programBuilderMachine, {
    devTools: IS_TEST,
  });


  return (
    <AppContext.Provider
      value={{
        programBuilderService
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

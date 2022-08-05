import { useInterpret } from "@xstate/react";
import React, { useContext, useMemo } from "react";
import {
  AppMachineInterpreter,
  createProgramBuilderMachine,
} from "../machines/ProgramBuilderMachine";

interface AppContextValue {
  programBuilderService: AppMachineInterpreter;
}

type AppContextProviderProps = {};

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const programBuilderMachine = useMemo(
    () => createProgramBuilderMachine(),
    []
  );
  const programBuilderService = useInterpret(programBuilderMachine, {
    devTools: true,
  });
  ///

  return (
    <AppContext.Provider
      value={{
        programBuilderService: programBuilderService,
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

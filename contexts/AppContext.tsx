import { useInterpret } from "@xstate/react";
import React, { useContext, useMemo } from "react";
import {
  ProgramBuilderMachineInterpreter,
  createProgramBuilderMachine,
} from "../machines/ProgramBuilderMachine";
import {
  createSessionTrackerMachine,
  SessionTrackerMachineInterpreter,
} from "../machines/SessionTrackerMachine";
import { IS_TEST } from "../types";

interface AppContextValue {
  programBuilderService: ProgramBuilderMachineInterpreter;
  sessionTrackerService: SessionTrackerMachineInterpreter;
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

  const sessionTrackerMachine = useMemo(
    () => createSessionTrackerMachine(),
    []
  );

  const programBuilderService = useInterpret(programBuilderMachine, {
    devTools: IS_TEST,
  });

  const sessionTrackerService = useInterpret(sessionTrackerMachine, {
    devTools: IS_TEST,
  });
  ///

  return (
    <AppContext.Provider
      value={{
        programBuilderService,
        sessionTrackerService,
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

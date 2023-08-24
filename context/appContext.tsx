import { createProgramMachine, ProgramMachineInterpreter } from "@/machines/ProgramMachine";
import { createTrackerMachine, TrackerMachineInterpreter } from "@/machines/Tracker/TrackerMachine";
import { IS_TEST } from "@/types";
import { useInterpret } from "@xstate/react";
import React, { ReactNode, useContext, useMemo } from "react";


interface AppContextValue {
  programService: ProgramMachineInterpreter;
  trackerService: TrackerMachineInterpreter;
}

type AppContextProviderProps = {
  children: ReactNode
};

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {

  const programMachine = useMemo(
    () => createProgramMachine(),
    []
  );
  const programService = useInterpret(programMachine, {
    devTools: IS_TEST,
  });

  const trackerMachine = useMemo(() => createTrackerMachine(), []);
  const trackerService = useInterpret(trackerMachine, { devTools: IS_TEST, });


  return (
    <AppContext.Provider
      value={{
        programService,
        trackerService
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

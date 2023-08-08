import { useAppContext } from "@/context/appContext";
import { useSelector } from "@xstate/react";
import { SessionFormActorRef } from "../machines/SessionFormMachine";

export function useSessionFormActor():
  | SessionFormActorRef
  | undefined {
  const { programService: programBuilderService } = useAppContext();

  const sessionFormActor = useSelector(
    programBuilderService,
    (state) =>
      state.children.SessionForm as
      | SessionFormActorRef
      | undefined
  );

  return sessionFormActor;
}

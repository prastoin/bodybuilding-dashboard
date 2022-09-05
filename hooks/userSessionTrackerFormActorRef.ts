import { useSelector } from "@xstate/react";
import { useAppContext } from "../contexts/AppContext";
import { SessionTrackerFormActorRef } from "../machines/SessionTrackerFormMachine";

export function useSessionTrackerFormActorRef():
  | SessionTrackerFormActorRef
  | undefined {
  const { sessionTrackerService } = useAppContext();

  const sessionTrackerFormActorRef = useSelector(
    sessionTrackerService,
    (state) => state.children.InvokedSessionTrackerForm
  );

  return sessionTrackerFormActorRef;
}

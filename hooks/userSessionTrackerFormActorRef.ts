import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { context } from "msw";
import { Context } from "react";
import { useAppContext } from "../contexts/AppContext";
import { SessionTrackerFormActorRef, SessionTrackerFormMachineContext, SessionTrackerFormMachineState } from "../machines/SessionTrackerFormMachine";
import { SessionTrackerMachineContext } from "../machines/SessionTrackerMachine";

export function useSessionTrackerFormActorRef():
  SessionTrackerFormActorRef | undefined {
  const { sessionTrackerService } = useAppContext();

  const sessionTrackerFormActorRef = useSelector(
    sessionTrackerService,
    (state) => state.children.InvokedSessionTrackerForm as SessionTrackerFormActorRef
  );

  return sessionTrackerFormActorRef;
}

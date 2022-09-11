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
    (state) => state.children.InvokedSessionTrackerForm
  );

  return sessionTrackerFormActorRef;
}

export function retrieveSessionTrackerFormActorContext<ContextKey extends keyof SessionTrackerFormMachineContext>({ actor, contextKey }: { actor: SessionTrackerFormActorRef, contextKey: ContextKey }): SessionTrackerFormMachineContext[ContextKey] {
  function useSelectorHandlerForSessionTrackerFormState(state: SessionTrackerFormMachineState) {
    return state.context[contextKey]
  }

  return useSelector(actor, useSelectorHandlerForSessionTrackerFormState);
}
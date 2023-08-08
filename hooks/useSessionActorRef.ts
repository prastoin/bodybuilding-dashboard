import { useAppContext } from "@/context/appContext";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useSelector } from "@xstate/react";

export function useSessionActorRef(
  trainingSessionActorId: string
): SessionActorRef | undefined {
  const { programService: programBuilderService } = useAppContext();

  const sessionActorRefList = useSelector(
    programBuilderService,
    (state) => state.context.sessionActorRefList
  );

  const relatedSessionActorRef = sessionActorRefList.find(
    (actor) => actor.id === trainingSessionActorId
  );

  return relatedSessionActorRef;
}

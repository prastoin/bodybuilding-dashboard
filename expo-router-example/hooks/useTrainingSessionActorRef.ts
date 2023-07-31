import { useAppContext } from "@/context/appContext";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useSelector } from "@xstate/react";

export function useTrainingSessionActorRef(
  trainingSessionActorId: string
): SessionActorRef | undefined {
  const { programBuilderService } = useAppContext();

  const trainingSessionActorRefCollection = useSelector(
    programBuilderService,
    (state) => state.context.trainingSessionActorRefCollection
  );

  const relatedTrainingSessionActorRef = trainingSessionActorRefCollection.find(
    (actor) => actor.id === trainingSessionActorId
  );

  return relatedTrainingSessionActorRef;
}

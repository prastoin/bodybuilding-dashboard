import { useSelector } from "@xstate/react";
import { useAppContext } from "../contexts/AppContext";
import { TrainingSessionActorRef } from "../machines/TrainingSessionMachine";

export function useTrainingSessionActorRef(
  trainingSessionActorId: string
): TrainingSessionActorRef | undefined {
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

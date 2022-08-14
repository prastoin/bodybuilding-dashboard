import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { TrainingSessionExerciseActorRef } from "../machines/TrainingSessionExerciseMachine";
import { useTrainingSessionActorRef } from "./useTrainingSessionActorRef";

/**
 * Throw an error if no related training session actor is found
 */
export function useExerciseActorRef({
  trainingSessionId,
  exerciseId,
}: {
  trainingSessionId: string;
  exerciseId: string;
}): TrainingSessionExerciseActorRef | undefined {
  const relatedTrainingSessionActorRef =
    useTrainingSessionActorRef(trainingSessionId);

  invariant(
    relatedTrainingSessionActorRef !== undefined,
    "relatedTrainingSessionActorRef is undefined"
  );

  const allExercisesActorRef = useSelector(
    relatedTrainingSessionActorRef,
    (state) => state.context.trainingSessionExerciseActorRefCollection
  );

  return allExercisesActorRef.find(
    (exerciseActor) => exerciseActor.id === exerciseId
  );
}

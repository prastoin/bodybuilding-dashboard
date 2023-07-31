import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { useTrainingSessionActorRef } from "./useTrainingSessionActorRef";

/**
 * Throw an error if no related training session actor is found
 */
export function useExerciseActorRef({
  sessionId,
  exerciseId,
}: {
  sessionId: string;
  exerciseId: string;
}): ExerciseActorRef | undefined {
  const relatedTrainingSessionActorRef =
    useTrainingSessionActorRef(sessionId);

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

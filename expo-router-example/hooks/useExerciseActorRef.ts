import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { useSessionActorRef } from "./useSessionActorRef";

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
  const relatedSessionActorRef =
    useSessionActorRef(sessionId);

  invariant(
    relatedSessionActorRef !== undefined,
    "relatedTrainingSessionActorRef is undefined"
  );

  const allExercisesActorRef = useSelector(
    relatedSessionActorRef,
    (state) => state.context.exerciseActorRefList
  );

  return allExercisesActorRef.find(
    (exerciseActor) => exerciseActor.id === exerciseId
  );
}

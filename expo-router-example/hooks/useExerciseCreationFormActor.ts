import { ExerciseFormActorRef } from "@/machines/ExerciseFormMachine";
import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { useTrainingSessionActorRef } from "./useTrainingSessionActorRef";

export function useExerciseCreationFormActor(
  trainingSessionId: string
): ExerciseFormActorRef | undefined {
  const trainingSessionActor = useTrainingSessionActorRef(trainingSessionId);

  invariant(
    trainingSessionActor !== undefined,
    "training Session actor is undefined"
  );

  const exerciseCreationForm = useSelector(
    trainingSessionActor,
    (state) => state.children.ExerciseCreationForm as
      | ExerciseFormActorRef
      | undefined
  );

  return exerciseCreationForm;
}

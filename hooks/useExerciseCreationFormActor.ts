import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { ExerciseCreationFormActorRef } from "../machines/ExerciseCreationFormMachine";
import { useTrainingSessionActorRef } from "./useTrainingSessionActorRef";

export function useExerciseCreationFormActor(
  trainingSessionId: string
): ExerciseCreationFormActorRef | undefined {
  const trainingSessionActor = useTrainingSessionActorRef(trainingSessionId);

  invariant(
    trainingSessionActor !== undefined,
    "training Session actor is undefined"
  );

  const exerciseCreationForm = useSelector(
    trainingSessionActor,
    (state) => state.children.ExerciseCreationForm
  );

  return exerciseCreationForm;
}

import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { ExerciseCreationFormActorRef } from "../machines/ExerciseCreationFormMachine";
import { useTrainingSessionActorRef } from "./useTrainingSessionActorRef";

export function useExerciseCreationFormActor(
  trainingSessionId: string
): ExerciseCreationFormActorRef | undefined {
  console.log("ENTER useExerciseCreationFormActor");
  const trainingSessionActor = useTrainingSessionActorRef(trainingSessionId);

  console.log(useExerciseCreationFormActor);
  invariant(
    trainingSessionActor !== undefined,
    "training Session actor is undefined"
  );

  const exerciseCreationForm = useSelector(
    trainingSessionActor,
    (state) => state.children.ExerciseCreationForm
  );

  console.log({ exerciseCreationForm });
  return exerciseCreationForm;
}

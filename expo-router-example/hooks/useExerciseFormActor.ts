import { ExerciseFormActorRef } from "@/machines/ExerciseFormMachine";
import { useSelector } from "@xstate/react";
import invariant from "invariant";
import { useSessionActorRef } from "./useSessionActorRef";

export function useExerciseFormActor(
  sessionId: string
): ExerciseFormActorRef | undefined {
  const sessionActor = useSessionActorRef(sessionId);

  invariant(
    sessionActor !== undefined,
    "training Session actor is undefined"
  );

  const exerciseForm = useSelector(
    sessionActor,
    (state) => state.children.ExerciseForm as
      | ExerciseFormActorRef
      | undefined
  );

  return exerciseForm;
}

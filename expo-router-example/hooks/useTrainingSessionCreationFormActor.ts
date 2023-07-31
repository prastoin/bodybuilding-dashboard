import { useAppContext } from "@/context/appContext";
import { useSelector } from "@xstate/react";
import { SessionFormActorRef } from "../machines/SessionFormMachine";

export function useTrainingSessionCreationFormActor():
  | SessionFormActorRef
  | undefined {
  const { programBuilderService } = useAppContext();

  const trainingSessionCreationFormActor = useSelector(
    programBuilderService,
    (state) =>
      state.children.TrainingSessionCreationForm as
      | SessionFormActorRef
      | undefined
  );

  return trainingSessionCreationFormActor;
}

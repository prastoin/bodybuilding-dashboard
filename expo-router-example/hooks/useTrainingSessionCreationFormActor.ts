import { useAppContext } from "@/context/appContext";
import { useSelector } from "@xstate/react";
import { TrainingSessionCreationFormActorRef } from "../machines/TrainingSessionCreationFormMachine";

export function useTrainingSessionCreationFormActor():
  | TrainingSessionCreationFormActorRef
  | undefined {
  const { programBuilderService } = useAppContext();

  const trainingSessionCreationFormActor = useSelector(
    programBuilderService,
    (state) =>
      state.children.TrainingSessionCreationForm as
        | TrainingSessionCreationFormActorRef
        | undefined
  );

  return trainingSessionCreationFormActor;
}

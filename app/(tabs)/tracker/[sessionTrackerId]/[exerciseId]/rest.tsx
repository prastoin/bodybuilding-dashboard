import { NumberInputFormContent, NumberInputFormValues } from "@/components/set/NumberInputContent";
import { useSetFormMachine } from "@/hooks/useTrackerHooks";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateSetRestFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rest">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View>Aie aie aie go back</View>)
  }

  const defaultRest = useSelector(
    setFormMachineRef,
    (state) => state.context.set.rest
  );

  const handleGoNext = ({ value: rest }: NumberInputFormValues) => {
    setFormMachineRef.send({
      type: "USER_UPDATED_FIELD",
      update: {
        rest
      }
    });
  };

  const handleGoBack = () => {
    setFormMachineRef.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <NumberInputFormContent
      testId={`exercise-editor-form-load-${setFormMachineRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultValue={defaultRest}
      handleOnSubmit={handleGoNext}
    />
  );
};

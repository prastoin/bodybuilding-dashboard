import { NumberInputFormContent, NumberInputFormValues } from "@/components/set/NumberInputContent";
import { useSetFormMachine } from "@/hooks/useTrackerHooks";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateSetLoadFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/load">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View>Aie aie aie go back</View>)
  }

  const handleGoNext = ({ value: load }: NumberInputFormValues) => {
    setFormMachineRef.send({
      type: "USER_UPDATED_FIELD",
      update: {
        load
      }
    });
  };

  const handleGoBack = () => {
    setFormMachineRef.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  const defaultLoad = useSelector(
    setFormMachineRef,
    (state) => state.context.set.load
  );

  return (
    <NumberInputFormContent
      testId={`exercise-editor-form-load-${setFormMachineRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultValue={defaultLoad}
      handleOnSubmit={handleGoNext}
    />
  );
};

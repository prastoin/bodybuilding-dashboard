import { NumberInputFormContent, NumberInputFormValues } from "@/components/set/NumberInputContent";
import { useSetFormMachine } from "@/hooks/useTrackerHooks";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateSetRepRirFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/repRir">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View>Aie aie aie go back</View>)
  }

  const handleGoNext = ({ value }: NumberInputFormValues) => {
    // TODO TMP same value will have to handle several input form
    setFormMachineRef.send({
      type: "USER_UPDATED_FIELD",
      update: {
        rep: value,
        rir: value
      }
    });
  };

  const handleGoBack = () => {
    setFormMachineRef.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  const defaultRep = useSelector(
    setFormMachineRef,
    (state) => state.context.set.rep
  );

  return (
    <NumberInputFormContent
      testId={`exercise-editor-form-load-${setFormMachineRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultValue={defaultRep}
      handleOnSubmit={handleGoNext}
    />
  );
};

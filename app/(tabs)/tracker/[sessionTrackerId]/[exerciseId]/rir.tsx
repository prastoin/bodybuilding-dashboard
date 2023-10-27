import { NumberInputFormContent, NumberInputFormValues } from "@/components/set/NumberInputContent";
import { StackHeaderTitle } from "@/components/set/StackHeaderTitle";
import { useSetFormMachine } from "@/hooks/useTrackerHooks";
import { SetFormActorRef } from "@/machines/Tracker/SetFormMachine";
import { useSelector } from "@xstate/react";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";


interface ContentProps {
  setFormMachineRef: SetFormActorRef
}
const Content: React.FC<ContentProps> = ({ setFormMachineRef }) => {

  const handleGoNext = ({ value }: NumberInputFormValues) => {
    setFormMachineRef.send({
      type: "USER_UPDATED_FIELD",
      update: {
        rir: value
      }
    });
  };

  const handleGoBack = () => {
    setFormMachineRef.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  const defaultRir = useSelector(
    setFormMachineRef,
    (state) => state.context.set.rir
  );

  return (
    <StackHeaderTitle field="rest" setFormMachineRef={setFormMachineRef}>
      <NumberInputFormContent
        placeholder="rir"
        testId={`tracker-set-form-rir-${setFormMachineRef.id}`}
        handleOnGoBack={handleGoBack}
        defaultValue={defaultRir}
        handleOnSubmit={handleGoNext}
      />
    </StackHeaderTitle>
  );
}

export default function CreateSetRepRirFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rir">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View><Text>Could not found setFormMachineRef</Text></View>)
  }

  return <Content setFormMachineRef={setFormMachineRef} />
};

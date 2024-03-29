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
    <StackHeaderTitle field="rest" setFormMachineRef={setFormMachineRef}>
      <NumberInputFormContent
        placeholder="rest"
        testId={`tracker-set-form-rest-${setFormMachineRef.id}`}
        handleOnGoBack={handleGoBack}
        defaultValue={defaultRest}
        handleOnSubmit={handleGoNext}
      />
    </StackHeaderTitle >)
}

export default function CreateSetRestFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rest">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View>
      <Text>Could not find the setFormMachineRef</Text>
    </View>)
  }

  return <Content setFormMachineRef={setFormMachineRef} />
};

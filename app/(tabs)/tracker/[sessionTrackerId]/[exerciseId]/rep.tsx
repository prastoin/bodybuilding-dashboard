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
        rep: value,
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
    <StackHeaderTitle field="rep" setFormMachineRef={setFormMachineRef}>
      <NumberInputFormContent
        placeholder="rep"
        testId={`tracker-set-form-rep-${setFormMachineRef.id}`}
        handleOnGoBack={handleGoBack}
        defaultValue={defaultRep}
        handleOnSubmit={handleGoNext}
      />
    </StackHeaderTitle>
  );
}

export default function CreateSetRepRirFormScreen() {
  const { sessionTrackerId, exerciseId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rep">();
  const setFormMachineRef = useSetFormMachine({
    exerciseId, sessionTrackerId
  })

  if (setFormMachineRef === undefined) {
    return (<View><Text>Could not found setFormMachineRef</Text></View>)
  }

  return <Content setFormMachineRef={setFormMachineRef} />
};

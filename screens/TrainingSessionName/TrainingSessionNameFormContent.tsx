import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

export interface TrainingSessionCreationFormNameFormFieldValues {
  sessionTrainingName: string;
}

interface TrainingSessionCreationFormNameContentProps {
  handleOnSubmit: SubmitHandler<TrainingSessionCreationFormNameFormFieldValues>;
  testId: string;
}

export const TrainingSessionFormNameContent: React.FC<
  TrainingSessionCreationFormNameContentProps
> = ({ handleOnSubmit, testId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingSessionCreationFormNameFormFieldValues>();

  const tailwind = useTailwind();
  const defaultTrainingSessionName = "";
  return (
    <View testID={testId}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Name"
          />
        )}
        name="sessionTrainingName"
        defaultValue={defaultTrainingSessionName}
      />
      {errors.sessionTrainingName && (
        <Text style={tailwind("text-red-500")} accessibilityRole="alert">
          A session training name must be set.
        </Text>
      )}

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </View>
  );
};

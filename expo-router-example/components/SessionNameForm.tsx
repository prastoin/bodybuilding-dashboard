import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput } from "react-native";
import AppScreen from "./AppScreen";

export interface TrainingSessionCreationFormNameFormFieldValues {
  sessionTrainingName: string;
}

interface TrainingSessionCreationFormNameContentProps {
  handleOnSubmit: SubmitHandler<TrainingSessionCreationFormNameFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
}

export const SessionNameForm: React.FC<
  TrainingSessionCreationFormNameContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingSessionCreationFormNameFormFieldValues>();

  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        handleOnGoBack();
      }),
    [navigation]
  );

  const defaultTrainingSessionName = "";
  return (
    <AppScreen testID={testId}>
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
        <Text className="text-red-500" accessibilityRole="alert">
          A session training name must be set.
        </Text>
      )}

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import AppScreen from "../../components/AppScreen";

export interface ExerciseNameFormFieldValues {
  exerciseName: string;
}

interface ExerciseNameFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseNameFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
}

export const ExerciseNameFormContent: React.FC<
  ExerciseNameFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseNameFormFieldValues>();

  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        handleOnGoBack();
      }),
    [navigation]
  );

  const tailwind = useTailwind();
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
        name="exerciseName"
        defaultValue={defaultTrainingSessionName}
      />
      {errors.exerciseName && (
        <Text style={tailwind("text-red-500")} accessibilityRole="alert">
          An exercise name must be set.
        </Text>
      )}

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

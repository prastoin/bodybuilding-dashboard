import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { Seconds } from "@/types";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import AppScreen from "./AppScreen";

export interface ExerciseRestFormFieldValues {
  value: Seconds
}

interface ExerciseRestFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseRestFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
  defaultRest?: Seconds;
}

export const ExerciseFormRestContent: React.FC<
  ExerciseRestFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId, defaultRest }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseRestFormFieldValues>({
    defaultValues: {
      value:
        defaultRest !== undefined
          ? defaultRest
          : 0,
    }
  });

  useBeforeRemove(() => handleOnGoBack())

  return (
    <AppScreen testID={testId}>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
            min: 0,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID={`rest-minute-${value}`}
              value={`${value}`}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Rest"
              keyboardType="numeric"
            />
          )}
          name="value"
        />
        {errors.value && (
          <Text className="text-red-500" accessibilityRole="alert">
            Please enter a valid input
          </Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

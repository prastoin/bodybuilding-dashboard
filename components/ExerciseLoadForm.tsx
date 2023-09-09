import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { Kilograms } from "@/types";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import AppScreen from "./AppScreen";

export interface ExerciseLoadFormFieldValues {
  value: Kilograms
}

interface ExerciseLoadFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseLoadFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
  defaultLoad?: Kilograms;
}

export const ExerciseFormLoadContent: React.FC<
  ExerciseLoadFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId, defaultLoad }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseLoadFormFieldValues>({
    defaultValues: {
      value: defaultLoad !== undefined
        ? defaultLoad
        : 0,
    }
  });

  useBeforeRemove(() => handleOnGoBack())

  return (
    <AppScreen testID={testId}>
      <View className="flex-row w-full">
        <Controller
          control={control}
          rules={{
            required: true,
            min: 1,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={`${value}`}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Load"
              keyboardType="numeric"
            />
          )}
          name="value"
        />
        {errors.value && (
          <Text className="text-red-500" accessibilityRole="alert">
            A load value must be set.
          </Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

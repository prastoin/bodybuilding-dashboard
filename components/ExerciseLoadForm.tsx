import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { ExerciseLoad } from "@/types";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import AppScreen from "./AppScreen";

export interface ExerciseLoadFormFieldValues extends ExerciseLoad { }

interface ExerciseLoadFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseLoadFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
  defaultLoad?: ExerciseLoad;
}

export const ExerciseFormLoadContent: React.FC<
  ExerciseLoadFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId, defaultLoad }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseLoadFormFieldValues>({
    defaultValues:
      defaultLoad !== undefined
        ? defaultLoad
        : {
          unit: "kg",
          value: 0,
        },
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
      <View className="flex-row w-full">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              className="w-full"
              testID={`load-unit-${value}`}
              selectedValue={value}
              onValueChange={onChange}
              onBlur={onBlur}
            >
              <Picker.Item label="kg" value={"kg"} />
              <Picker.Item label="lbs" value={"lbs"} />
            </Picker>
          )}
          name="unit"
        />
        {errors.unit && (
          <Text className="text-red-500" accessibilityRole="alert">
            An unknown error occured with your load unit.
          </Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

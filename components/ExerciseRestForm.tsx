import { ExerciseRest } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";
import AppScreen from "./AppScreen";

export interface ExerciseRestFormFieldValues extends ExerciseRest { }

interface ExerciseRestFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseRestFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
  defaultRest?: ExerciseRest;
}

export const ExerciseFormRestContent: React.FC<
  ExerciseRestFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId, defaultRest }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseRestFormFieldValues>({
    defaultValues:
      defaultRest !== undefined
        ? defaultRest
        : {
          minute: 0,
          second: 0,
        },
  });

  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        handleOnGoBack();
      }),
    [navigation]
  );

  const getDurationPickerItems = () => {
    return Array.from({ length: 60 }).map((_v, index) => (
      <Picker.Item label={`${index}`} value={index} />
    ));
  };

  return (
    <AppScreen testID={testId}>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
            min: 0,
            max: 59,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              testID={`rest-minute-${value}`}
              selectedValue={value}
              onValueChange={onChange}
              onBlur={onBlur}
            >
              {getDurationPickerItems()}
            </Picker>
          )}
          name="minute"
        />
        {errors.minute && (
          <Text className="text-red-500" accessibilityRole="alert">
            An unknown error occured with your minute duration.
          </Text>
        )}
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
            min: 0,
            max: 60,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              testID={`rest-second-${value}`}
              selectedValue={value}
              onValueChange={onChange}
              onBlur={onBlur}
            >
              {getDurationPickerItems()}
            </Picker>
          )}
          name="second"
        />
        {errors.second && (
          <Text className="text-red-500" accessibilityRole="alert">
            An unknown error occured with your second duration.
          </Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

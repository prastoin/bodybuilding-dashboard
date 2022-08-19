import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import AppScreen from "../../components/AppScreen";
import { ExerciseLoad } from "../../types";

export interface ExerciseLoadFormFieldValues extends ExerciseLoad {}

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

  const navigation = useNavigation();

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        handleOnGoBack();
      }),
    [navigation]
  );

  const tailwind = useTailwind();
  return (
    <AppScreen testID={testId}>
      <View style={tailwind("flex-row")}>
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
          <Text style={tailwind("text-red-500")} accessibilityRole="alert">
            A load value must be set.
          </Text>
        )}
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
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
          <Text style={tailwind("text-red-500")} accessibilityRole="alert">
            An unknown error occured with your load unit.
          </Text>
        )}
      </View>

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

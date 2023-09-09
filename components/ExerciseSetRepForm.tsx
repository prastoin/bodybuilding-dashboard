import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";
import AppScreen from "./AppScreen";

export interface ExerciseSetAndRepFormFieldValues {
  set: number;
  rep: number;
}

interface ExerciseSetAndRepFormContentProps {
  handleOnSubmit: SubmitHandler<ExerciseSetAndRepFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
  defaultSet?: number;
  defaultRep?: number;
}

export const ExerciseFormSetAndRepContent: React.FC<
  ExerciseSetAndRepFormContentProps
> = ({
  handleOnSubmit,
  handleOnGoBack,
  testId,
  defaultRep,
  defaultSet,
}) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ExerciseSetAndRepFormFieldValues>({
      defaultValues: {
        rep: defaultRep === undefined ? 0 : defaultRep,
        set: defaultSet === undefined ? 0 : defaultSet,
      },
    });

    useBeforeRemove(() => handleOnGoBack())

    return (
      <AppScreen testID={testId}>
        <View className="flex-col w-full">
          <>
            <Text>Sets</Text>
            <Controller
              control={control}
              rules={{
                required: true,
                min: 1,
                max: 10,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Picker
                  className="w-full"
                  testID={`set-counter-${value}`}
                  selectedValue={value}
                  onValueChange={onChange}
                  onBlur={onBlur}
                >
                  <Picker.Item label="0" value={0} enabled={false} />
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                  <Picker.Item label="5" value={5} />
                  <Picker.Item label="6" value={6} />
                  <Picker.Item label="7" value={7} />
                  <Picker.Item label="8" value={8} />
                  <Picker.Item label="9" value={9} />
                  <Picker.Item label="10" value={10} />
                </Picker>
              )}
              name="set"
            />
            {errors.set && (
              <Text className="text-red-500" accessibilityRole="alert">
                A set number must be set.
              </Text>
            )}
          </>

          <>
            <Text>Reps</Text>

            <Controller
              control={control}
              rules={{
                required: true,
                min: 1,
                max: 20,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Picker
                  className="w-full"
                  testID={`rep-counter-${value}`}
                  selectedValue={value}
                  onValueChange={onChange}
                  onBlur={onBlur}
                >
                  <Picker.Item label="0" value={0} enabled={false} />
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                  <Picker.Item label="5" value={5} />
                  <Picker.Item label="6" value={6} />
                  <Picker.Item label="7" value={7} />
                  <Picker.Item label="8" value={8} />
                  <Picker.Item label="9" value={9} />
                  <Picker.Item label="10" value={10} />
                  <Picker.Item label="11" value={11} />
                  <Picker.Item label="12" value={12} />
                  <Picker.Item label="13" value={13} />
                  <Picker.Item label="14" value={14} />
                  <Picker.Item label="15" value={15} />
                  <Picker.Item label="16" value={16} />
                  <Picker.Item label="17" value={17} />
                  <Picker.Item label="18" value={18} />
                  <Picker.Item label="19" value={19} />
                  <Picker.Item label="20" value={20} />
                </Picker>
              )}
              name="rep"
            />
          </>
          {errors.rep && (
            <Text className="text-red-500" accessibilityRole="alert">
              A repetition number must be set.
            </Text>
          )}
        </View>

        <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
      </AppScreen>
    );
  };

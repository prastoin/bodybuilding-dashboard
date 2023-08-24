import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput } from "react-native";
import AppScreen from "./AppScreen";

export interface SessionFormNameFormFieldValues {
  name: string;
}

interface SessionFormNameContentProps {
  handleOnSubmit: SubmitHandler<SessionFormNameFormFieldValues>;
  handleOnGoBack: () => void;
  testId: string;
}

export const SessionNameForm: React.FC<
  SessionFormNameContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionFormNameFormFieldValues>();

  useBeforeRemove(() => handleOnGoBack())

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
        name="name"
        defaultValue={""}
      />
      {errors.name && (
        <Text className="text-red-500" accessibilityRole="alert">
          A session training name must be set.
        </Text>
      )}

      <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
    </AppScreen>
  );
};

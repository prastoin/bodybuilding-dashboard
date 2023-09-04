import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import AppScreen from "../AppScreen";

export interface NumberInputFormValues {
    value: number,
}

interface NumberFormContentProps {
    handleOnSubmit: SubmitHandler<NumberInputFormValues>;
    handleOnGoBack: () => void;
    testId: string;
    defaultValue?: number;
}

export const NumberInputFormContent: React.FC<
    NumberFormContentProps
> = ({ handleOnSubmit, handleOnGoBack, testId, defaultValue }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NumberInputFormValues>({
        defaultValues: {
            value: defaultValue !== undefined
                ? defaultValue
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
                        A value must be set.
                    </Text>
                )}
            </View>

            <Button title="Submit" onPress={handleSubmit(handleOnSubmit)}></Button>
        </AppScreen>
    );
};

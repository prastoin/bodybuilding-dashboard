import { SetFormActorRef, SetFormFields } from "@/machines/Tracker/SetFormMachine";
import { useSelector } from "@xstate/react";
import { Stack } from "expo-router";
import { PropsWithChildren } from "react";

export const StackHeaderTitle: React.FC<PropsWithChildren & {
    setFormMachineRef: SetFormActorRef
    field: SetFormFields
}> = ({ setFormMachineRef, children, field }) => {
    const name = useSelector(setFormMachineRef, (state) => state.context.name)

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitle: `${name} ${field}`,
                }}
            />
            {children}
        </>
    );
}
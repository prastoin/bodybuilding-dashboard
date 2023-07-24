import { Stack } from 'expo-router';

export default function SessionLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="createName"
                options={{
                    headerTitle: "Exercise Name",
                }}
            />
            <Stack.Screen
                name="[sessionId]"
                options={{
                    headerTitle: "Exercise Name",
                }}
            />
        </Stack>
    );
}

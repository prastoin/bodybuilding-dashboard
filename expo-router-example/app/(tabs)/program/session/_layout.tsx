import { Stack } from 'expo-router';

export default function SessionLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="createName"
                options={{
                    headerTitle: "Pick a session name",
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

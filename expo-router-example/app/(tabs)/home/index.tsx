import AppScreen from "@/components/AppScreen";
import * as React from "react";
import { Text } from "react-native";

export default function HomeScreen() {
    return (
        <AppScreen testID="home-screen-container">
            <Text className="text-blue-600">Home Screen</Text>
        </AppScreen>
    );
};

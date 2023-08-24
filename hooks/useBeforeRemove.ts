import { useNavigation } from "expo-router/src/useNavigation";
import React from "react";

type UseBeforeRemoveArgs = () => void
export function useBeforeRemove(handler: UseBeforeRemoveArgs) {
    const navigation = useNavigation();
    React.useEffect(
        () => {
            navigation.addListener("beforeRemove", () => handler())
            return () => navigation.removeListener("beforeRemove", handler)
        },
        [navigation]
    );
}

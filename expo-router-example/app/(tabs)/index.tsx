import { useAppContext } from "@/context/appContext";
import { Text, View } from "react-native";

export default function TabOneScreen() {
  const appContext = useAppContext();

  return (
    <View className='w-80 bg-white shadow rounded'>
      <Text className="text-blue-600 font-bold">Tab One {appContext.test}</Text>
    </View>
  );
}

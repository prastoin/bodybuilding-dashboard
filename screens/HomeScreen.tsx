import { Button, Text, View } from "react-native";
import { RootHomeScreenProps } from "../navigation/RootStack";

export const HomeScreen: React.FC<RootHomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

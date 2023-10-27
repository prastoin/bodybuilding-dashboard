import { FontAwesome } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { BaseButton, BaseButtonProps } from "react-native-gesture-handler"

// TODO REFACTOR
export const RemoveButton: React.FC<BaseButtonProps & { title: string }> = ({ title, ...props }) => (
    <BaseButton  {...props}>
        <View accessible className="flex items-center justify-center">
            <FontAwesome name="trash" size={24} color="red" />
        </View>
    </BaseButton>
)
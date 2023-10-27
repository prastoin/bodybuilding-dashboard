import { Entypo } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { BaseButton, BaseButtonProps } from "react-native-gesture-handler"

// TODO REFACTOR
export const AddButton: React.FC<BaseButtonProps & { title: string }> = ({ title, ...props }) => (
    <BaseButton  {...props}>
        <View accessible className="flex-row justify-between items-center text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
            <Text className="text-white">{title}</Text>
            <Entypo name="add-to-list" size={24} color="white" />
        </View>
    </BaseButton>
)
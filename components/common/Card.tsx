import { PropsWithChildren } from "react";
import { View } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";

export const Card: React.FC<PropsWithChildren & ViewProps> = ({ children, ...props }) => {
    return <View
        {...props}
        className="max-w-sm  my-6 rounded overflow-hidden shadow-lg"
    >
        {children}
    </View>
}
import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { defaultStyles } from "~/constants/Styles";

export default function ComingSoon() {
    return (
        <SafeAreaView className="flex-1 justify-center align-middle">
            <View style={defaultStyles.container}>
                <View>
                    <Text>Coming Soon</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
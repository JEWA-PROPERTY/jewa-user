import { SafeAreaView, View, StyleSheet, JewaText } from "react-native";
import { defaultStyles } from "~/constants/Styles";

export default function ComingSoon() {
    return (
        <SafeAreaView className="flex-1 justify-center align-middle">
            <View style={defaultStyles.container}>
                <View>
                    <JewaText>Coming Soon</JewaText>
                </View>
            </View>
        </SafeAreaView>
    );
}
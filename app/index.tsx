import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import { Link } from 'expo-router';
import Colors from '~/constants/Colors';

import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light_Italic,
    Nunito_400Regular_Italic,
    Nunito_500Medium_Italic,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black_Italic,
} from '@expo-google-fonts/nunito';

export default function Home() {
    let [fontsLoaded] = useFonts({
        Nunito_200ExtraLight,
        Nunito_300Light,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
        Nunito_900Black,
        Nunito_200ExtraLight_Italic,
        Nunito_300Light_Italic,
        Nunito_400Regular_Italic,
        Nunito_500Medium_Italic,
        Nunito_600SemiBold_Italic,
        Nunito_700Bold_Italic,
        Nunito_800ExtraBold_Italic,
        Nunito_900Black_Italic,
    });

    return (
        <View style={styles.container}>
            <View className='bg-white' style={styles.video}>
            </View>
            <View style={{ marginTop: 80, padding: 20 }}>
                <Text style={[ {
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 40,
                    textTransform: 'uppercase',
                }]}>Safeguard your community, safeguard your home.</Text>
            </View>
            <View style={styles.buttons}>
                <Link
                    href={'/(auth)/login'}
                    style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark }]}
                    asChild>
                    <TouchableOpacity>
                        <Text style={{
                            color: 'white', fontSize: 22, fontWeight: '500',
                            fontFamily: 'Nunito_700Bold'
                        }}>Log in</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    header: {
        fontSize: 36,
        color: 'black',
        fontFamily: 'Nunito_700Black',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
});
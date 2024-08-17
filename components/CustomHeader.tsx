import Colors from '~/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import JewaText from './JewaText';

const CustomHeader = () => {
    const { top } = useSafeAreaInsets();

    const initials = 'DK';
    return (
        <BlurView intensity={80} tint={'extraLight'} style={{ paddingTop: top }}>
            <View
                style={[
                    styles.container,
                    {
                        height: 60,
                        gap: 10,
                        paddingHorizontal: 20,
                        backgroundColor: 'transparent',
                        justifyContent: 'space-between',
                    },
                ]}>
                <Link href={'/'} asChild>
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                        }}>
                        <JewaText style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>{initials}</JewaText>
                    </TouchableOpacity>
                </Link>

                <JewaText style={{ color: Colors.dark, fontSize: 20, fontWeight: '700', fontFamily: 'Nunito_700Bold' }}>Hse F-62</JewaText>

                <Link href={'/notifications'} asChild>
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                        }}>
                        <Ionicons name="notifications" size={24} color="white" />
                    </TouchableOpacity>
                </Link>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        padding: 10,
        backgroundColor: Colors.gray,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 30,
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: Colors.lightGray,
        color: Colors.dark,
        borderRadius: 30,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        // backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default CustomHeader;

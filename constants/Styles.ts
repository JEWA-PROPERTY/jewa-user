import Colors from './Colors';
import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
    btn: {
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: Colors.light,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
      },
      header: {
        fontSize: 40,
        fontWeight: '700',
        fontFamily: 'Nunito_700Bold',
      },
      pillButton: {
        padding: 10,
        height: 60,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
      },
      textLink: {
        color: Colors.brown,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        fontFamily: 'Nunito_700Bold',
      },
      descriptionText: {
        fontSize: 18,
        marginTop: 20,
        color: Colors.gray,
        fontFamily: 'Nunito_400Regular',
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Nunito_700Bold',
      },
      pillButtonSmall: {
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonTextSmall: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
      },
      sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
        marginBottom: 10,
        paddingLeft: 10,
      },
      block: {
        marginHorizontal: 20,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 16,
        gap: 20,
      },
});
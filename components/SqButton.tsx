import Colors from '~/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, JewaText, StyleSheet, TouchableOpacity } from 'react-native';

type SqBtnProps = {
  icon: typeof Ionicons.defaultProps;
  JewaText: string;
  onPress?: () => void;
};

const SqButton = ({ icon, JewaText, onPress }: SqBtnProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={25} color={'white'} />
      </View>
      <JewaText style={styles.label}>{JewaText}</JewaText>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 14,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark,
  },
});
export default SqButton;

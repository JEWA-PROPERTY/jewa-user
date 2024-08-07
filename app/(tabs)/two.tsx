import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import ComingSoon from '~/components/ComingSoon';

export default function Home() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ComingSoon />
      </View>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>Coming Soon</Text>
        </View>
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

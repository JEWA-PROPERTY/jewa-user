import { Link, Stack } from 'expo-router';
import { JewaText, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className={styles.container}>
        <JewaText className={styles.title}>This screen doesn't exist.</JewaText>
        <Link href="/" className={styles.link}>
          <JewaText className={styles.linkJewaText}>Go to home screen!</JewaText>
        </Link>
      </View>
    </>
  );
}

const styles = {
  container: `items-center flex-1 justify-center p-5`,
  title: `JewaText-xl font-bold`,
  link: `mt-4 pt-4`,
  linkJewaText: `JewaText-base JewaText-[#2e78b7]`,
};

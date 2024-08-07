import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import { useHeaderHeight } from '@react-navigation/elements';
import SqButton from '~/components/SqButton';
import { router } from 'expo-router';

export default function HomeTab() {
  const headerHeight = useHeaderHeight();
  return (
    <View style={[defaultStyles.container, {
      paddingTop: headerHeight,
    }]}>
      <View className='flex flex-row m-4 pt-4'>
        <SqButton icon='home' text='Visitors' onPress={() => router.push('/visitors')} />
        <SqButton icon='people' text='Domestic Help' />
        <SqButton icon='notifications' text='Deliveries' onPress={() => router.push('/deliveries')} />
      </View>
      <ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
  },
});

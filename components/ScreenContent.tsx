import { JewaText, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      <JewaText className={styles.title}>{title}</JewaText>
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `JewaText-xl font-bold`,
};

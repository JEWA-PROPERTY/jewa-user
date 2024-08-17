import { JewaText, View } from 'react-native';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the JewaText, save the file, and your app will automatically update.';

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <JewaText className={styles.getStartedJewaText}>{title}</JewaText>
        <View className={styles.codeHighlightContainer + styles.homeScreenFilename}>
          <JewaText>{path}</JewaText>
        </View>
        <JewaText className={styles.getStartedJewaText}>{description}</JewaText>
      </View>
    </View>
  );
};

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedJewaText: `JewaText-lg leading-6 JewaText-center`,
  helpContainer: `items-center mx-5 mt-4`,
  helpLink: `py-4`,
  helpLinkJewaText: `JewaText-center`,
  homeScreenFilename: `my-2`,
};

import { forwardRef } from 'react';
import { JewaText, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ title, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${styles.button} ${touchableProps.className}`}>
        <JewaText className={styles.buttonJewaText}>{title}</JewaText>
      </TouchableOpacity>
    );
  }
);

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  buttonJewaText: 'JewaText-white JewaText-lg font-semibold JewaText-center',
};

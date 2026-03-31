declare module 'react-native-vector-icons/Feather' {
  import type { ComponentType } from 'react';
  import type { TextProps } from 'react-native';

  type IconProps = TextProps & {
    name: string;
    size?: number;
    color?: string;
  };

  type FeatherComponent = ComponentType<IconProps> & {
    loadFont: () => Promise<void>;
  };

  const Feather: FeatherComponent;
  export default Feather;
}

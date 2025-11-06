declare module '@expo/vector-icons' {
  import { ComponentProps } from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    size?: number;
    color?: string;
    name: string;
  }

  export class Ionicons extends React.Component<IconProps> {}
  export class MaterialIcons extends React.Component<IconProps> {}
  export class FontAwesome extends React.Component<IconProps> {}
  export class MaterialCommunityIcons extends React.Component<IconProps> {}
  export class Entypo extends React.Component<IconProps> {}
  export class AntDesign extends React.Component<IconProps> {}
  export class Feather extends React.Component<IconProps> {}
}

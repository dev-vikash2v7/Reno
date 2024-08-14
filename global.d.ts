import { ImageSourcePropType } from 'react-native';


declare module '*.jpg' {
    const value: string;
    export default value;
  }
  declare module '*.png' {
    const value: ImageSourcePropType;
    export default value;
  }
  declare module '*.jpg' {
    const value: ImageSourcePropType;
    export default value;
  }

  declare module '*.jpeg' {
    const value:ImageSourcePropType;
    export default value;
  }
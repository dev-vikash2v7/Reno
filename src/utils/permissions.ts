import { PermissionsAndroid, Platform } from 'react-native';

export const getPermission = async (permission: any) => {
  //permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  if (Platform.OS === 'android') {

    const hasPermission = await PermissionsAndroid.check(permission);

    if (!hasPermission) {
      const reqPermission = await PermissionsAndroid.request(permission);
      
      if (reqPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }
    }
  } else {
    return false;
  }

  return true;
};

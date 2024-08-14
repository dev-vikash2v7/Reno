import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {  DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import ReduxStore, { } from 'src/redux_store/store';
import { onFetchUpdateAsync } from 'src/utils/updateUtil'
import { PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';


// export const AppContext = createContext({ selectedRestaurant : {},setSelectedRestaurant :  (val:any)=> {}});

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return AsyncStorage.getItem(key);
//     } catch (error) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return AsyncStorage.setItem(key, value);
//     } catch (error) {
//       return;
//     }
//   }
// }





// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {


  
  

  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
    'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Bold': require('../assets/fonts/Ubuntu-Bold.ttf'),
    'mon': require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
    ...FontAwesome.font,
  });



  useEffect(() => {
    if (!__DEV__) { onFetchUpdateAsync(); }
  }, [])


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.log('_layout error navigation tree : ' , error.message)
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('dark-content');
      
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />
}



  
  
  
  function RootLayoutNav() {
    // const [selectedRestaurant , setSelectedRestaurant]  = useState<Restaurant>({})
    
  return (

    <SafeAreaProvider>
      
      <Provider store={ReduxStore}>
     
      <PaperProvider>
      <ThemeProvider value={DefaultTheme}>

    {/* <AppContext.Provider value={{ selectedRestaurant ,setSelectedRestaurant}}> */}
          
    <RootSiblingParent>

        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name='index' options={{
            headerShown: false
          }} />

        </Stack>
</RootSiblingParent>
          {/* </AppContext.Provider> */}

      </ThemeProvider>
      </PaperProvider>
      

      </Provider>
    </SafeAreaProvider>

  );
}


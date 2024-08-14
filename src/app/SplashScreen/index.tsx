import React, {  useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useFocusEffect, useRouter } from 'expo-router';
import {  View } from 'react-native';
import Video from 'react-native-video';
import { onFetchUpdateAsync } from 'src/utils/updateUtil';
import { mixpanel } from '../Login';

import * as Notifications from 'expo-notifications';
const App = () => {


  const router = useRouter();





  useEffect(() => {
    if (!__DEV__) { onFetchUpdateAsync(); } 
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(async () => {
        await navigateTo();
      }, 800);
    }, [])
  )

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });


  


  const navigateTo = async () => {
    
    try {
    
      const profile = await AsyncStorage.getItem('profileImg');


      if (profile && profile === 'G') {
        router.replace('/Login/');
        return;
      }


      const token = await AsyncStorage.getItem('jwtToken');
      const city = await AsyncStorage.getItem('city');

      // setOrderDetails( { conveniencePercentage : await getConveniencePercentage() } )
      await AsyncStorage.removeItem('selectedId');
      await  AsyncStorage.removeItem('allOnGoingOrdersChange')
      // dispatch(setAllOnGoingOrders([]))
      // dispatch(setAllRestaurantsCategories([]))
      // dispatch(setAllRestaurentsByCity([]))


      mixpanel.registerSuperProperties({city})

      
      if (token) {
        if (!city) {
          router.replace({
            pathname: '/ChangeCity/', params: {
              login: 'true'
            }
          });
          return;
        }

        // router.replace('/OnBoardingScreen/OnboardingScreen')
        router.replace('/drawer/(tabs)/Home')


      } else {
        router.replace('/Login/');
      }
    } catch (error) {
      console.log('in Splashscreen error: ' , error);
    }
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
      <Video
        rate={1.1}
        source={require('src/assets/SplashScreen.mp4')}
        style={{ width: '100%', height: '100%', flex: 1 }}
        resizeMode={'cover'}
      />
    </View>
  );
};

export default App;

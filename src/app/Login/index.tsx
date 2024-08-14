import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Platform, BackHandler } from 'react-native';
import Image from 'react-native-fast-image';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import * as WebBrowser from 'expo-web-browser'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {  createGuest } from 'src/services/auth.service';
import { Redirect, useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { useWarmUpBrowser } from 'src/hooks/useWarmUpBowser';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Mixpanel } from 'mixpanel-react-native';

import FacebookAuth from 'src/components/Login/FecebookAuth';
import GoogleAuth from 'src/components/Login/GoogleAuth';
import AppleAuth from 'src/components/Login/AppleAuth';
import { width , height } from 'src/constants';
import crashlytics from '@react-native-firebase/crashlytics';

import { heightPercentageToDP as hp , widthPercentageToDP as wp} from 'react-native-responsive-screen';

export {hp,wp}

const trackAutomaticEvents = true;

export const mixpanel = new Mixpanel("2f7b327426e82e525b8a436bb94f0ae9", trackAutomaticEvents);

const owner = Constants.expoConfig?.owner;

// import { LogLevel, OneSignal } from 'react-native-onesignal';
import {  OneSignal } from 'react-native-onesignal';


OneSignal.initialize("0e01e6f3-127a-4e88-a80d-b16ff647396f");
mixpanel.init();


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


WebBrowser.maybeCompleteAuthSession();


const LoginScreen = () => {


  
  useWarmUpBrowser();
  const [isVisible, setIsVisible] = useState(false);
  const [redTrue, setRedTrue] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const router = useRouter();


  useEffect(()=>{
    mixpanel.track('opened Login');

    crashlytics().log('Login mounted.');

  },[])





  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token!));

  }, [])

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {

      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {

      
      // token = await Notifications.getDevicePushTokenAsync();
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        
        });
      
      console.log('final status : ' ,finalStatus , token)
      
      //  await OneSignal.Notifications.requestPermission(true);
      // let finalStatus = granted;
      // if (!finalStatus) {
      //   const res = await OneSignal.Notifications.canRequestPermission();
      //   finalStatus = res;
      // }

      // if(finalStatus){

      //   OneSignal.User.pushSubscription.optIn()
      //   token = await OneSignal.User.pushSubscription.getIdAsync()
      // }

      console.log('Token' , token)

    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token?.data;
  }



  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  const onBackPress = () => {
     BackHandler.exitApp();
     return true
  }



  const continueAsGuest = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        router.replace({
          pathname: '/drawer/(tabs)/Home',
          params: {
            guest: 1
          }
        });
      } else {
        const res = await createGuest();
        // dispatch(setUser(
        //   {
        //     name : 'Guest',
        //     city : 'Pune',
        //     profileImg : null,
        //     jwtToken : res.data.token
        //   }
        // ))
        router.replace({
          pathname: '/drawer/(tabs)/Home',
          params: {
            guest: 1
          }
        });
      }
    } catch (error) {

      const res = await createGuest();

     
      router.replace({
        pathname: '/drawer/(tabs)/Home',
        params: {
          guest: 1
        }
      });
    }
  }

  

    
   

  if (redTrue) {
    return <Redirect href={{
      pathname: '/ChangeCity/', params: {
        login: 'true'
      }
    }} />
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Image
        source={require('../../assets/login_main.png')}
        style={{ height: height, width: width }}
        >
          
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFFD4', '#FFFFFF00']}
          style={{ height: height * 0.3, width: width, opacity: 0.7 }}
        />

        <Image
          source={require('../../assets/reno_logo_main.png')}
          style={{
            height: hp('12%'),
            width: hp('12%'),
            position: 'absolute',
            top: hp('7%'),
            left: wp('8%'),
          }}
        />
        <TouchableOpacity onPress={continueAsGuest} style={{
          position: 'absolute',
          top: hp('7%'),
          right: wp('8%'),
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: hp('3%')
          }}>
            Skip
          </Text>
          <Entypo name='chevron-right' style={{ marginBottom: 5 }} size={ hp('3%')} />
        </TouchableOpacity>


        <LinearGradient
          colors={['#FFFFFF00', '#FFFFFFD4', '#FFFFFF']}
          style={{
            height: Platform.OS === 'ios' ? height * 0.4 + 48 : height * 0.4,
            width: width,
            position: 'absolute',
            bottom: 0,
            paddingBottom : 40
          }}>

          <Text
            style={{
              marginLeft: wp('10%'),
              marginTop: '30%',
              fontSize: hp('3.5%'),
              fontFamily: 'Poppins-SemiBold',
              color: 'black'
            }}>
            Let's Get Started
          </Text>
       

        
            
            <GoogleAuth 
            setIsVisible={setIsVisible} 
            setRedTrue={setRedTrue}
             expoPushToken={expoPushToken}
             mixpanel={mixpanel}
             />  

       <FacebookAuth  setIsVisible={setIsVisible} setRedTrue={setRedTrue} expoPushToken={expoPushToken} 
             mixpanel={mixpanel}  
             />
          {
            Platform.OS === 'ios' && <AppleAuth setIsVisible={setIsVisible} setRedTrue={setRedTrue} expoPushToken={expoPushToken}
            mixpanel={mixpanel}
            /> 
          }
        </LinearGradient>
      </Image>




      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{
          margin: 0,
        }}
        isVisible={isVisible}>
        <View
          style={{
            width: width * 0.9,
            height: hp('12%'),
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: { height: 2, width: 2 },
            shadowRadius: 10,
            shadowOpacity: 0.4,
            borderRadius: 5,
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator
            size="large"
            color="#d20000"
            style={{ marginLeft: 30 }}
          />
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              marginLeft: 20,
              color: 'grey',
              fontSize: 15,
            }}>
            Verifying Credentials
          </Text>
        </View>
      </Modal>
    </View>
  );
}

export default LoginScreen;
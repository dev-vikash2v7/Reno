import React, {  useEffect } from 'react';
import { Text, View,  BackHandler, Alert } from 'react-native';
import Image from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  googleSignUp } from 'src/services/auth.service';

import { width } from 'src/constants';
import { Mixpanel } from 'mixpanel-react-native';


interface Props {
    expoPushToken : string ,
    setIsVisible :(agr0 : boolean)=> void, 
    setRedTrue : (agr0 : boolean)=> void,
    mixpanel:Mixpanel
}

const GoogleAuth : React.FC<Props> = ({expoPushToken  ,setIsVisible , setRedTrue  ,mixpanel}) => {


  const onBackPress = () => {
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);


  const signIn = async () => {

    GoogleSignin.configure()
    // console.log("is signed " + await GoogleSignin.isSignedIn())

    // console.log('AsyncStorage.getAllKeys()' , await AsyncStorage.getAllKeys());
    try {
      setIsVisible(true);
      // console.log("google");

      if (!await GoogleSignin.hasPlayServices()) {
        Alert.alert("google play service not available");
        return
      }
      const userInfo = await GoogleSignin.signIn();

      // console.log('GoogleSignin user info 68 - ' , userInfo);

      await googleSignUp(userInfo, expoPushToken ,mixpanel );

        setRedTrue(true);


    } catch (error: any) {
      console.log('GoogleSignin Error---- ' , error);
      Alert.alert('Error in Google Signin . Try with other method.')
      
    }
    setIsVisible(false);
  };

 

 


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
          <Ripple
            rippleOpacity={0.2}
            onPress={() => signIn()}
            style={{
              height: 45,
              width: width * 0.8,
              borderColor: '#C7C7C7',
              borderWidth: 1,
              marginTop: 20,
              alignSelf: 'center',
              backgroundColor: '#fff',
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#00000029',
              shadowOffset: { height: 1, width: 0 },
            }}>
            <Image
              source={require('../../assets/google.png')}
              style={{ height: 25, width: 25, marginLeft: 15 }}
              resizeMode="contain"
            />
            <Text
              style={{
                marginLeft: 15,
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: 'black'
              }}>
              Continue with Google
            </Text>
          </Ripple>
       
      
    </View>
  );
}

export default GoogleAuth;
import React, { useState, useEffect } from 'react';
import { Text} from 'react-native';
import Image from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
// import * as Facebook from 'expo-auth-session/providers/facebook'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { facebookAuth } from 'src/services/auth.service';

import { width } from 'src/constants';
import { Mixpanel } from 'mixpanel-react-native';



interface FacebookProps {
    expoPushToken : string ,
    setIsVisible :(agr0 : boolean)=> void, 
    setRedTrue : (agr0 : boolean)=> void,
    mixpanel : Mixpanel
}

const FacebookAuth : React.FC<FacebookProps> = ({expoPushToken  ,setIsVisible , setRedTrue  ,mixpanel}) => {



 

  const fbLogin = async () => {
    //props.awaitAuth(true);
    setIsVisible(true);
    const response = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (response.isCancelled) {
      setIsVisible(false);
      //props.awaitAuth(false);
    } else {
      getFbUserData();
    }
  };

  async function getFbUserData() {
    const { userID, accessToken } = (await AccessToken.getCurrentAccessToken())!;
    const uri = `https://graph.facebook.com/${userID}?fields=email,picture.type(large),name&access_token=${accessToken}`;

    const result = await fetch(uri)
      .then((response) => response.json())
      .catch((e) => {
        responseInfoCallback(e, null);
      });

    responseInfoCallback(null, result);
  }

  async function responseInfoCallback(error: any, result: any) {
    if (error) {
      console.error(error);
      
    } else {

      await facebookAuth(result, expoPushToken ,mixpanel );
      setIsVisible(false);
      setRedTrue(true);

    
    }
  }

 


  return (
     
          <Ripple
            rippleOpacity={0.2}
            onPress={() => fbLogin()}
            style={{
              height: 45,
              width: width * 0.8,
              borderColor: '#C7C7C7',
              borderWidth: 1,
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: '#fff',
              borderRadius: 8,
              shadowColor: '#00000029',
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 1,
            }}>
            <Image
              source={require('../../assets/facebook.png')}
              style={{ height: 26, width: 26, marginLeft: 15 }}
              resizeMode="contain"
            />
            <Text
              style={{
                marginLeft: 15,
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: 'black'
              }}>
              Continue with Facebook
            </Text>
          </Ripple>

  );
}

export default FacebookAuth;
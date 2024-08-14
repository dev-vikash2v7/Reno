import React from 'react';

import { appleSignUp } from 'src/services/auth.service';
import * as AppleAuthentication from 'expo-apple-authentication';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import { width } from 'src/constants';
import { Mixpanel } from 'mixpanel-react-native';


interface Props {
    expoPushToken : string ,
    setIsVisible :(agr0 : boolean)=> void, 
    setRedTrue : (agr0 : boolean)=> void,
    mixpanel : Mixpanel

}

const AppleAuth : React.FC<Props> = ({expoPushToken  ,setIsVisible , setRedTrue  ,mixpanel}) => {

 
  const appleLogin = async () => {
    try {

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      const decoded: any = jwtDecode(credential.identityToken!);
      const email = decoded.email;

      const name = credential.fullName?.familyName ? credential.fullName?.givenName + ' ' + credential.fullName?.familyName : credential.fullName?.givenName;
      const id = credential.user;

      setIsVisible(true);

      await appleSignUp( { data : { email, id }, name :  credential.fullName?.givenName!, suffix :  credential.fullName?.familyName!, pushToken :  expoPushToken  ,mixpanel});

      setIsVisible(false);
      setRedTrue(true);


    } catch (error) {
      console.log('appleauth error ' , error);
    }
  }

 
  
  return (
    
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={8}
                style={{
                  height: 45,
                  width: width * 0.8,
                  marginTop: 10,
                  marginLeft: 45,
                }}
                onPress={appleLogin}
              />
       
  );
}

export default AppleAuth;
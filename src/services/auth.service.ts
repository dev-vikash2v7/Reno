import { GuestUser, User } from "src/types/interfaces";
import { User as GoogleUser } from '@react-native-google-signin/google-signin';
import { getRequest, postRequest } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mixpanel } from "mixpanel-react-native";
import { Platform } from "react-native";
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';


export async function getLoggedInrestaurant() {
  return await getRequest(`/merchant/loggerInRestaurant`);
}

async function onSignIn(id , name  , email) {

  crashlytics().log('User signed in.');

  await analytics().logEvent('userLogin', {
    id: id,
    name,
    email,
  })


await  analytics().setUserId(id),

await analytics().setUserProperties({
        id:id ,
        role: 'consumer',
      email: email,
      username: name,
})



  await Promise.all([
    crashlytics().setUserId(id),
    crashlytics().setAttributes({
      role: 'consumer',
      email: email,
      username: name,
    }),
  ]);

  
}


async function userLogin( user: User ,  mixpanel : Mixpanel) {

  
  const response = await postRequest('/consumer/login', {...user , device : Platform.OS == 'android' ? 'android' : 'ios' });
  
  
  const data = response.data

    if(data.user){

    await  onSignIn(data.user.id , `${data.user.firstname!} ${data.user.lastname}` , data.user.email)

   

        if (data.user.profileImage)  await AsyncStorage.setItem('profileImg', data.user.profileImage!);

        await AsyncStorage.setItem('userName', `${data.user.firstname!} ${data.user.lastname}`);

        await AsyncStorage.setItem('jwtToken', data.token);

        if (data.user.contact) { await AsyncStorage.setItem('contact', data.user.contact!) };

    }
    else{
      throw new Error('Unable to login')
    }

}

export const guestLogin = async (user: GuestUser) => {
  return await postRequest('/consumer/guest/login', user);
}

export async function createGuest() {
  return await getRequest('/consumer/create-guest');
}

export async function getProfile() {
  return await getRequest('/consumer/profile');
}








//user auth
export async function facebookAuth(data: any, pushToken: string  , mixpanel:Mixpanel) {
  try {

    const splitUserName = data.name.split(' ');
    
    const user = {
      facebookId: data.id,
      email: 'no email',
      firstname: splitUserName[0],
      lastname: splitUserName[splitUserName.length - 1],
      profileImage: data.picture.data.url,
      pushToken
    };

    // console.log('facebook user '  , user);
    
  await userLogin(user   , mixpanel);

    return true;

  } catch (error) {
    alert(error);
  }
};

export async function googleSignUp(data: GoogleUser, pushToken: string   , mixpanel:Mixpanel) {

  let user: User = {
    email: data.user.email,
    firstname: data.user.givenName!,
    lastname: data.user.familyName!,
    profileImage: data.user.photo ? data.user.photo : '',
    googleId: data.user.id,
    pushToken
  };


  await userLogin(user  , mixpanel);
  return true
};







export async function appleSignUp(  {
  data, name, suffix, pushToken , mixpanel
}: 
  {
  data: any, name: string, suffix: string, pushToken: string , mixpanel : Mixpanel
} ) {
  // console.log('apple login start');

  let user: User = {
    email: data.email || 'not found',
    firstname: name ? name : '',
    lastname: suffix ? suffix : '',
    profileImage: '',
    appleId: data.id,
    pushToken
  }
 await userLogin(user , mixpanel );
}
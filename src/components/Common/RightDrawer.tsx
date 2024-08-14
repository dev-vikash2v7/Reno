import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Image from 'react-native-fast-image';
import { width } from 'src/constants';
import Ripple from 'react-native-material-ripple';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { ActivityIndicator, Button, Drawer } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from 'src/app/Login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';

interface DrawerItemsProps {
  name: string;
  screen: string;
}

const navigateTo = (screen: string) => {
  switch (screen) {
    case "AboutUs":
      return router.push('/drawer/AboutUs');
    case "FAQScreen":
      return router.push('/drawer/FAQScreen');
    case "PrivacyPolicy":
      return router.push('/drawer/PrivacyPolicy')
    case "Support":
      return router.push('/drawer/Support')
    case "MyAccount":
      return router.push('/drawer/MyAccount')

    default:
      break;
  }
}

const DrawerItems: React.FC<DrawerItemsProps> = ({ name, screen }) => {
  const navigation = useNavigation();
  return (
    <Ripple
      style={{ height: 55, width, justifyContent: 'center' }}
      onPress={() => {
        navigation.dispatch(DrawerActions.closeDrawer());
        navigateTo(screen);
      }}
    >
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          color: '#000',
          marginLeft: '10%',
          fontSize: 17,
        }}
      >
        {name}
      </Text>
    </Ripple>
  );
};

const getData = async (
  setProfileImg: React.Dispatch<React.SetStateAction<string>>,
  setFirstName: React.Dispatch<React.SetStateAction<string>>,
  setLastName: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const img = await AsyncStorage.getItem("profileImg");
  setProfileImg(img!);
  const name = await AsyncStorage.getItem('userName');
  setFirstName(name?.split(' ')[0]!);
  setLastName(name?.split(' ')[name.split.length - 1]!);
  setLoading(false);
}

const RightDrawer: React.FC = () => {
  const [profileImage, setProfileImg] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch()
  
  useEffect(() => {
    getData(setProfileImg, setFirstName, setLastName, setLoading);
  }, [])
  return (
    loading ? <ActivityIndicator size={40} color='red' style={{ flex: 1 }} /> :
      <>
        {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#d20000' }} /> */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              width: '100%',
              height: 88,
              backgroundColor: '#d20000',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* <View
              style={{
                borderRadius: 45 / 2,
                shadowColor: '#000',
                shadowRadius: 2,
                shadowOpacity: 0.4,
                marginLeft: 24,
                shadowOffset: { height: 1, width: 1 },
              }}
            >
              <Image
                  source={profileImage?.length   ? { uri: profileImage } : require('../../assets/profileIMG.jpg') }

                style={{
                  height: 45,
                  width: 45,
                  borderWidth: 2,
                  borderColor: '#fff',
                  borderRadius: 45 / 2,
                }}
                resizeMode="cover"
              />
            </View> */}

<View style={{
            borderRadius: 50 / 2,
            shadowColor: '#000',
            marginTop: 10,
            shadowOpacity: 0.4,
            elevation: 3,
            shadowOffset: { height: 1, width: 1 },
            borderColor:'red',
            marginLeft:24
          }}>

<Image
            source={profileImage?.length   ? { uri: profileImage } : require('../../assets/profileIMG.jpg') }
            style={{
              height: 50,
              width: 50,
              borderWidth: 3,
              borderColor: 'red',
              borderRadius: 50 / 2,
            }}
            resizeMode="cover"
          />
</View>
           




            <Text
              style={{
                marginLeft: 20,
                fontFamily: 'Poppins-Medium',
                color: '#fff',
                fontSize: 24,
              }}
            >
              {`${firstName} ${lastName}`}
            </Text>
          </View>


          <View style={{ marginTop: 40 }}>


            <Text style={textStyle} onPress={() => {
              mixpanel.track('opened myaccount');
              router.push('/drawer/MyAccount')
            }}>My Account</Text>


            <Text style={textStyle} onPress={() => {
              mixpanel.track('opened aboutus');
              router.push('/drawer/AboutUs')
            }}>About Us</Text>

            {/* <Text style={textStyle} onPress={() => {
              mixpanel.track('opened aboutus');
              router.push('/drawer/Refer')
            }}>Refer & Earn</Text>
 */}

            <Text style={textStyle} onPress={() => {
              mixpanel.track('opened terms and conditions');
              router.push('/drawer/TermsAndConditions')
            }}>Terms And Conditions</Text>

            <Text style={textStyle} onPress={() => {
              mixpanel.track('opened faqs');
              router.push('/drawer/FAQScreen')
            }}>FAQs</Text>


            <Text style={textStyle} onPress={() => {
              mixpanel.track('opened support');
              router.push('/drawer/Support')
            }}>Support</Text>


          </View>
          {/* {auth.user.renoPass ? (
          <Image
            source={require('../../assets/PassMain.png')}
            style={{ width: '100%', height: 200, marginTop: 60 }}
            resizeMode="cover"
          />
        ) : null} */}
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.clear();

              
              GoogleSignin.signOut()
              router.replace('/Login/');
            }}
            style={{
              width,
              flexDirection: 'row',
              position: 'absolute',
              bottom: 20,
              marginBottom: 10,
              left: 20,
            }}
          >
            <MaterialCommunityIcons name="logout" size={25} color="#000" style={{ marginLeft: 10 }} />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 17,
                color: '#000',
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
  );
};

const textStyle: any = { fontSize: 18, paddingVertical: 20, marginLeft: 20 }
export default RightDrawer;

import { useRouter  , useNavigation, useLocalSearchParams} from 'expo-router';
import React, {  useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  
} from 'react-native';
import Image from 'react-native-fast-image';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@src/redux_store/store';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp , wp } from 'src/app/Login';
import { height, width } from 'src/constants';

const Header = ( ) => {

  const [profileImg , setProfileImg] = useState('')
  const [city , setCity] = useState('')

    const router = useRouter();
    const navigation = useNavigation();
  const { guest } = useLocalSearchParams();


  const fetchData  = async () =>{
      const profileImg = await AsyncStorage.getItem('profileImg');
      const city = await AsyncStorage.getItem('city');
      
      setProfileImg(profileImg)
      setCity(city)
       
  }

  useEffect(()=>{
fetchData()
  })


    return(
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        {
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/ChangeCity/',
                })
                // props.navigation.navigate('ChangeCity', { onGoBack: onGoBack })
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: hp('2%'),
                  color: '#d20000',
                  marginRight: 5,
                  marginTop: 5,
                }}>
                {city}
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={hp('2%')}
                color="#d20000"
                style={{ paddingTop: 2 }}
              />
            </TouchableOpacity>
        }







        <Text
          style={{
            fontFamily: 'Ubuntu-Bold',
            fontSize: hp('5.5%'),
            color: '#d20000',
            alignSelf: 'center',
          }}>
          reno
        </Text>




        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if ((guest && guest.toString() === '1')) {
              router.push('/Login/');
              return;
            }
            navigation.dispatch(DrawerActions.toggleDrawer());
          }
          }
          style={{
            borderRadius: hp('2%'),
            shadowColor: '#000',
            marginTop: hp('1%'),
            shadowOpacity: 0.4,
            elevation: 3,
            shadowOffset: { height: 2, width: 2 },
            borderColor:'red',
          }}>
          <Image
            source={profileImg?.length   ? { uri: profileImg } : require('../../assets/profileIMG.jpg') }
            style={{
              height: hp('5%'),
              width: hp('5%'),
              borderWidth: 2,
              borderColor: 'red',
              borderRadius: hp('5%') / 2,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )
}

export default Header
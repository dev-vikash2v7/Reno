import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Image from 'react-native-fast-image';
import { height, width } from 'src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAllCities } from 'src/services/restaurants.service';
import { city } from 'src/types/interfaces';
import { useFocusEffect, useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { hp, mixpanel, wp } from '../Login';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';


const SkeletonCommonProps = {
  colorMode: 'light',
  transition: {
    type: 'timing',
    duration: 1500,
  },
  backgroundColor: '#D4D4D4',
} as const;

const ChangeCity: React.FC<{ navigation: any }> = (props) => {
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState<city[]>();
  const [comingSoon, setComingSoon] = useState(false);
  const [isCitySet, setIsCitySet] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(()=>{
    mixpanel.track('opened ChangeCity');
    crashlytics().log('ChangeCity mounted.');

  },[])

  
  useEffect(() => {
    const fetchCityData = async () => {
      const response = await getAllCities();
      setCityData(response.data.cities);
      setLoading(false);
    };


    fetchCityData();

    // BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (params.login === 'true') {
  //       navigation.addListener('beforeRemove', (e) => {
  //         console.log(e);
  //         if (e.data.action.type === 'GO_BACK') {
  //           e.preventDefault();
  //           console.log('prevented', 10);
  //         }

  //       })
  //     }

  //     return () => navigation.removeListener('beforeRemove', (e) => { });
  //     // const backHandler = BackHandler.addEventListener(
  //     //   'hardwareBackPress',
  //     //   handleBackPress
  //     // );
  //   }, [navigation])
  // );

  const onBackPress = () => {
    if (params.login !== 'true') {
      router.back();
    }
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECECEC' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, backgroundColor: '#ECECEC', justifyContent: 'flex-end' }}>
          <View style={{ position: 'absolute', top: 0, width, alignItems: 'flex-end', opacity: 0.1 }}>

            <Text style={{ fontSize: hp('10%'), marginRight: wp('2.4%'), marginBottom: 15, fontFamily: 'Poppins-Bold', color: '#d20000' }}>
              Location
            </Text>

          </View>
          <View style={{ width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: hp('5.9%'), marginLeft: wp('4%'), fontFamily: 'Poppins-Bold', color: '#d20000' }}>
              Location
            </Text>
            {
              params.login !== 'true' ?
                <Ionicons name="close" color="#d20000" onPress={() => {
                  setComingSoon(false);
                  router.back()
                }} size={ hp('5.9%')} style={{ marginRight: wp('4%'), marginTop: 5 }} /> : false
            }
          </View>

          <View style={{
            height: height * 0.8,
            width,
            backgroundColor: '#fff',
            shadowColor: '#00000029',
            shadowOpacity: 1,
            alignItems: 'center',
            shadowOffset: { height: -3, width: 0 },
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}>
            {
              loading ?
                <FlatList
                  data={[1, 2]}
                  style={{ marginTop: hp('3%') }}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{
                        marginBottom: 20,
                      }}>
                        <Skeleton radius={13} {...SkeletonCommonProps} show height={150} width={width * 0.9} />
                      </View>
                    )
                  }}
                /> :
                <FlatList
                  style={{ marginTop: 30 }}
                  data={cityData}

                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <>
                      <Ripple
                        onPress={async () => {
                          if (index === 1) {
                            setComingSoon(true);
                            return;
                          }
                          setComingSoon(false);

                         mixpanel.registerSuperProperties({'city' : item.name})
                         await analytics().logEvent('userCity', {
                          city : item.name
                        })


                          await AsyncStorage.setItem('city', item.name);

                          const guest = await AsyncStorage.getItem('profileImg');

                          // console.log(guest);
                          if (guest === 'G') {

                            router.replace({
                              pathname: '/drawer/Home',
                              params: {
                                guest: 1
                              }
                            });
                            return;
                          }
                          router.replace('/drawer/(tabs)/Home');
                        }}
                        style={{
                          borderRadius: 13,
                          height: hp('22%'), //130
                          width: width * 0.9,
                          marginBottom: hp('3%'),
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: index === 1 ? 0.7 : 1
                        }}
                      >
                        <Image
                          source={{ uri: item.imageUrl }}
                          resizeMode="cover"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {/* <LinearGradient
                            colors={['#000000', '#090909F6', '#FFFFFF00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              opacity: 0.44,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 10,
                            }}
                          ></LinearGradient> */}
                          <Text style={{
                            fontSize: hp('2.4%'),
                            fontFamily: 'Poppins-Bold',
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}>
                            {comingSoon && index == cityData?.length! - 1 ? '' : item.name}
                          </Text>

                        </Image>
                      </Ripple>
                      {comingSoon && index == cityData?.length! - 1 ?
                        <Text style={{
                          color: 'white',
                          fontFamily: 'Poppins-Bold',
                          textAlign: 'center',
                          fontSize: hp('3%'),
                          height: hp('6%'),
                          width: width * 0.9,
                          textAlignVertical: 'center',
                          top: hp('7%'),
                          position: 'absolute',
                        }}>Coming Soon!</Text> : <></>}</>
                  )}
                />
            }
          </View>

        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ChangeCity;

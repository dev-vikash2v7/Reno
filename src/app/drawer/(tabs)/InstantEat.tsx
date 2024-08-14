import {  StyleSheet, BackHandler, View , Text, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import _ from 'lodash';
import { Restaurant } from 'src/types/interfaces';
import RestaurantLists from 'src/components/InstantEatOut/RestaurantLists';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GrantLocation from 'src/components/Common/GrantLocation';
import { getCurrentPosition } from 'src/utils/location.urtils';
import InstantMapView from 'src/components/InstantEatOut/InstantMapView';
import RefreshLocation from 'src/components/InstantEatOut/RefreshLocation';
import { getNearbyRestaurants, getRestaurantsByCity } from 'src/services/restaurants.service';
import { RootState } from 'src/redux_store/store';
import {  setAllRestaurentsByCity  } from 'src/redux_store/reducers/restaurent.reducer';
import { useDispatch, useSelector } from 'react-redux';
import RenderRestaurants from 'src/components/InstantEatOut/NearbyRestaurants';
import NoInternetScreen from 'src/components/Common/NoInternet';
import { hp, mixpanel } from 'src/app/Login';
import crashlytics from '@react-native-firebase/crashlytics';


const InstantEat = () => {

    const [loading, setLoding] = useState<boolean>(true);
    const [maxDistance, setMaxDistance] = useState(1000000);
    const [data, setData] = useState<Restaurant | null>();
    const [dismissOverlay, setDismissOverlay] = useState(false);
    const dispatch = useDispatch();
    const {allRestaurentsByCity} = useSelector((state : RootState) => state.restaurent)
    const [restaurants, setRestaurants] = useState<any >();
    const [coordinates, setCoordinates] = useState<any >();
    const [  isAccessGranted  , setAccessGranted] = useState(false)

    const [city, setCity] = useState<string>();
    const [currentDiscount, setCurrentDiscount] = useState(0);
    const [timeDiscountId, setTimeDiscountId] = useState('');

  const [isConnected, setConnected] = useState<boolean >(true);

  useEffect(()=>{
    mixpanel.track('opened InstantEat');

    crashlytics().log('InstantEat mounted.');

  },[])


    
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const isGuest = await AsyncStorage.getItem('profileImg');
                if (isGuest === 'G') {
                    router.push('/Login/');
                    return;
                }
               await refreshLocation()
            })()
        }, [])
    )





    const onBackPress = () => {
        setData(null);
        return true;
    }  

    useEffect(() => {
        if (data) {
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
        }
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    }, [data])

    
    useEffect(() => {
        setData(null);
        setDismissOverlay(false);
    }, [dismissOverlay])



    const getItemDiscount = (item: Restaurant) => {
        let discount = 0;
        const currentTime = new Date();
        for (let timeDiscount of item.timeDiscount) {
            const day = getDayFromNumber(new Date().getDay());
            const timeSlot = new Date();
            const TimeParts = timeDiscount.timeSlot.time.split(":");
            timeSlot.setHours(parseInt(TimeParts[0], 10));
            timeSlot.setMinutes(parseInt(TimeParts[1], 10));
            const time30MinutesFromSlot = new Date(timeSlot.getTime() + 30 * 60000);
            if (timeDiscount.day.toUpperCase() === day.toUpperCase() && currentTime >= timeSlot && currentTime <= time30MinutesFromSlot) {
                discount = timeDiscount.discount;
            }
        }
        return discount;
    }



    
    const refreshLocation =async () => {

        try{

            setLoding(true); 
            
          const {success , coordinates} =    await  getCurrentPosition(dispatch )

          const city = await AsyncStorage.getItem('city');
          setCity(city!);

            if(!success   ){
                setAccessGranted(false)
                setLoding(false)
                return
            }

            setAccessGranted(true)
            setCoordinates(coordinates)
           

            if(allRestaurentsByCity.length == 0){
                const new_restaurants = await getRestaurantsByCity();
                const res =  getNearbyRestaurants( coordinates.longitude, coordinates.latitude, new_restaurants)
                setRestaurants(res)
                dispatch(setAllRestaurentsByCity([...new_restaurants]))
            }
            else{
                const res =  getNearbyRestaurants( coordinates.longitude, coordinates.latitude, allRestaurentsByCity)
                setRestaurants(res)
            }
            setConnected(true)
    }

        catch(err){
            console.error('getlocation error ' , err)
            if(isConnected)
                setConnected(false)
        
              setTimeout(async()=>{
                await refreshLocation()
              },1000)
        }
        setLoding(false)
    }

   

    useEffect(() => {
        setDismissOverlay(false);
    }, [dismissOverlay])

   
    if(!isConnected) return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <NoInternetScreen/>
      </SafeAreaView>
    )
   
    return (


            <SafeAreaView
                style={{
                    flex: 1,
                }}>

                    {
                        loading ? (

                            <ActivityIndicator color='#d20000' style={{
                                flex: 1
                            }} size={hp('5%')} />
                        )
                        : 
                        (!isAccessGranted && !loading)  ? <GrantLocation/>  

                        : 
                        <>

                    {
                        coordinates &&
                    <InstantMapView
                    userLatitude = {coordinates.latitude}
                    userLongitude = {coordinates.longitude}
                    nearByData = {restaurants}
                    // city  = {city}
                    maxDistance = {maxDistance}

                    setData = {setData}
                    setCurrentDiscount={setCurrentDiscount}
                    setTimeDiscountId={setTimeDiscountId}
                    
                    />

                }

                {
                    (data && city) && (
                        <View
                            style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
                            <RenderRestaurants
                                setDismissOverlay={setDismissOverlay}
                                data={data}
                                city={city}
                                discount={currentDiscount}
                                timeDiscountId={timeDiscountId}
                            />
                        </View>
                    )
                }

               <RefreshLocation refreshLocation={refreshLocation}/>

               
                 <RestaurantLists 
                 data={restaurants?.filter((item : Restaurant) => getItemDiscount(item) !== 0)} 
                 />
                   

                 </>
}


            </SafeAreaView>
    )
}

export default InstantEat;

const styles = StyleSheet.create({
    bubble: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
});
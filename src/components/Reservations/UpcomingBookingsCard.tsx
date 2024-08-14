import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Image from 'react-native-fast-image';
import moment from 'moment';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from 'src/types/order.interfaces';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import { ActivityIndicator } from 'react-native-paper';
import { handleUnlock } from 'src/utils/common/handleUnlock';
import { checkUnlock } from 'src/utils/common/checkUnlock';
import calculateTimeLeft from 'src/utils/common/updateTimer';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderDetails } from 'src/redux_store/reducers/order.reducer';
import { hp, wp } from 'src/app/Login';


Amplify.configure(awsconfig);


interface UpcomingBookingCard {
    item: Order;
    index: number | null;
    infoOnly: boolean;
    setItem :any,
    bottomSheetRef : any , 
    setSuccessVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setWarningVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setAlertVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setContent : React.Dispatch<React.SetStateAction<string>>,
    setLocation : any,
setLoadingVisible : any,
handleSuccess : any,


}



const  UpcomingBookingCard = ({
    setItem, 
     bottomSheetRef,  
     setWarningVisible ,
       setContent , 
       setAlertVisible   ,
         setLocation , 
         item,
         setLoadingVisible,
        infoOnly,
        handleSuccess
} : UpcomingBookingCard ) => {

 

    const [instantExpiry, setInstantExpiry] = useState('');
    const [imgLoading, setImgLoading] = useState(true);
    const [img, setImg] = useState<string>('');

    
    const slotDate = new Date(item.date)
    const slotTime =  item.TimeSlot.time;
    const [slot_hour, slot_minutes] = slotTime.split(':');

    slotDate.setHours( parseInt(slot_hour , 10), parseInt(slot_minutes , 10));
    
    const bookingDateTime = slotDate.toISOString();

    const now :Date = new Date();
    const bookingTime : Date  = new Date(bookingDateTime);

    const [timer, setTimer] = useState((bookingTime.getTime() - 10 * 60 * 1000) - now.getTime())
    
    const [formattedTime , setFormattedTime] = useState('')

    const dispatch = useDispatch()

      
      useEffect(() => {
          
          (async () => {
              if (item.Restaurant.mainImageUrl) {
                  setImg(item.Restaurant.mainImageUrl);
                  setImgLoading(false);
                  return;
              }
              const url = `https://d3eiw2rs38fo3w.cloudfront.net/public/${item.Restaurant.uploadedImages[0]}`;
              setImg((url).toString());
              setImgLoading(false);
          })()
      }, [])



    useEffect(() => {
        if (item.instantEat) {
          setTimer(0);
            return;
        }
      const interval = setInterval(() => {
        setTimer(prevMilliseconds => prevMilliseconds - 1000);
        calculateTimeLeft({setFormattedTime , timer})
      }, 1000);
      return () => clearInterval(interval);
    }, [timer]);





useEffect(()=> {
       
        const orderTime = new Date(item.createTime).getTime();
        let halfHour = orderTime + 15 * 60 * 1000;
        let hour = new Date(halfHour).getHours();
        let minute = new Date(halfHour).getMinutes();
        let time = `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`;
        setInstantExpiry(time);
    },[])



   function renderUnlockButton() {

        return (
            <Ripple
                onPress={() => {
                    if (item.unlockLocation) {
                        setItem(item);
                        bottomSheetRef.current.snapToIndex(0);
                        return;
                    }

                    if(item.instantEat || timer<=0 || checkUnlock(
                        {
                            order : item , 
                            setContent ,
                             setWarningVisible 
                             ,ispress: true  ,
                              now 
                           , setLoadingVisible ,
                         slotDate:  moment(slotDate)
                             })){


                        handleUnlock({
                            item,
                            setLoadingVisible ,
                            setContent , 
                            setAlertVisible  , 
                             setItem ,
                              setLocation ,
                              handleSuccess
                        });


                    }
                    else{
                       setWarningVisible(true)
                    }
                }}
                style={{
                    flex: 1,
                    marginHorizontal: wp('2.5%'),
                    marginTop: hp('0.6%'),
                    marginBottom: hp('1.1%'),
                    elevation: 7,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    borderRadius: hp('0.6%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: item.status === 'Unlocked' ? '#d20000' : timer<=0 ? 'green' : 'grey',
                    height: hp('6.5%'),
                }}>
                <Text
                    style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: 'white',
                        fontSize: hp('2%'),
                    }}>

                    {item.unlockLocation ? 'Pay with Reno Pay' : 'Unlock your visit'}
                </Text>
            </Ripple>
        );
    }


    

        if (!item.Restaurant) {
            return null;
        }


        return (
            <Pressable
                style={styles.cardStyle}
                android_ripple={{ color: '#dcdcdc' }}
                onPress={async () => {
                    // if (!infoOnly) {

                        dispatch(setOrderDetails(item))
                        router.push(   '/Reservations/OrderDetails')
    
                    // }
                }}>
                <View style={styles.dateView}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            color: '#000',
                            fontSize: hp('2.1%'),
                        }}>
                        {moment(item.date).format('Do MMM YYYY')}
                    </Text>
                    {item.instantEat ? (
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#000',
                                fontSize: hp('1.9%'),
                            }}>
                            {`Discount : ${item.discount}%`}
                        </Text>
                    ) : (
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#000',
                                fontSize: hp('1.9%'),
                            }}>
                            {item.TimeSlot.time}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', padding: hp('1.1%'), paddingTop: 0 }}>
                    {
                           imgLoading ?
                            <View
                                style={{
                                    height: hp('15%'),
                                    width: hp('15%'),
                                    borderRadius: hp('1.1%'),
                                }}>
                                <ActivityIndicator size={hp('4%')} color={'#d20000'} style={{ flex: 1 }} />

                            </View> :
                            <Image
                                source={{ uri:    img }}
                                style={{
                                    height:  hp('15%'),
                                    width: hp('15%'),
                                    borderRadius: hp('1.1%'),
                                }}
                                resizeMode="cover"
                            />
                    }

                    <View style={{ marginLeft: wp('4%') }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: hp('2.3%'),
                                color: '#000',
                            }}>
                            {item.Restaurant.name}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: hp('1.8%'),
                                color: '#7a7a7a',
                            }}>
                            {item.Restaurant.address}
                        </Text>
                        {!item.instantEat && <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: hp('1.8%'),
                                    color: '#000',
                                }}>
                                Discount Availed
                            </Text>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    marginLeft: wp('4%'),
                                    borderRadius: hp('0.6%'),
                                    borderWidth: 1,
                                    borderColor: '#d20000',
                                    paddingHorizontal: wp('2.5%'),
                                }}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp('1.8%'),
                                        color: '#d20000',
                                    }}>
                                    {item.discount}%
                                </Text>
                            </View>
                        </View>}
                      
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: hp('1.7%'),
                                marginTop:hp('0.5%'),
                                color: 'green',
                            }}>

                            {item.instantEat ? `In Progress` : item.status =='Unlocked' ? `Upcoming` : timer<=0 ? 'Unlock Now' :`${formattedTime}`}

                        </Text>

                        
                        {item.instantEat && (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: hp('1.8%'),
                                    color: '#000',
                                }}>
                                    Valid Till: <Text style={{ color: '#d20000' }}>{   instantExpiry}</Text>
                                </Text>
                            </View>
                        )}


                    </View>
                </View>
                {  renderUnlockButton()   }
            </Pressable>
        );
    }


export default UpcomingBookingCard;

const styles = StyleSheet.create({
    cardStyle: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 5,
        marginTop: 15,
        marginHorizontal: 10,
    },
    dateView: {
        marginHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

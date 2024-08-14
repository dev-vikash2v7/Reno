import React, { useState, useEffect, ReactNode, useContext  } from 'react';
import {
    Text,
    View,
    ScrollView,
    Linking,
    ActivityIndicator,
} from 'react-native';
import Image from 'react-native-fast-image';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { height, width } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
import { router } from 'expo-router';
import { Order } from 'src/types/order.interfaces';
import { cancelBooking } from 'src/services/order.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import awsconfig from 'src/aws-exports';
import { Amplify } from 'aws-amplify';
import {  CancelWarning  } from 'src/components/Common/OrderPopup';
import { setConfirmBookingData, setOrderDetails } from 'src/redux_store/reducers/order.reducer';
import { useDispatch, useSelector } from 'react-redux';
import WaitModal from 'src/components/Common/WaitModal';
import { RootState } from 'src/redux_store/store';
import { hp, mixpanel, wp } from '../Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeUserOrders } from 'src/redux_store/reducers/restaurent.reducer';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

Amplify.configure(awsconfig);

interface Props {
    route: any;
    cancelOrder: (orderId: string, callback: () => void) => void;
}


const ConfirmBooking: React.FC<Props> = () => {

    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [expireTime, setExpireTime] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [imgLoading, setImgLoading] = useState(true);
    
    const [cancelWarning, setCancelWarning] = useState(false);
   


    const data = useSelector((state:RootState) => state.order.confirmBookingData)


    const [orderData, setOrderData] = useState<Order |null >(data);


    useEffect(()=>{
        mixpanel.track('opened Confirm Booking');
        crashlytics().log('Confirm Booking mounted.');
    
      },[])

    const openGoogleMaps = (url: string) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error(err));
    };
    const dispatch = useDispatch()




    function addThirtyMinutes(timeString : string) {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);
      
        // Calculate the total number of minutes
        let totalMinutes = hours * 60 + minutes;
      
        // Add 30 minutes
        totalMinutes += 30;
      
        // Calculate the new hours and minutes
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
      
        // Format the new time string
        const newTimeString =
          `${newHours < 10 ? '0' : ''}${newHours}:${newMinutes < 10 ? '0' : ''}${newMinutes}`;
      
        // Return the result
        return `${timeString} - ${newTimeString}`;
      }
      




    const afterCancel = async () => {
      
        if (cancelLoading || cancelled || !orderData?.id) return;
        // await setChange(true)
        await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')
        
        dispatch(removeUserOrders({id : orderData} ))

    
        const orderId = orderData?.id;
        setCancelLoading(true);

        mixpanel.track('cancel booking' , orderData)
        await analytics().logEvent('cancel_booking', {
            orderData
          })

        await cancelBooking(orderId);


        dispatch(setOrderDetails({...orderData , status : 'Cancelled'}))


        setCancelLoading(false);
        setCancelled(true);
        router.replace('/Reservations/OrderDetails')
      }



    const confirmCancelOrder = () => {
        if (cancelLoading || cancelled) return;
        setCancelWarning(true)
    };



    useEffect(() => {
        const fetchData = async () => {
            try {


              if(!orderData) return
                
                let halfHour = Date.now();
                let hour = new Date(halfHour).getHours();
                let minute = new Date(halfHour).getMinutes();
                let time = `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`;
                setCurrentTime(time);

                halfHour = Date.now() + 1000 * 60 * 15;
                hour = new Date(halfHour).getHours();
                minute = new Date(halfHour).getMinutes();
                time = `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`;
                setExpireTime(time);

        
           
                if (orderData?.Restaurant.mainImageUrl) {
                    setImageURL(orderData?.Restaurant.mainImageUrl);
                } else {
                    const img = `https://d3eiw2rs38fo3w.cloudfront.net/public/${orderData?.Restaurant.uploadedImages[0]!}`;
                    setImageURL(img.toString());
                }

                setImgLoading(false);
                setLoading(false);

            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchData();

    }, []); 








    const renderHeader = (): ReactNode => {
        return (
            loading ? <ActivityIndicator size={40} style={{ flex: 1 }} /> :
                <Image
                    source={require('../../assets/confirm.gif')}
                    style={{ height:hp('32%'), width }}
                    resizeMode="cover">
                    <View
                        style={{
                            width,
                            paddingHorizontal: wp('3%'),
                            paddingVertical: wp('3.2%'),
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            flexDirection: 'row',
                        }}>
                        <Ionicons
                            name="arrow-back"
                            onPress={() => {
                                dispatch(setConfirmBookingData(null))
                                router.push('/drawer/Home')}}
                                size={hp('3.4%')}
                        />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#239A00',
                                fontSize: hp('2.4%'),
                                marginLeft: wp('3%'),
                            }}>
                            Booking Confirmed
                        </Text>
                    </View>
                </Image>
        );
    };

    
    const renderRestaurantDetails = (): ReactNode => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    margin: 10,
                    justifyContent: 'space-around',
                }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {
                        imgLoading ?
                            <View
                                style={{
                                    height: hp('15%'),
                                    width: wp('40%'),
                                    borderRadius: 8,
                                }}
                            >
                                <ActivityIndicator style={{ flex: 1 }} size={hp('4%')} />

                            </View>
                            
                            : <Image
                                source={{ uri: imageURL }}
                                style={{
                                    height: hp('15%'),
                                    width: wp('40%'),
                                    borderRadius: 8,
                                    // height: ((width / 2 - 30) * 3) / 4,
                                    // width: width / 2 - 30,
                                }}
                            />
                    }

                </View>
                <View
                    style={{
                        justifyContent: 'space-between',
                        flex: 1,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: hp('2.6%'),
                            color: '#000',
                        }}>
                        {orderData!.Restaurant.name}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: hp('1.9%'),
                            color: 'grey',
                        }}>
                        {orderData?.Restaurant.address}
                    </Text>
                    <Ripple
                        rippleColor="#d20000"
                        style={{
                            borderRadius: 6,
                            padding: 7,
                            margin: hp('1%'),
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: '#d20000',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: wp('4%'),
                        }}
                        onPress={() =>
                            Linking.openURL(`tel://+91${orderData!.Restaurant.phone[0]}`)
                        }>
                        <Foundation name="telephone" size={hp('3%')} color="#d20000" />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                marginLeft: wp('2.5%'),
                                color: '#d20000',
                            }}>
                            Contact Restaurant
                        </Text>
                    </Ripple>
                </View>
            </View>
        );
    };

    const renderCancelBooking = (): ReactNode => {
        return (
            <View
                style={{
                    flex: 1,
                    padding: hp('1.6%'),
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: '#fff',
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>


               
                <WaitModal visible={cancelLoading}/>
                
            {
                
                cancelled ? (
                    <View
                        style={{
                            flex: 1,
                            marginRight: wp('3%'),
                            padding: wp('2%'),
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: hp('1.8%'),
                                color: '#d20000',
                            }}>
                            Booking Cancelled
                        </Text>
                    </View>
                ) : (
                    <Ripple
                        onPress={confirmCancelOrder}
                        style={{
                            flex: 1,
                            marginRight: 10,
                            padding: 10,
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 14,
                                color: '#d20000',
                            }}>
                            Cancel Booking
                        </Text>
                    </Ripple>
                )}
                <Ripple
                    onPress={() => {
                        dispatch(setConfirmBookingData(null))
                        router.push('/drawer/Home');
                    }}
                    style={{
                        flex: 1,
                        borderRadius: 5,
                        backgroundColor: '#239A00',
                        padding: 10,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 16,
                            color: '#fff',
                        }}>
                        Done
                    </Text>
                </Ripple>
            </View>
        );
    };

    const renderBookingDetails = (): ReactNode => {
        return (
            <>
                <View
                    style={{
                        width: '100%',
                        borderWidth: 0.6,
                        borderColor: 'lightgrey',
                        marginTop: 15,
                    }}
                />

                
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: hp('1.2%'),
                        paddingHorizontal: wp('3%'),
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: wp('3.5%'),
                            alignItems: 'center',
                        }}>
                        <FontAwesome5 name="user" color="#000" size={hp('2.7%')} />
                        <Text
                            style={{
                                marginLeft: wp('3%'),
                                fontFamily: 'Poppins-Regular',
                                fontSize: hp('2%'),
                                color: 'black',
                            }}>
                            {orderData!.bookingName}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            color: '#d20000',
                            fontSize: hp('2%'),
                            marginRight: wp('3%'),
                        }}
                        onPress={() =>
                            openGoogleMaps(
                                `https://www.google.co.in/maps/dir//${orderData!.Restaurant.latitude},${orderData!.Restaurant.longitude}`
                            )
                        }>
                        Directions
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: hp('3%'),
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: wp('3%'),
                    }}>
                    <View
                        style={{
                            backgroundColor: '#FAFAFA',
                            borderRadius: 5,
                            width: wp('25%'),
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            padding: 5
                        }}>
                        <Text
                            style={{
                                color: '#D20000',
                                fontSize: hp('1.9%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            DAY
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: '#202020',
                                fontSize: hp('1.8%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            {new Date(orderData!.date).toDateString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#FAFAFA',
                            borderRadius: 5,
                            width: width * 0.25,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                        }}>
                        <Text
                            style={{
                                color: '#D20000',
                                fontSize:  hp('1.9%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            TIME SLOT
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: '#202020',
                                fontSize: hp('1.8%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            {orderData?.instantEat ? `${currentTime} - ${expireTime}` : addThirtyMinutes(orderData?.TimeSlot.time)}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#FAFAFA',
                            borderRadius: 5,
                            width: width * 0.25,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                        }}>
                        <Text
                            style={{
                                color: '#D20000',
                                fontSize: hp('1.9%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            PEOPLE
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: '#202020',
                                fontSize: hp('1.8%'),
                                fontFamily: 'Poppins-Regular',
                            }}>
                            {orderData!.tableSize}
                        </Text>
                    </View>
                </View>
            </>
        );
    }

    // render(): ReactNode {
    return (
        (loading ) ? <ActivityIndicator size={40} style={{ flex: 1 }} /> :
            <>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        backgroundColor: '#fff',
                    }}>
                    <SafeAreaView>
                        {renderHeader()}
                        <View>

                            <CancelWarning visible={cancelWarning} setVisible={setCancelWarning} handleCanel={afterCancel}/>

                            <Text
                                style={{
                                    marginTop: hp('1.1%'),
                                    alignSelf: 'center',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: hp('2.3%'),
                                    marginBottom: hp('1.1%'),
                                    color: '#d20000',
                                }}>
                                Thank you for reservation!
                            </Text>
                            {renderRestaurantDetails()}
                            {renderBookingDetails()}
                        </View>
                        <View style={{ height: hp('6%') }} />
                    </SafeAreaView>
                </ScrollView>
                {renderCancelBooking()}
            </>
    );
}
// }

export default ConfirmBooking;
// export default connect(null, { cancelOrder })(ConfirmBooking);

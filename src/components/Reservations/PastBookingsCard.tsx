import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ripple from 'react-native-material-ripple';
import { router } from 'expo-router';
import Image from 'react-native-fast-image';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from 'src/types/order.interfaces';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import * as Storage from 'aws-amplify/storage';
import { ActivityIndicator } from 'react-native-paper';
import { setOrderDetails } from 'src/redux_store/reducers/order.reducer';
import { useDispatch } from 'react-redux';
import { width } from 'src/constants';
import { hp, wp } from 'src/app/Login';

Amplify.configure(awsconfig);

interface Props {
    item: Order
}

const PastBookingsCard = (props: Props) => {
    const item = props.item;
    const [img, setImg] = useState<string>('');
    const [imgLoading, setImgLoading] = useState(true);
    const dispatch = useDispatch()


    
    useEffect(() => {

        (async () => {
            if (item.Restaurant.mainImageUrl) {
                setImg(item.Restaurant.mainImageUrl);
                setImgLoading(false);
                // console.log('g');
                return;
            }

            const url = `https://d3eiw2rs38fo3w.cloudfront.net/public/${item.Restaurant.uploadedImages[0]}`;
            setImg((url).toString());
            setImgLoading(false);
        })()
        // startTimer();
    }, [])

  
    return (
        <Ripple
            style={{
                flex: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowColor: '#00000029',
                elevation: 7,
                // shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                // shadowOpacity: 0.5,
                shadowRadius: 2,
                shadowOpacity: 0.2,
                marginTop: 15,
                marginHorizontal: 12,
                paddingHorizontal:5,
                width:width - 10 ,
                // height : 200
            }}
            onPress={async () => {
                
                if (item.status === 'Completed') {

                    // router.push('/')
                    const date = new Date(item.paymentTime)
                    const formattedDate = date.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }).replace(/ /g, '-');

                    const formattedTime = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });


                    dispatch(setOrderDetails(item))
                    router.push('/Reservations/OrderDetails'  )
                    return;
                }

                if(item.status == 'Cancelled'){
                    dispatch(setOrderDetails(item ))
                }
                else{
                    dispatch(setOrderDetails({...item , status : 'Expired'}))
                }
            router.push('/Reservations/OrderDetails'  )
            }
            }>
            <View
                style={{
                    margin: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <Text
                    style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: '#000',
                        fontSize: 16,
                    }}>
                    {moment(item.date).format('Do MMM YYYY')}
                </Text>


                {!item.instantEat && (
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#000',
                            fontSize: 14,
                        }}>
                        {item.TimeSlot.time}
                    </Text>
                )}


            </View>
            <View
                style={{
                    marginLeft: wp('1.9%'),
                    marginRight: wp('2%'),
                    marginBottom: wp('2%'),
                    flexDirection: 'row',
                }}>
                {
                    imgLoading ? <View
                        style={{ 
                            height: hp('15%'),
                            width: hp('15%'),
                             borderRadius: hp('1.1%')
                             }}
                    >
                        <ActivityIndicator size={hp('4%')} color={'#d20000'} style={{ flex: 1 }} />
                    </View> :
                        <Image
                            source={{ uri: img }}
                            style={{ 
                                height: hp('15%'),
                                width: hp('15%'),
                                  borderRadius: hp('1.1%') 
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
                        {item.Restaurant.address.split(' ')[item.Restaurant.address.split(' ').length - 1]}
                    </Text>
                    {
                        item.status === 'Completed' ?
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: hp('1.8%') }}>
                                Bill Amount: ₹{item.amount}
                            </Text> : <></>
                    }
                    <View
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
                                paddingHorizontal:  wp('2.5%'),
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
                    </View>
                </View>
            </View>
            <View
                style={{
                    width: wp('95%'),
                    alignSelf: 'center',
                    marginBottom: hp('2%'),
                    marginLeft:wp('5.4%')
                }}>
                {item.status === 'Completed' ? (
                    <Text
                        style={{
                            color: 'green',
                            fontFamily: 'Poppins-Medium',
                        }}>
                        {'Reservation Completed'}
                    </Text>
                ) : item.status === 'Cancelled' ? (
                    <Text
                        style={{
                            color: '#d20000',
                            fontFamily: 'Poppins-Medium',
                        }}>
                        {'Reservation Cancelled'}
                    </Text>
                ) : (
                    <Text
                        style={{
                            color:
                                // item.hasPaymentDispute
                                0
                                    ? '#d20000'
                                    :
                                    // item.unlockActive
                                    0
                                        ? 'green'
                                        : '#d20000',
                            fontFamily: 'Poppins-Medium',
                        }}>
                        {'Reservation Expired'}
                    </Text>
                )}
            </View>
        </Ripple>
    )
}

export default PastBookingsCard
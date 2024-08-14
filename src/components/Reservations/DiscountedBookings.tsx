import React, { Component } from 'react';
import { Text, View, FlatList, Image, Platform } from 'react-native';
import _ from 'lodash';
import { height, width } from 'src/constants';
import moment from 'moment';
import { Order } from 'src/types/order.interfaces';
import PastBookingsCard from './PastBookingsCard';
import UpcomingBookingCard from './UpcomingBookingsCard';
import { hp } from 'src/app/Login';

interface Props {
    setBillingOrder: React.Dispatch<React.SetStateAction<Order | undefined>>,
    bottomSheetRef: any;
    setSuccessVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setWarningVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setAlertVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setContent : React.Dispatch<React.SetStateAction<string>>,
    setLocation : any,
    data: Order[] ,
    setLoadingVisible : any ,
 handleSuccess:any,



}



 const DiscountedBooking =  ( {
    data , 
    bottomSheetRef ,
     setBillingOrder ,
     setWarningVisible , 
     setSuccessVisible  ,
      setContent , 
      setAlertVisible  , 
       setLocation ,
       handleSuccess, 
       setLoadingVisible

     
     } : Props ) =>  {


        // const EmptyStateComponent = () => (
        //     <View style={{ width: '100%', alignItems: 'center' }}>
        //       <View style={{ width: '90%', height: 320 }}>
        //         <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 17, textAlign: 'center', marginTop: 20 }}>
        //           No bookings available
        //         </Text>
        //       </View>
        //     </View>
        //   );

    if(data && data.length > 0) {
    return (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={Platform.OS == 'android' ? <View style={{ height: hp('11%') }}/> : <></>}
                    data={data}

                    keyExtractor={(item) => item.id}

                    // ListEmptyComponent={<EmptyStateComponent/>}
                    // estimatedItemSize={100}

                    renderItem={({ item, index }) => {
                        if (!item.Restaurant) {
                            return null;
                        }
                        const orderTime = item.TimeSlot.time;
                        const hours = orderTime.split(':')[0];
                        const minutes = orderTime.split(':')[1];
                        const orderExpiry = moment(item.date)
                            .set('hours', Number(hours))
                            .set('minutes', Number(minutes));
                        // Setting the expiry time
                        orderExpiry.add(30, 'minutes');
                        
                        if (item.status === 'Completed' || item.status === 'Cancelled' || orderExpiry.valueOf() < moment().valueOf()) {
                            return <PastBookingsCard item={item} />
                        }
                        return (
                            <UpcomingBookingCard infoOnly={false} index={index} item={item} setItem = { setBillingOrder}  bottomSheetRef={ bottomSheetRef}   setSuccessVisible={setSuccessVisible} setWarningVisible = {setWarningVisible} setContent= {setContent}  setAlertVisible={setAlertVisible}   setLocation={setLocation}setLoadingVisible = {setLoadingVisible} handleSuccess={handleSuccess}
 
                            />
                        );
                    }}
                />
            );
        }
      
        else {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/no-reservations.png')}
                        style={{ height: height * 0.3, width: width, marginTop: 50 }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            marginTop: 20,
                            fontSize: 26,
                            color: '#000',
                        }}>
                        No Reservations Found
                    </Text>
                    <View style={{ flex: 1, paddingHorizontal: 30 }}>
                        <Text
                            style={{
                                marginTop: 8,
                                color: '#777777',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 15,
                                textAlign: 'center',
                            }}>
                            Reserve a table now and avail discounts on your bill
                        </Text>
                    </View>
                </View>
            );
        }
    }

export default DiscountedBooking;

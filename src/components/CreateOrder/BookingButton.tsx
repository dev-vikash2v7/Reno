
interface FooterProps {
  timeDiscountSlotId: string | null;
  phoneno: string;
  name: string;
  active: boolean;
  userId: string,
  people: number,
  discount: number,
  restaurantId: string,
  restaurantName: string;
  timeStamp: number,
  instantEat: boolean,
  time: string,

  rating : number  | undefined,
  distance : number | undefined ,
  duration : number  | undefined,
  aov : number|undefined,
  category : RestaurantCategory|undefined,
  
  callbackFromParent: (error: boolean, errorMessage: string) => void;
}


import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { width } from 'src/constants';
import Ripple from 'react-native-material-ripple';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveContact } from 'src/services/user.service';
import { createBooking, sendBookingInfoWhatsapp } from 'src/services/order.service';
import { hp, mixpanel, wp } from 'src/app/Login';
import WaitModal from '../Common/WaitModal';
import {  setConfirmBookingData, setOtpRouteData } from 'src/redux_store/reducers/order.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RestaurantCategory } from 'src/types/interfaces';
import { RootState } from 'src/redux_store/store';
import { addUserOrders } from 'src/redux_store/reducers/restaurent.reducer';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';



const BookingButton = ({ timeDiscountSlotId, phoneno, name, active, userId, people, discount, restaurantId, restaurantName, timeStamp, instantEat, time, callbackFromParent  , rating   , aov , distance , duration , category}:FooterProps) => {



const {coordinates  } = useSelector((state : RootState) => state.user)
const dispatch = useDispatch()


  const mixpanelData = {
      restaurantId , 
      restaurantName, 
      discount  : discount + ' %',
      rating,
      phoneno, 
      TableSize : people, 
       timeSlotSelected: instantEat ? new Date().getHours() + ":" +new Date().getMinutes()  :  time ,
       slotDateSelected : new Date(timeStamp).toLocaleDateString(),
       aov: aov + ' Rs' , 
       category : category?.name,
       distanceFromRestaurant : distance ,
        time ,
  }



  const [loading, setLoading] = useState(false);
  let error = '';



  const canConfirmBooking = () => {


    console.log('a',moment(new Date(timeStamp)).date())
    console.log(moment(new Date()).date())


    if(!instantEat && (moment(new Date(timeStamp)).date() < (moment(new Date()) ).date() ) ){
      error = 'Please choose another date.';
      return false;
    }

    if (!instantEat && !timeDiscountSlotId) {
      error = 'Please select a slot';
      return false;
    }

    if (!phoneno.match(/\d/g) || (phoneno.match(/\d/g) && phoneno.match(/\d/g)!.length !== 10)) {
      error = 'Phone number is invalid';
      return false;
    }

    if (name.trim().length < 2) {
      error = 'Name is too short';
      return false;
    }

    error = '';
    return active;
  };

  return (
    <>
      <WaitModal visible={loading}/>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { height: -3, width: 0 },
          height: hp('11%'),
          elevation: 15,
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
        }}
      >
        <Ripple
          onPress={async () => {
            if (canConfirmBooking()) {
              // await setChange(true)
          await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')


              setLoading(true);

              dispatch(setOtpRouteData({ timeDiscountSlotId, phoneno, name, active, userId, people, discount, restaurantId, restaurantName, timeStamp, instantEat, time }))

              const contact = await AsyncStorage.getItem('contact');


              if (contact && phoneno == contact) {

                const res = await createBooking({
                  date: (new Date(timeStamp)).toISOString(),
                  instantEat: instantEat,
                  tableSize: people,
                  timeDiscountSlotId: timeDiscountSlotId!
                });

              //  await setChange(true)
                await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')
              
                if (res.data.success) {
                  
               
                  dispatch(setConfirmBookingData(res.data.orderData))

                  dispatch(addUserOrders(res.data.orderData))

                  // await sendBookingInfoWhatsapp(name, restaurantName, people, time, discount, phoneno);

                  if(instantEat){

                    await analytics().logEvent('InstantEat_Booking_Create',  {...mixpanelData , locationMap : coordinates.location_map_url })

                    mixpanel.track('instant booking success', {...mixpanelData , locationMap : coordinates.location_map_url });
                  }
                  else{
                    await analytics().logEvent('Reservation_Booking_Create', mixpanelData)

                    mixpanel.track('reservation booking success', mixpanelData);
                  }


                  setLoading(false);

                  // dispatch(setChangeRestaurant(null))
                  router.push('/CreateOrder/ConfirmBooking' );

                } else {
                  console.error(res.data);
                }


              }
              
              else {


                await AsyncStorage.setItem('contact', phoneno);

                await saveContact(phoneno, userId);

                const res = await createBooking({ date: (new Date(timeStamp)).toISOString(), instantEat, tableSize: people, timeDiscountSlotId });
                // await setChange(true)
          await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')


                if (res.data.success) {
                  dispatch(setConfirmBookingData(res.data.orderData));
                  
                  dispatch(addUserOrders(res.data.orderData))

                  if(instantEat){
                    await analytics().logEvent('InstantEat_Booking_Create', mixpanelData)
                    mixpanel.track('instant booking success', mixpanelData);
                  }
                  else{
                    await analytics().logEvent('Reservation_Booking_Create', mixpanelData)
                    mixpanel.track('reservation booking success', mixpanelData);
                  }

                  // await sendBookingInfoWhatsapp(name, restaurantName, people, time, discount, phoneno);


                  router.push('/CreateOrder/ConfirmBooking' );
                } else {
                  console.error(res.data);
                }
              }
            } else {
              callbackFromParent(true, error);
            }
          }}
          style={{
            width: wp('90%'),
            height: hp('7.5%'),
            backgroundColor: canConfirmBooking() ? '#d20000' : '#00000059',
            borderRadius: hp('0.6%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: hp('2.2%'),
              color: '#fff',
            }}
          >{
              instantEat ? `Book at ${discount}% Off` : 'Confirm Booking'
            }
          </Text>
        </Ripple>
      </View>
    </>
  );
};

export default BookingButton;

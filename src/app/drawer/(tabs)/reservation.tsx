import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import TabBarComponent from 'src/components/Common/TabBarComponent';
import _ from 'lodash';
import { getUserOrders } from 'src/services/order.service';
import { Order } from 'src/types/order.interfaces';
import InstantEatBookings from 'src/components/Reservations/InstantEatBookings';
import DiscountedBooking from 'src/components/Reservations/DiscountedBookings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from 'src/app/Login';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import BillPopup from 'src/components/Home/BillPopup';
import LoadingSkeleton from 'src/components/Reservations/LoadingSkeleton';
import { AlertWarning, Success, Warning } from 'src/components/Common/OrderPopup';
import { unlockBooking } from 'src/services/order.service';
import {  StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import WaitModal from 'src/components/Common/WaitModal';
import { LocationObject } from 'expo-location';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnlockUserOrder } from 'src/redux_store/reducers/restaurent.reducer';
import NoInternetScreen from 'src/components/Common/NoInternet';
import crashlytics from '@react-native-firebase/crashlytics';


const Reservations = () => {


  const [instantEatOrders, setInstantEatOrders] = useState<Order[]>();
  const [discountedOrders, setDiscountedOrders] = useState<Order[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [billingOrder, setBillingOrder] = useState<Order>();

  const [successVisible, setSuccessVisible] = React.useState(false);
  const [warningVisible, setWarningVisible] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const [location, setLocation] = useState<{ "latitude": number, "longitude": number}>();
  const [content, setContent] = useState<string >('');

  const [isConnected, setConnected] = useState<boolean >(true);


  const dispatch = useDispatch()

  const snapPoints = useMemo(() => ['53%', '90%'], []);

  async function fetch(){

    let allOnGoingOrdersChange =await AsyncStorage.getItem('allOnGoingOrdersChange')
  
        if(!allOnGoingOrdersChange || allOnGoingOrdersChange=='yes'){
          await getMyReservations();
          await AsyncStorage.setItem('allOnGoingOrdersChange' , 'no')
        }
  }  

  useEffect(()=>{
    mixpanel.track('opened reservation');

    crashlytics().log('reservation mounted.');

  },[])

useFocusEffect(
    React.useCallback(() => {
fetch()
    }, [])
  )

  const getMyReservations = async () => {
    try {

      setLoading(true);

      let data ;


     const  res = await getUserOrders();

     setConnected(true)

     data = res.data.orders

    

      // console.log('res orders : ' , res.data.orders )
      const orders = data || [];

      
      // let instantEatOrdersArray: Order[] = [];
      // const discountedOrdersArray: Order[] = [];

      const IunlockedOrders : Order[] = [];
      const IconfirmOrders : Order[] = [];
      const IotherOrders : Order[]= [];
      const DunlockedOrders : Order[]= [];
      const DconfirmedOrders : Order[]= [];
      const DotherOrders: Order[] = [];

      orders.forEach((item: Order) => {
        
                if (!item.Restaurant) {
                  return;
                }

        if (item.instantEat) {

          const orderTime1 = new Date(item.createTime).getTime();
          let halfHour = orderTime1 + 15 * 60 * 1000;

          if (item.status !== 'Completed' && item.status !== 'Cancelled' && halfHour > (new Date()).getTime())     {

            if (item.status === 'Unlocked') {
              IunlockedOrders.unshift(item);
            }
              else if (item.status === 'Confirmed') {
                IconfirmOrders.unshift(item);
              }
            }
             else {
              IotherOrders.unshift(item);
            }
         } 
        
        else {
          const orderTime = item.TimeSlot.time;
          const hours = orderTime.split(':')[0];
          const minutes = orderTime.split(':')[1];
    
          const orderExpiry = moment(item.date).set('hours', Number(hours)).set('minutes', Number(minutes));
    
          // Setting the expiry time
          orderExpiry.add(30, 'minutes');
    
          if (item.status !== 'Completed' && item.status !== 'Cancelled' && orderExpiry.valueOf() > moment().valueOf()) {

              if (item.status === 'Unlocked') {
                DunlockedOrders.unshift(item);
              } else if (item.status === 'Confirmed') {
                DconfirmedOrders.unshift(item);
              } 
            }
          else       DotherOrders.unshift(item);
        }
      });
      
     setDiscountedOrders([...DunlockedOrders, ...DconfirmedOrders, ...DotherOrders]);
     setInstantEatOrders([...IunlockedOrders,...IconfirmOrders,...IotherOrders]);

      setLoading(false);

    } catch (error) {
      console.error('Error fetching orders:', error);

      if(isConnected)
        setConnected(false)

    
      setLoading(false);
      setTimeout(async()=>{
        await getMyReservations()
      },1000)
    }  

    await AsyncStorage.setItem('allOnGoingOrdersChange' , 'no')


  };




  const handleSuccess =  async (location : string)=>{
  //  await setChange(true)
  await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')

  dispatch(UnlockUserOrder( { id : billingOrder.id , location } ))

    await getMyReservations()
    setSuccessVisible(true)
  }


  async function afterUnlock(){
    if(billingOrder && location){
                  const location1 = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                  setLoadingVisible(true)
                  await unlockBooking(billingOrder.id, location1);
                  setLoadingVisible(false)    

                  
                 handleSuccess(location1)
    }
  }

     
  if(!isConnected) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
  <NoInternetScreen/>
  </SafeAreaView>
)
  
  
    return (
      <SafeAreaView style={{
        flex: 1, backgroundColor: '#F1F0F0',
      }}>

        {
          loading ? <LoadingSkeleton/>
          :
          <>
        <TabBarComponent

          instantEatBookings={
          <InstantEatBookings data={instantEatOrders!} 
          setBillingOrder = {setBillingOrder}  
          bottomSheetRef={bottomSheetRef}
          setSuccessVisible={setSuccessVisible} 
          setWarningVisible = {setWarningVisible} 
          setContent= {setContent}  
          setAlertVisible={setAlertVisible} 
           setLocation={setLocation}
           handleSuccess = {handleSuccess}
            setLoadingVisible = {setLoadingVisible}
          />
        }
          
          reservations={ 

          <DiscountedBooking 
          data={discountedOrders!} 
          setBillingOrder = {setBillingOrder}  
          bottomSheetRef={bottomSheetRef}
          setSuccessVisible={setSuccessVisible} 
          setWarningVisible = {setWarningVisible} 
          setContent= {setContent}  
          setAlertVisible={setAlertVisible} 
           setLocation={setLocation}
           handleSuccess = {handleSuccess}
            setLoadingVisible = {setLoadingVisible}

           />
          }
        />

<Success 
              visible = {successVisible}
              setVisible={setSuccessVisible}
              />
              <Warning 
              visible = {warningVisible}
              setVisible={setWarningVisible}
              content={content}
              />

              <AlertWarning 
              visible = {alertVisible}
              setVisible={setAlertVisible}
              content={content}
              afterUnlock={afterUnlock}
              />

          


<WaitModal visible={loadingVisible}/>


    
{  billingOrder &&   <BillPopup billingOrder={ billingOrder}  bottomSheetRef={bottomSheetRef} snapPoints={snapPoints}/>}
</>
}

      </SafeAreaView>
    )  
  }



  
export default Reservations;


import React, { Fragment, useEffect, useState, useMemo, useRef, useCallback, useContext, } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  Text,
  Alert,
  Platform,
  AppState,
} from 'react-native';
import { unlockBooking } from 'src/services/order.service';
import RenderRestaurants from 'src/components/Home/RenderRestaurants';
import RenderSlider from 'src/components/Home/RenderSlider';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import {  HomeScreenProps, Restaurant, TimeDiscount } from 'src/types/interfaces';
import { getBrandTilesByCity, getNearbyRestaurants, getRestaurantsByCity } from 'src/services/restaurants.service';
import {  useLocalSearchParams } from 'expo-router';
import SortBy from 'src/components/Common/SortBy';
import { Sort } from 'src/components/Common/SortBy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserOrders } from 'src/services/order.service';
import { Order } from 'src/types/order.interfaces';
import moment from 'moment';
import InHouseOrderingCard from 'src/components/Home/InHouseOrderingCard';
import BottomSheet from '@gorhom/bottom-sheet';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { mixpanel } from 'src/app/Login';
import Header from 'src/components/Home/Header';
import Filters from 'src/components/Common/Filters';
import { useDispatch, useSelector } from 'react-redux';
import BillPopup from 'src/components/Home/BillPopup';
import SearchBar from 'src/components/Home/SearchBar';
import { RootState } from 'src/redux_store/store';
import { setAllRestaurentsByCity   , setAllRestaurantsCategories ,setAllOnGoingOrders, UnlockUserOrder, removeUserOrders, updateTimeDiscount} from 'src/redux_store/reducers/restaurent.reducer';
import Loading from 'src/components/Home/LoadingSkeleton';
import RestaurantsLoading from 'src/components/Home/RestaurantsLoading';
import { getCurrentPosition } from 'src/utils/location.urtils';
import OnGoingOrdersLoading from 'src/components/Home/OnGoingOrdersLoading';
import { AlertWarning, NoInternetWarning, Success, Warning } from 'src/components/Common/OrderPopup';
import { LocationObject } from 'expo-location';
import WaitModal from 'src/components/Common/WaitModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleUnlock } from 'src/utils/common/handleUnlock';
import * as Notifications from 'expo-notifications';
import { TouchableWithoutFeedback } from 'react-native';
import checkExpiry from 'src/utils/common/checkExpiry';
import { handleMultipleTimeSlotExhaust, handleReviveRestaurant, handleShutDownRestaurant, handleSingleTimeSlotChange, handleSingleTimeSlotExhaust, handleTimeSlotChange } from 'src/utils/home/handleSlotLiveChanges';
import Ably from 'ably';

import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';



import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from 'src/components/Common/NoInternet';
import Toast from 'react-native-root-toast'

import {heightPercentageToDP as hp , widthPercentageToDP as wp} from  'react-native-responsive-screen'
import { Button } from 'react-native-paper';

const ably = new Ably.Realtime({key : '4vlqig.vms2Qg:TapNWRxHtiL4W8ZmP3aBev9y6L9piRHC4y8wQprd-hU'  , httpRequestTimeout: 10000});
const channel = ably.channels.get('reno');

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

  const [successVisible, setSuccessVisible] = React.useState(false);
  const [warningVisible, setWarningVisible] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const { guest } = useLocalSearchParams();
  const [sortName, setSortName] = useState<string | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [filter, setFilter] = useState({ pubs: false, casual: false, luxury: false });
  const [id , setId] = useState(null)
  

  const scrollX = new Animated.Value(0);
  
  const snapPoints = useMemo(() => [ '63%' , '90%'], []);
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [billingOrder, setBillingOrder] = useState<Order>();
  
  const dispatch = useDispatch();
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  
  const [allRestaurantsCategoriesLoading, setAllRestaurantsCategoriesLoading] = useState<boolean>(false);
  const [allOnGoingOrdersLoading, setAllOnGoingOrdersLoading] = useState<boolean>(false);
  const [allRestaurentsByCityLoading, setAllRestaurentsByCityLoading] = useState<boolean>(false);
  
  
  const { allRestaurentsByCity,allRestaurantsCategories ,allOnGoingOrders  ,changeRestaurant } = useSelector((state : RootState) => state.restaurent)
  const { city  } = useSelector((state : RootState) => state.user)

  
  const messageQueue : any[]= [];
  const [processingQueue, setProcessingQueue] = useState(false);


  let updatedRestaurants : Restaurant[]  =[];

  // const showAlert = () => {
	// 	Alert.alert(
	// 		'Internet Connection',
	// 		'You are offline. Some features may not be available.'
	// 	);
	// };
  
  
  const [item, setItem] = useState<Order>();
  const [location, setLocation] = useState<{ "latitude": number, "longitude": number}>();
  const [content, setContent] = useState<string >('');
  const [newLoad , setNewLoad] = useState(true)


  const [isConnected, setConnected] = useState<boolean >(true);
  const [showNoConnection, setShowNoConnection] = useState<boolean >(false);


	useEffect(() => {

		const unsubscribe = NetInfo.addEventListener((state) => {

      // console.log('STATE' , state)

			if (!state.isConnected) {
        setShowNoConnection(true)
			}
      else{
        setShowNoConnection(false)
        
      }
		});
		return () => {
      unsubscribe();
		};
	}, []);
  
  
  
  
  useEffect(()=>{
    mixpanel.track('opened home');
    crashlytics().log('Home mounted.');
    renderData()
  },[])


  const EmptyStateComponent = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View style={{ width: '90%', height: 320 }}> 
        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 17, textAlign: 'center', marginTop: 20 }}>
          No restaurants available at the moment
        </Text>
      </View>
    </View>
  );




 useEffect(()=>{

  async()=>{
 
    if(changeRestaurant ){
     let  tochange = updatedRestaurants?.length == 0 ?  allRestaurentsByCity : updatedRestaurants
      const updatedRestaurants_ =     (tochange).map( (rest) => {
          if (rest.id == changeRestaurant.id ) {
            return changeRestaurant;
          } else {
            return rest;
          }
        })
        setRestaurants((prevRestaurants) => updatedRestaurants_);
        dispatch(setAllRestaurentsByCity(updatedRestaurants_));
        updatedRestaurants = updatedRestaurants_
      }
    }
  },[changeRestaurant])
  




  useEffect(() => {
    
    if(!isConnected || showNoConnection) return

    ably.connection.on((stateChange) => {
      
      let reconnectAttempts = 0;
  const  MAX_RECONNECT_ATTEMPTS = 5

  console.log('Ably connection state:', stateChange.current);

  if (stateChange.current === 'failed' || stateChange.current === 'disconnected') {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.pow(2, reconnectAttempts) * 10000; // Exponential backoff
      setTimeout(() => {
        ably.connection.connect();
        reconnectAttempts++;
      }, delay);
    } else {
      console.log('Max reconnect attempts reached.');
    }
  }
});
     

  }, []);

 


   async function handleMessage(message : any) {
      const  {     restaurantId ,      slots  , slotId, type , exhausted ,discount} = JSON.parse(message.data)



    //  let  tochange = allRestaurentsByCity.length == 0 ? data : allRestaurentsByCity
     let  tochange = updatedRestaurants?.length == 0 ?  allRestaurentsByCity : updatedRestaurants

      if(type == 'onTimeSlotDiscountChange'){
       updatedRestaurants =  handleTimeSlotChange( restaurantId ,      slots , tochange)
      }
      if(type == 'onSingleTimeSlotDiscountChange'){
        updatedRestaurants =   handleSingleTimeSlotChange( restaurantId ,      slotId , discount , tochange)
      }
      else if(type == 'onSingleTimeSlotExhaust'){
        updatedRestaurants =   handleSingleTimeSlotExhaust( restaurantId ,      slotId , exhausted , tochange)
      }
      else if(type == 'onMultipleTimeSlotExhaust'){
        updatedRestaurants =   handleMultipleTimeSlotExhaust( restaurantId ,      slots ,tochange)
      }
      else if(type == 'onReviveRestaurant'){
        updatedRestaurants =  await handleReviveRestaurant( restaurantId     ,tochange)
      }
      else if(type == 'onShutDownRestaurant'){
        updatedRestaurants = await  handleShutDownRestaurant( restaurantId  ,tochange)
      }


   if(!updatedRestaurants || updatedRestaurants.length == 0) return 

   const selectedId = await AsyncStorage.getItem('selectedId')

  //  console.log('home selectedRestaurant : ' ,selectedId )

      if(selectedId && restaurantId == selectedId){

    updatedRestaurants.forEach(rest=>{
      if(rest.id == restaurantId){
        dispatch(updateTimeDiscount(  rest.timeDiscount  ))
        return
      }
    })
   }
      setRestaurants((prevRestaurants) => updatedRestaurants);
      dispatch(setAllRestaurentsByCity(updatedRestaurants));
    }
    

    const processMessageQueue = () => {
      if (messageQueue.length > 0) {
        const message = messageQueue.shift(); // Dequeue message
        handleMessage(message); // Process the message
      }
    };
    

    useEffect(()=>{

      const handleMessageQueue = () => {
        if (!processingQueue) {
          setProcessingQueue(true); // Set flag to indicate processing
          processMessageQueue(); // Process the next message in the queue
        }
      };
      channel.subscribe('message' ,(message)=>{
        messageQueue.push(message);
        handleMessageQueue(); 
      })
  return ()=>{
         channel.unsubscribe('message', handleMessage);
  }
    },[processingQueue])





    
    useEffect(() => {
      // Watch for changes in messageQueue length to trigger processing
      if (messageQueue.length > 0 && !processingQueue) {
        setProcessingQueue(true); // Set flag to indicate processing
        processMessageQueue(); // Process the queue
      }
    }, [messageQueue, processingQueue]);






  useEffect(() => {

    const intervalId = setInterval( async() => {

      const now = new Date();
      const currentMinute = now.getMinutes();

      allOnGoingOrders.map(async(order)=>{
        const isexpiry =  checkExpiry(order )

            if(isexpiry){
                dispatch(removeUserOrders({id:order.id}));
               await  AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')
            }
      })
      // Check if the current minute is 00 or 30 to trigger fetch
      if (currentMinute == 0 || currentMinute == 30) {
        setNewLoad(true)
       await renderRestaurants();
      }
    }, 60000); // Run every minute (60000 milliseconds)

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures useEffect runs only once on mount






  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const item = response.notification.request.content.data.order;
   
            handleUnlock({
              item,
             setLoadingVisible ,
             setContent , 
             setAlertVisible  , 
              setItem ,
               setLocation ,
               handleSuccess 
             })

    });
    return () => subscription.remove();
    }, []);




  function showbill(){
    bottomSheetRef.current?.snapToIndex(0)
  }

  
  
  
  
  const getOnGoingOrder = async () => {


    setAllOnGoingOrdersLoading(true)

    let data ;
    const  res = await getUserOrders();
    data = res.data.orders

    let orders: Order[] = [];
    
    data.forEach(async (item: Order) => {

      if (!item.Restaurant) {
        return;
      }

      if (item.instantEat) {

        const orderTime1 = new Date(item.createTime).getTime();
        let halfHour = orderTime1 + 15 * 60 * 1000;
        if (item.status !== 'Completed' && item.status !== 'Cancelled' && halfHour > (new Date()).getTime()) {
          orders.push(item);
        }
      }
      else{

        const orderTime = item.TimeSlot.time;
        const hours = orderTime.split(':')[0];
        const minutes = orderTime.split(':')[1];
  
        const orderExpiry = moment(item.date).set('hours', Number(hours)).set('minutes', Number(minutes));
  
        // Setting the expiry time
        orderExpiry.add(30, 'minutes');
  
        if (item.status !== 'Completed' && item.status !== 'Cancelled' && orderExpiry.valueOf() > moment().valueOf()) {
          orders.push(item);
        }
      }
    })


    dispatch(setAllOnGoingOrders({data : [...orders]}))

    setAllOnGoingOrdersLoading(false)

  }











  
 
  
  const fetchNearByRestaurants = async  () => {
    
    try {
      const {success , coordinates} = await getCurrentPosition(dispatch )

    if(success){
     if( coordinates && coordinates.latitude != 0 && coordinates.longitude != 0){
        const res =  getNearbyRestaurants( coordinates.longitude, coordinates.latitude, allRestaurentsByCity)
        return res
      }
    }
  }
      
 catch (error) {
      console.log(' setNearByRestaurants error  : ' ,error);
      return false
    } 
  }



  
  const renderRestaurants = async () => {

    try{

      
      setAllRestaurentsByCityLoading(true);
      
      if(allRestaurentsByCity.length == 0  || newLoad) {
        
        const new_restaurants = await getRestaurantsByCity();

        if(!new_restaurants) {
          
          setAllRestaurentsByCityLoading(false);
    return
    
  }
  setRestaurants(new_restaurants);
  
  updatedRestaurants = new_restaurants
  
  dispatch(setAllRestaurentsByCity([...new_restaurants]))
  
  setNewLoad(false)
}
else{
  
  updatedRestaurants = allRestaurentsByCity
  setRestaurants(allRestaurentsByCity);
}
setAllRestaurentsByCityLoading(false);
setConnected(true)

}
catch(err){
  console.error(err)

  if(isConnected)
   setConnected(false)

  setTimeout(async()=>{
    await renderRestaurants()
  },1000)
}
  }



  const renderCategories = async () => {

    setAllRestaurantsCategoriesLoading(true);
    
    if(allRestaurantsCategories.length == 0 ) {
      const res = await getBrandTilesByCity();

      dispatch(setAllRestaurantsCategories([...res.data.data]))
    }

    setAllRestaurantsCategoriesLoading(false);
  }




  const renderData = async () => {
    try {

      
      console.log('=========renderCategories=========')
      await renderCategories();
      console.log('=========getOnGoingOrder=========')
      await getOnGoingOrder();
      console.log('=========renderRestaurants=========')
      await renderRestaurants();
      
      // console.log('=========fetchNearByRestaurants=========')
      // await fetchNearByRestaurants();
      // setConnected(true)
      
    }
     catch (error) {
      // console.log('renderData error : ',error);

      if(isConnected)
        setConnected(false)

      setTimeout(async()=>{
        await renderData()
      },2000)

    }

  };

 


  const sortByRating = () => {

    setAllRestaurentsByCityLoading(true);
    const sortedRestaurants = [...restaurants];
    sortedRestaurants.sort((a, b) => b.rating - a.rating);
    setRestaurants(sortedRestaurants);

    
      
      setTimeout(() => {
        setAllRestaurentsByCityLoading(false);
      }, 1)
   
  }



  const sortByDiscount = () => {
    setAllRestaurentsByCityLoading(true);
    let sortedData = [...restaurants];
    sortedData.sort((a, b) => b.rating - a.rating);
    setRestaurants(sortedData);
    setTimeout(() => {
      setAllRestaurentsByCityLoading(false);
    }, 1)
   
  }

  const sortByAvgPrice = () => {

    setAllRestaurentsByCityLoading(true);
    let sortedData = [...restaurants];
    sortedData.sort((a, b) => a.aov - b.aov);
    setRestaurants(sortedData);
    setTimeout(() => {
      setAllRestaurentsByCityLoading(false);
    }, 1)
  }



  const sortByDistanceSubmit = async () => {

    setAllRestaurentsByCityLoading(true);


    try{
       const res = await    fetchNearByRestaurants()
       
              if(res){

                let sortedData : Restaurant[] = res;
                
                sortedData.sort((a, b) => a.distance - b.distance)
                
                setRestaurants(sortedData);

              setAllRestaurentsByCityLoading(false);
              }
              else{
                // Alert.alert('Location is required to apply this sorting')
                setAllRestaurentsByCityLoading(false);
              }
      }
      catch(err){
        console.log('ERRR sortByDistanceSubmit' ,err)
        // Alert.alert('Location is required to apply this sorting')
        setAllRestaurentsByCityLoading(false);
      }
  }


  
  
    useEffect(() => {

      if (sortName === Sort.Distance) {
        sortByDistanceSubmit();
  
      } else if (sortName === Sort.Ratings) {
        sortByRating();
  
      } 
      else if (sortName === Sort.AOV_Price) {
        sortByAvgPrice();
      }
      else if (sortName === Sort.Discount) {
        sortByDiscount();
      }
      else {
        console.log('throw sorting')
        renderRestaurants();
      }
    }, [sortName])

  
    
    
    

      
      const handleSuccess =async (location  : string) => {

        if(!item) return 
        setSuccessVisible(true)

        const mixpanelData = {
          restaurantId  : item.restaurantId, 
    restaurantName : item.Restaurant.name, 
    discount  : item.discount + ' %',
    rating : item.Restaurant.rating,
    TableSize : item.tableSize, 
    timeSlotSelected: item.TimeSlot.time,
    slotDateSelected :item.date,
    category : item.Restaurant.category?.name,
    distanceFromRestaurant : item.Restaurant.distance ,
    location_map_url  : location
  }
  
  mixpanel.track('unlock booking'  , mixpanelData)
  
  await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')

  await analytics().logEvent('unlock_booking', {
   mixpanelData
   })
        dispatch( UnlockUserOrder({id : item.id , location}) )

    }
    
    
    async function afterUnlock(){
      if(item && location && location){
        
        
    
        
        const location1 = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
        
        setLoadingVisible(true)
        await unlockBooking(item.id, location1);
        setLoadingVisible(false)
        
        
                handleSuccess(location1)
              }
            }



            if(showNoConnection) return   <NoInternetWarning 
            visible = {showNoConnection}
            setVisible={setShowNoConnection}
            />
  
            
            
            if(!isConnected) return (
              <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
              <Header/>
            <NoInternetScreen/>
            </SafeAreaView>
          )
            
            // if(true ) return( <Loading/>)
            if(!isConnected || (allRestaurantsCategoriesLoading || allOnGoingOrdersLoading ) ) return( <Loading/>)


            
            return (
              <SafeAreaView  style={{ flex: 1, backgroundColor: '#fff' }}>




                  {/* <Toast
            visible={true}
            position={50}
            shadow={false}
            animation={false}
            textColor='black'
            hideOnPress={true}
            backgroundColor='red'
        >No Internet Connection</Toast> */}


      <Header/>

            <View style={{ alignItems: 'center' }}>

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


              <Button onClick={()=>crashlytics().close()}>Test Crash</Button>



<TouchableWithoutFeedback onPress={()=>{
  if(isSorting) setIsSorting(false)
}}>
  <View>


    
              <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <>
                    <View style={{ zIndex: 20 }}>
                      
                      <SearchBar guest={guest} />

                  {/* Ongoing order */}
                      <FlatList
                        data={allRestaurantsCategories}
                        style={{
                          marginLeft: wp('5%'),
                          // marginRight: 25
                        }}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        renderItem={({ item }) => {
                          return (
                            <RenderSlider guest={guest && guest.toString() === '1' ? true : false} data={item} />
                          )
                        }}
                      />


                      {
                      
                      (allOnGoingOrdersLoading) ? 
                      
                      <OnGoingOrdersLoading/>
                      :

                      (!allOnGoingOrdersLoading || allOnGoingOrders?.length > 1  ) ?
                          <>

                      <FlatList
                        onScroll={
                          Animated.event(
                          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                          {
                            useNativeDriver: false,
                          }
                        )}
                        data={[...allOnGoingOrders]?.sort((a, b) => a.TimeSlot.time > b.TimeSlot.time ? 1 : -1)}
                        contentContainerStyle={{
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        style={{
                          width: Dimensions.get('screen').width - 40,
                          // borderWidth: 1,
                          borderRadius: 10,
                          marginLeft: wp('4.5%'),
                          backgroundColor: 'white',
                          marginBottom: allOnGoingOrders &&      allOnGoingOrders!.length > 0 ? 10 : 0,
                          // padding: 2
                          // marginTop: 10
                        }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                          
                          let isLast = index === allOnGoingOrders?.length! - 1
                          
                          return <InHouseOrderingCard city={city!} isLast={isLast} getOnGoingOrder={getOnGoingOrder} bottomSheetRef={bottomSheetRef} setBillingOrder={setBillingOrder} item={item} setSuccessVisible={setSuccessVisible} setWarningVisible = {setWarningVisible} setContent= {setContent}  setAlertVisible={setAlertVisible}  setItem={setItem} setLocation={setLocation} handleSuccess={handleSuccess } showbill = {showbill}/>
                        }} />


                        <View
                          style={{
                            marginBottom: hp('3%'),
                            marginTop: hp('0.6%')
                          }}>
                          <ExpandingDot
                            data={allOnGoingOrders!}
                            expandingDotWidth={9}
                            scrollX={scrollX}
                            inActiveDotOpacity={1}
                            dotStyle={{
                              width: 9,
                              height: 9,
                              borderRadius: 5,
                              elevation: 10,
                              marginHorizontal: 2,
                              // borderWidth: 1,
                              shadowColor: 'black',
                              shadowOffset: { width: 20, height: 20 },
                              shadowRadius: 5,
                              shadowOpacity: 1
                            }}
                            activeDotColor='red'
                            inActiveDotColor='white'
                            containerStyle={{
                              top: 0,
                            }}
                          />
                        </View> 

                        </>

                        : 

                        allOnGoingOrders.length == 1 &&
                        (

                      <View style={{
                        borderRadius: 10,
                          marginLeft: 20,
                          backgroundColor: 'white',
                          marginBottom: allOnGoingOrders &&
                          allOnGoingOrders!.length == 1 ? 10 : 0,
                          // padding: 2
                          marginTop: 10
                      }}>
                        <InHouseOrderingCard city={city!} isLast={true} getOnGoingOrder={getOnGoingOrder} bottomSheetRef={bottomSheetRef} setBillingOrder={setBillingOrder} item={allOnGoingOrders[0]} setSuccessVisible={setSuccessVisible} setWarningVisible = {setWarningVisible} setContent= {setContent}  setAlertVisible={setAlertVisible} setItem={setItem}  setLocation={setLocation} handleSuccess={handleSuccess} showbill={showbill}/>
                        </View>
                        )

                      }
                      <View
                        style={{
                          marginLeft: wp('5%'),
                          // height: 80,
                          marginRight: wp('4%'),
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          zIndex: 20,
                          // marginBottom:20
                        }}>
                        <Text
                          style={{
                            fontSize: hp('2.8%'),
                            fontFamily: 'Poppins-SemiBold',
                            color: '#000',
                            marginBottom:hp('0.5%')
                          }}>
                          Top Restaurants
                        </Text>
                       

                        <View
                                        style={{
                                            justifyContent: 'space-between',
                                            zIndex: 20,
                                            marginBottom : hp('8%')
                                        }}> 

                                        
                              <SortBy 
                              setIsSorting={setIsSorting}
                               isSorting={isSorting} 
                               sortName={sortName} 
                               setSortName={setSortName} />


<Filters
                                      unfilteredRestaurants={allRestaurentsByCity}
                                      setRestaurants={setRestaurants}
                                      filter={filter}
                                      setFilter={setFilter}
                                      />
                        


                                        </View>

                      </View>
                    </View>



 {!allRestaurentsByCityLoading   ? 
                      // restaurants && restaurants.length ?
                    <View style={{ flex:1 }}> 
                        <FlatList
                          ListFooterComponent={ Platform.OS == 'android' ?<View style={{ height: hp('8%') }}   /> : <></> }
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item) => item!.id}

                    // estimatedItemSize={50}

                       ListEmptyComponent={<EmptyStateComponent />}
                      //  estimatedListSize={50}
                          // initialNumToRender={10}

                          data={[...restaurants].sort((a, b) => ( a.shutdown ? 1 : 0) - (b.shutdown ?1 : 0 ))}

                          renderItem={({ item, index }) => {
                            const day = getDayFromNumber(new Date().getDay());
                            let timeDiscounts: TimeDiscount[] = [];
                            let halfHour = Date.now();
                            let hour = new Date(halfHour).getHours();
                            let minute = new Date(halfHour).getMinutes();
                            const time = `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`;
                            // console.log(item.name, item.timeDiscount);
                            let noSlotsToday = false;
                            for (let timeDiscount of item!.timeDiscount) {
                              if (timeDiscount.day.toUpperCase() === day.toUpperCase() && timeDiscount.timeSlot.time > time) {
                                timeDiscounts.push(timeDiscount);
                              }
                            }
                            let j = new Date().getTime();
                            if (!timeDiscounts.length) {
                              let t1 = item!.timeDiscount;
                              noSlotsToday = true;
                              let today = new Date().getDay();
                              let nextDay = new Date();
                              const i = today;
                              today = (today + 1) % 7;
                              while (today !== i) {

                                j += 24 * 60 * 60 * 1000;
                                timeDiscounts = t1.filter(t => t.day.toUpperCase() === getDayFromNumber(today).toUpperCase());
                                if (timeDiscounts.length) {
                                  break;
                                }
                                today = (today + 1) % 7;
                              }
                              if (!timeDiscounts.length) {
                                timeDiscounts = item!.timeDiscount.filter((t) => {
                                  t.day.toUpperCase() === getDayFromNumber(i).toUpperCase();
                                })
                              }
                              if (!timeDiscounts.length) {
                                return null
                              }
                            }


                            return (
                                <RenderRestaurants
                                  nextDay={j}
                                  noSlotsToday={noSlotsToday}
                                  guest={(guest && guest.toString() === '1') ? true : false}
                                  setLoading={setAllRestaurentsByCityLoading}
                                  id={item!.id}
                                  name={item!.name}
                                  timeDiscounts={timeDiscounts}
                                  hasPickup={item!.hasPickup}
                                  address={item!.address}
                                  image={item!.mainImageUrl}
                                  images={item!.images}
                                  uploadedImages={item!.uploadedImages}
                                  // navigation={props.navigation}
                                  distance={item!.distance}
                                  longitude={item!.longitude}
                                  latitude={item!.latitude}
                                  rating={item!.rating}
                                  shutdown={item!.shutdown}
                                  aov={item!.aov}
                                  city = {city}
                                  setId = {setId}

                                />
                            );
                          }}
                          /> 
                          </View>

                        : 
                        
                        <RestaurantsLoading/>
                            }
                  </>
                }
                renderItem={() => <></>}
                data={null}
                />
      </View>



    
      
                </TouchableWithoutFeedback>

<WaitModal visible={loadingVisible}/>



          {  billingOrder &&   <BillPopup billingOrder={ billingOrder}  bottomSheetRef={bottomSheetRef} snapPoints={snapPoints}/>}


            </View>



    </SafeAreaView >
  );
};




export default HomeScreen;










import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Image from 'react-native-fast-image';
import { Order } from 'src/types/order.interfaces';
import { Feather } from '@expo/vector-icons';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import LinearGradient from 'react-native-linear-gradient';
import WaitModal from '../Common/WaitModal';
import { handleUnlock } from 'src/utils/common/handleUnlock';
import { checkUnlock } from 'src/utils/common/checkUnlock';
import calculateTimeLeft from 'src/utils/common/updateTimer';
import { useFocusEffect } from 'expo-router';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { removeUserOrders } from 'src/redux_store/reducers/restaurent.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp } from 'src/app/Login';

interface Props {
    item: Order;
    setBillingOrder: React.Dispatch<React.SetStateAction<Order | undefined>>,
    bottomSheetRef: any;
    getOnGoingOrder: any;
    city: string;
    isLast: boolean,
    setSuccessVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setWarningVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setAlertVisible : React.Dispatch<React.SetStateAction<boolean>>,
    setContent : React.Dispatch<React.SetStateAction<string>>,
    setItem : any,
    setLocation : any,
    handleSuccess : any,
    showbill:any
}

Amplify.configure(awsconfig);

const InHouseOrderingCard = ({ item, setBillingOrder, isLast   , setContent , setAlertVisible   , setItem , setLocation   , setWarningVisible , handleSuccess , showbill}: Props) => {


    const slotDate = new Date(item.date)

    const slotTime = item.TimeSlot.time;
    const [slot_hour, slot_minutes] = slotTime.split(':');


    slotDate.setHours( parseInt(slot_hour , 10), parseInt(slot_minutes , 10));

    const bookingDateTime = slotDate.toISOString();

    const now :Date = new Date( );


    const bookingTime : Date  = new Date(bookingDateTime);
    const [instantExpiry, setInstantExpiry] = useState('');
    const [imgLoading, setImgLoading] = useState(true);
    const [img, setImg] = useState<string>('');
    const [timer, setTimer] = useState((bookingTime.getTime() - 10 * 60 * 1000) - now.getTime())
    const [formattedTime , setFormattedTime] = useState('')
    const [loadingVisible, setLoadingVisible] = useState(false);


    const dispatch = useDispatch()




      
      function checkExpiry(){
        if (item.instantEat) {

            const orderTime1 = new Date(item.createTime).getTime();
            let halfHour = orderTime1 + 15 * 60 * 1000;
            if (item.status !== 'Completed' && item.status !== 'Cancelled' && halfHour > (new Date()).getTime()) {
              return false
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
              return false
            }
            }
            return true
    }
    

  
  useFocusEffect(
    React.useCallback(() => {
    const isexpiry =  checkExpiry()
    if(isexpiry){
        dispatch(removeUserOrders({id : item.id}))
        AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')
    }
    }, [])
  );











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
    

  
    

    useEffect(() => {
        const orderTime = new Date(item.createTime).getTime();
        let halfHour = orderTime + 15 * 60 * 1000;
        let ampmTime = new Date(halfHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        setInstantExpiry(ampmTime);
    }, [])



    return (
        <LinearGradient
            colors={1 ? ['#fff', '#fff', '#fff'] : ['#E6BAA3', '#E6BAA3', '#E6BAA3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
                alignItems: 'center',
                justifyContent: 'space-between',

                marginRight: isLast ? 0 : wp('2.4%'),

                // width: Dimensions.get('screen').width - 40,
                width: wp('89%'),
                elevation : 6 ,

                borderWidth: 1,
                borderColor: 'lightgrey',
                borderRadius: hp('1%'),
                marginTop : hp('2.6%')

            }}>
            <TouchableOpacity
                // disabled={item.status === 'Unlocked' ? false : (new Date().toLocaleTimeString('en-US', { hour12: false })) < (new Date(new Date(`2000-01-01T${item.TimeSlot.time}`).getTime() - 5 * 60000).toLocaleTimeString('en-US', { hour12: false }))}

                activeOpacity={1}
                style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: hp('0.6%')
                }}
            >
       
                <View style={{
                    flexDirection: 'row',
                     padding: hp('1.2%'), 
                     paddingTop: 5, alignItems: 'center', shadowColor: '#000',
                    justifyContent: 'space-around',
                    width: '100%',
                    // backgroundColor: 'red',
                    borderRadius: hp('1%'),
                    // height: 120,
                    height: hp('16%'),


                }}>
                    {
                        imgLoading ?
                            <View style={{
                                height: hp('14.5%'),
                                width: hp('14.5%'),
                                borderRadius: 7.5,
                            }}>
                                <ActivityIndicator style={{ flex: 1 }} size={hp('3.5%')} color={'#d20000'} />
                            </View>
                            :
                            <Image
                                source={{ uri: img }}
                                style={{
                                    height: hp('14.5%'),
                                    width: hp('14.5%'),
                                    borderRadius: 7.5,
                                    borderWidth: 1,
                                    borderColor: '#d20000'
                                }}
                                resizeMode="cover"
                            >
                                {
                                    item.instantEat ? (
                                        <Text style={{
                                            fontFamily: 'Poppins-SemiBold',
                                            fontSize: hp('1.7%'),
                                            color: '#d20000',
                                            position: 'absolute',
                                            bottom: 0,
                                            textAlign: 'center',
                                            width: hp('14.5%'),
                                            backgroundColor: 'white'
                                        }}>
                                            Instant Eat
                                        </Text>
                                    ) : <Text style={{
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: hp('1.7%'),
                                        color: '#d20000',
                                        position: 'absolute',
                                        bottom: 0,
                                        textAlign: 'center',
                                        width: hp('14.5%'),
                                        backgroundColor: 'white'
                                    }}>
                                        Reservation
                                    </Text>
                                }
                            </Image>
                    }

                    <View style={{ marginLeft: wp('2%'), height: hp('14.5%'), justifyContent: 'space-around' }}>
                    {/* <View style={{ marginLeft: 15, height: 110, justifyContent: 'space-around' }}> */}


                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: hp('1.8%'),
                                // marginBottom: 2,
                                color: '#000',
                                fontWeight:'400'
                            }}>
                            {item.Restaurant.name}
                        </Text>
                        {<View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 0
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: hp('1.6%'),
                                    color: '#000',
                                }}>
                                Discount Booked
                            </Text>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    marginLeft: wp('6%'),
                                    borderRadius: hp('0.7%'),
                                    borderWidth: 1,
                                    borderColor: '#d20000',
                                    paddingHorizontal: wp('2%'),
                                }}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp('1.6%'),
                                        color: '#d20000',
                                    }}>
                                    {item.discount}%
                                </Text>
                            </View>
                        </View>}

                        {
                            !item.instantEat && timer <= 0 &&
                                <Text style={{
                                    fontSize: hp('1.6%'),
                                    fontFamily: 'Poppins-Regular'
                                }}>
                                    Time Slot: <Text style={{ color: '#d20000' }}>{item.TimeSlot.time}</Text>
                                </Text>
                        }

                            {
                                        (timer > 0 ) &&
                                            <Text
                                                style={{
                                                    fontFamily: 'Poppins-Regular',
                                                    fontSize: hp('1.6%'),
                                                    // marginBottom: 5,
                                                    color: 'green',
                                                    // position:'absolute',
                                                    // top:60 , 
                                                    // width:'90%'
                                                }}>
                                                {item.instantEat ? `In Progress` : item.status === 'Unlocked' ? `Upcoming` : timer<=0 ? 'Unlock Now' :`${formattedTime}`}
                                            </Text> 
                                    }
                        {item.instantEat && (
                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                <Text style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: hp('1.6%'),
                                    color: '#000',
                                }}>
                                    Valid Till : <Text style={{ color: '#d20000' }}>{instantExpiry}</Text>
                                </Text>
                            </View>
                        )}


                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                borderRadius: 7,
                                backgroundColor: item.status === 'Unlocked' ? '#d20000' : timer<=0 ? 'green' : 'grey',
                                flexDirection: 'row',
                                marginTop: hp('0.1%'),
                                padding: item.status === 'Unlocked' ? hp('0.3%') : hp('0.3%'),
                                justifyContent: 'center',
                                width: item.status === 'Unlocked' ?wp('46%') : wp('20%'),
                                height: item.status === 'Unlocked' ? hp('4.5%') : hp('4%'),
                                alignItems:'center',
                        
                            }}
                            onPress={() =>{
                            {
                                if (item.status == 'Unlocked') {
                                    setBillingOrder(item);
                                    showbill()
                                    return;
                                }

                                if( item.instantEat || timer<=0 || checkUnlock({
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
                            }  }}
                        >
                            {
                                item.status === 'Unlocked' ?
                                    <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', textAlign: 'center', fontSize: hp('1.6%'), verticalAlign: 'bottom' , paddingLeft:wp('0.5%')}}>
                                        Pay to get {item.discount}% discount
                                    </Text> :
                                    <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', textAlign: 'center', fontSize: hp('1.6%') }}>
                                        Unlock
                                    </Text>
                            }
                            <Feather name='chevrons-right' color={'white'} size={hp('2.4%')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity >

           <WaitModal visible={loadingVisible}/>

        </LinearGradient >
    )
}

export default InHouseOrderingCard
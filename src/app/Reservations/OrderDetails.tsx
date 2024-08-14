import React, {   useContext, useEffect, useState} from 'react';
import { ActivityIndicator, Text, View, Linking, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { cancelBooking } from 'src/services/order.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import Share from 'react-native-share';
import {  CancelWarning,  } from 'src/components/Common/OrderPopup';

import WaitModal from 'src/components/Common/WaitModal';
import { LocationObject } from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderDetails } from 'src/redux_store/reducers/order.reducer';
import { RootState } from 'src/redux_store/store';
import { Avatar  , Icon, Button, ListItem } from '@rneui/base';
import { hp, mixpanel, wp } from '../Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeUserOrders } from 'src/redux_store/reducers/restaurent.reducer';
import crashlytics from '@react-native-firebase/crashlytics';

Amplify.configure(awsconfig);



const OrderDetails = () => {

    
  
  
  
  const [loading, setLoading] = useState(false);
 const [cancelLoading, setCancelLoading] = useState(false);
 const [cancelled, setCancelled] = useState(false);
 const [img, setImg] = useState('');
 const [imgLoading, setImgLoading] = useState(true);
 const [cancelVisible, setCancelVisible] = useState(false);
 const [status, setStatus] = useState('');
 
 

 const dispatch = useDispatch()

 const data = useSelector((state:RootState) => state.order.orderDetails)
 
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



function formatDate(fullDateString : string) {
  // Create a Date object from the full date string
  const date = new Date(fullDateString);

  // Get day, month, and year components
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits with leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and ensure two digits
  const year = date.getFullYear();

  // Format the date into 'dd/mm/yyyy' format
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}


 
 
 useEffect(() => {
     const fetchData = async () => {
      mixpanel.track('opened Order Details' , data)
      crashlytics().log('TermsAndConditions mounted.');

      try {
        setLoading(true);

        switch (data?.status) {
          case 'Cancelled':
            setStatus('Reservation Cancelled')
            break;
          case 'Completed':
            setStatus('Reservation Completed')
            break;
          case 'Unlocked':
            setStatus('Waiting For Payment')
            break;
          case 'Confirmed':
            setStatus('Awaiting Unlock')
            break;
          default:
            setStatus('Reservation Expired')
            break;
        }

        if (data?.Restaurant.mainImageUrl) {
          setImg(data.Restaurant.mainImageUrl);
          setImgLoading(false);
        setLoading(false);
          return;
        }
        
        const url = `https://d3eiw2rs38fo3w.cloudfront.net/public/${data?.Restaurant.uploadedImages[0]}`;
        setImg(url.toString());
        setImgLoading(false);
        setLoading(false)
    } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
}, []);




const listItems = [
    { icon: 'book', title: 'Booking Status', value:status  , icon_type:'fontawesome' , color : '#ff6a00' },
    { icon: 'key', title: 'Booking Code', value: data?.bookingCode  , icon_type:'entypo' , color : '#49c0b6' },
    { icon: 'user', title: 'Booked By', value:data?.tableSize   , icon_type:'entypo' , color : '#0091cd' },

    { icon: 'time-slot', title: data.instantEat ? 'Booking Time' : 'Reservation Slot', value:data.instantEat ? data?.TimeSlot.time: addThirtyMinutes(data?.TimeSlot.time) , icon_type:'entypo' ,color : '#0091cd' },

    { icon: 'local-offer', title: 'Discount Availed', value: data?.discount + '% off' ,icon_type:'material' ,color : '#0dd3ff' },
    { icon: 'calendar', title: 'Booking Date', value: formatDate(data?.date.split('T')[0]) , icon_type:'font-awesome' ,color : '#a4c639' }
  ];





async function handleShare() {
    
    const msg =  `Your friend has made a reservation with RENO and wants to share with you!
        \nBELOW ARE THE DETAILS OF YOUR BOOKING:-
        \nRestaurant Name: ${ data?.Restaurant.name}
        \nBooking Code: ${ data?.bookingCode}
        \nAddress: ${ data?.Restaurant.address}
        \nName: ${ data?.bookingName}
        \nDate: ${ data?.date.split('T')[0].split('-')[2]}-${ data?.date.split('T')[0].split('-')[1]}-${ data?.date.split('T')[0].split('-')[0]}
        \nTime: ${((new Date(`2000-01-01T${ data!.TimeSlot.time}`)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))}
        \nDiscount: ${ data?.discount}\n`

       const url = `https://www.google.co.in/maps/dir//${ data?.Restaurant.latitude},${ data?.Restaurant.longitude}`

         await Share.open({
            title: 'Your friend has made a reservation with RENO and wants to share with you!',
            message: msg,
            url: url
        });
    }

   


         const afterCancel = async () => {

            if (cancelLoading || cancelled || !data) return;
          await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')

            dispatch(removeUserOrders( {id  : data.id}))

            setCancelVisible(true)
            mixpanel.track('cancel booking' , data)


            setCancelLoading(true);
            await cancelBooking(data?.id);
            dispatch(setOrderDetails({...data , status : 'Cancelled'}))
            setCancelLoading(false);
            setCancelled(true);
            setCancelVisible(false)
            setStatus('Cancelled')
      }


      



      const handleCancelOrder = () => {
        if (cancelLoading || cancelled) return;
        setCancelVisible(true);
      };

    
    
      const openGoogleMaps = () => {

        const url =`https://www.google.co.in/maps/dir//${ data?.Restaurant.latitude},${ data?.Restaurant.longitude}`
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
            }
          })
          .catch((err) => console.error(err));
      };





  const handleContact  = () =>  Linking.openURL(`tel://+91${data?.Restaurant.phone[0]}`)




        return (

             loading ? <ActivityIndicator color={'#d20000'} size={hp('5%')} style={{ flex: 1 }} /> :


             <SafeAreaView style={{ flex: 1 , paddingHorizontal:wp('3%'), backgroundColor: '#F8F8F8'}}>
             

                        
                <ScrollView   scrollEnabled={true}    >

                        <TouchableOpacity style={{ height: hp('6%'),paddingLeft : wp('2%') ,  borderBottomWidth: 0.5, borderBottomColor: '#000', alignItems: 'flex-start' , paddingTop:hp('1%') }} >

                          <Icon name='arrow-back-outline' type='ionicon' size={hp('3.5%')}  color={'#000'} onPress={()=>{
                            dispatch(setOrderDetails(null))
                            router.push('/drawer/(tabs)/reservation')
                            }} />

                            {/* <Text style={{textAlign:'center'}}>Order Details</Text> */}


                        </TouchableOpacity>


                     <View style={styles.container}>


      {/* Top Section */}
      <View style={styles.topSection}>

        {/* Restaurant Avatar */}
        <View style={styles.avatarContainer}>

{imgLoading ? <ActivityIndicator size="small" color="#0000ff" /> 
:
          <Avatar
            rounded
            size="medium"
            source={{ uri: img }}
            
          />
        }


          <Text style={styles.restaurantName}>{data?.Restaurant.name}</Text>
        </View>


        {/* Map Direction Icon */}

        <Button
          icon={{
            // size: 20,
            color: '#000',
            name:'assistant-direction',
            type:'material',
            
          }}
          title="Direction"
          buttonStyle={{ backgroundColor: 'white' ,  borderRadius:5 ,borderColor:'#000'}}
          titleStyle={{ color: '#000' , fontSize:hp('1.5%')}} 
          onPress={openGoogleMaps}
          size='sm'
          type='outline'
          
        />
      
      </View>





      {/* Buttons Row */}
      <View style={styles.buttonsRow}>




        {/* Contact Restaurant Button */}
        <Button
          icon={{
            name: 'phone',
            type: 'material',
            size: hp('2.4%'),
            color: 'white',
          }}
          title="Contact Restaurant"
          onPress={handleContact}
          buttonStyle={{ backgroundColor: 'black' , borderRadius:10  , width: wp('56%')}}
          titleStyle={{ color: 'white' , fontSize:hp('1.8%')}} 
        />




        {/* Share Button */}
        <Button
          icon={{
            name: 'share',
            type: 'material',
            size: hp('2.4%'),
            color: 'white',
          }}
          title="Share"
          onPress={ handleShare}
          buttonStyle={{ backgroundColor: 'black' ,  borderRadius:10  ,width: wp('27%') }}
          titleStyle={{ color: 'white' , fontSize:hp('1.8%')}} 
        />
      </View>






      {/* List Items */}
      {listItems.map((item, index) => (
        <>
        <ListItem key={index} bottomDivider>
          <Icon name={item.icon} type={item.icon_type} color={item.color}/>

          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            {item.icon == 'user' &&<ListItem.Subtitle style={{fontWeight:'300' , color:'grey'}} >{data?.bookingName}</ListItem.Subtitle>
            }
          </ListItem.Content>
            <ListItem.Subtitle style={{fontWeight: 'bold'}} >{  item.value}</ListItem.Subtitle>
        </ListItem>

  {( item.icon=='key' && data?.status == 'Completed' ) && 
          
<ListItem key={index} bottomDivider>

  <Icon name={'account-cash'} type={'material-community'} color={'2baf2b'}/>
  <ListItem.Content>
  <ListItem.Title>Paid Amount</ListItem.Title>
</ListItem.Content>
<ListItem.Subtitle style={{  alignItems:'center' ,justifyContent:'center'}} > 

<View style={{flexDirection:'row' , alignItems:'center' , justifyContent:'center'}}>
<Icon name='rupee' size={hp('1.6%')} type='font-awesome' style={{marginRight:wp('1%')}}/>
 <Text style={{fontWeight:'bold'}}>{data.amount}</Text>
 </View>
</ListItem.Subtitle>
</ListItem>

}

</>
      ))}


        {/* Terms and Conditions Section */}
        <View style={[styles.termsContainer, { maxHeight: hp('18%'), marginBottom: hp('3%'), paddingBottom: hp('1.1%'), marginTop: hp('1.1%'), paddingVertical:hp('0.6%') }]}>
      <Text style={styles.termsTitle}>Terms and Conditions</Text>

      <View style={styles.termsList}>
          <Text style={{color:'black' , fontSize:hp('1.8%') }}>{data?.Restaurant.conditions}</Text>
        </View>
    </View>

      
      {/* Cancel Reservation Button */}




    </View>

    </ScrollView>








                {/* </ScrollView> */}
      {(data?.status == 'Confirmed' && cancelled == false) &&  
<Button
  title="Cancel Reservation"
  buttonStyle={styles.cancelButton}
  onPress={handleCancelOrder}
  
/>
}

<WaitModal visible={cancelLoading} />


                      

 



  <CancelWarning 
  visible = { cancelVisible}
  setVisible={(data : boolean) =>   setCancelVisible(data)}
  handleCanel={ afterCancel}
  />
                </SafeAreaView>

        );
    }

// const mapStateToProps = ({ reservations }: { reservations: any }) => ({ reservations });

export default OrderDetails;



const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: hp('1.1%'),
        },
        topSection: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: hp('1.1%'),
        },
        avatarContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        restaurantName: {
          marginLeft: wp('3%'),
          fontSize: hp('2.2%'),
          fontWeight: '600',
        },
        buttonsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: wp('9%'),
          marginTop:4
        },
        largebutton : {backgroundColor : '#000' , borderRadius:10 , width : '40%'} ,
        termsContainer: {
            marginTop: hp('2.4%'),
            marginBottom:hp('1.1%')
          },
          termsTitle: {
            fontSize: hp('2.1%'),
            fontWeight: 'bold',
            marginBottom: hp('1.1%'),
          },
          termsList: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding:  hp('1.5%'),
          },
          cancelButton: {

            position: 'relative',
            bottom: 0,
            width: wp('95%'), // Make button full width
            backgroundColor: '#d20000', // Example background color
            borderStartRadius: hp('1.1%'), // Example border radius
            alignItems: 'center', // Center the content horizontally
            marginHorizontal:'auto',
            justifyContent:'center',
            alignContent:'center',
            paddingTop:hp('1.1%'),
            marginLeft:'auto',
            marginRight:'auto',
      
          },
      });
      



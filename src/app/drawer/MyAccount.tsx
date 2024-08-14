import React, { useState, useEffect } from 'react';
import { View, Animated   , FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, Avatar,Text ,BottomSheet, Icon } from '@rneui/base';
import Image from 'react-native-fast-image';
import { width } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import moment from 'moment';
import { router } from 'expo-router';
import { getProfile } from 'src/services/auth.service';
import { ProfileData } from 'src/types/interfaces';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, mixpanel, wp } from 'src/app/Login';
import TransactionHistory from 'src/components/MyAccount/TransactionHistory';
import { Order } from 'src/types/order.interfaces';
import { getUserOrders } from 'src/services/order.service';
import moment from 'moment';
import NoInternetScreen from 'src/components/Common/NoInternet';
import crashlytics from '@react-native-firebase/crashlytics';

const MyAccount = () => {

    
    const [city, setCity] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [bookings, setBookings] = useState<Order[]>([]);

    
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
  const [isConnected, setConnected] = useState<boolean >(true);



    useEffect(() => {
        mixpanel.track('opened MyAccount');
    crashlytics().log('MyAccount mounted.');




        const fetchData = async () => {
            try {


                const storedCity = await AsyncStorage.getItem('city');
                // const username = await AsyncStorage.getItem('profileImg');
                // const prifileImg = await AsyncStorage.getItem('userName');
                // const contact = await AsyncStorage.getItem('contact');

                // if(storedCity && username && prifileImg && contact) {

               

                // }
                // console.log('sssss' , username)
                setCity(storedCity);

                const { data: { user: fetchedProfileData } } = await getProfile();

                // console.log('fetchedProfileData' , fetchedProfileData.Bookings.length)

                setProfileData(fetchedProfileData);

                const { data: { orders } } = await getUserOrders();

                setConnected(true)

                const completedBookings = orders.filter((order : Order) => order.status === 'Completed');
                // const completedBookings =  fetchedProfileData.Bookings.filter((order : Order) => order.status === 'Completed');
                setBookings(completedBookings.reverse());


                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);

                
                if(isConnected)
                    setConnected(false)
            
            
                  setTimeout(async()=>{
                    await fetchData()
                  },1000)
            }
        };

        fetchData();
    }, []);

    const getTotalSavings = () => {
        let amount = 0;+
        bookings.forEach((booking) => {
            if (booking.status === "Completed") {
                amount += (booking.amount! * booking.discount) / 100;
            }
        });
        return amount;
    };

   
  
  const renderBottomSheetContent = () => {

    const newTime = selectedOrder?.TimeSlot.time + ' - '+ moment(selectedOrder?.TimeSlot.time, 'HH:mm').add(30, 'minutes').format('HH:mm');
    const dateofpayment = moment(selectedOrder?.paymentTime).format('DD MMM YYYY');
    const timeofpayment = moment(selectedOrder?.paymentTime).format('HH:mm:ss');



    const listItems = [
      { icon: 'book', title: 'Booking Type', value: selectedOrder?.instantEat ? 'Instant Eat' : 'Reservation'  , icon_type:'fontawesome' , color : '#ff6a00' },
      { icon: 'local-offer', title: 'Discount Availed', value: selectedOrder?.discount + '% off' ,icon_type:'material' ,color : '#0dd3ff' },

      { icon: 'money', title: 'Total Amount', value: `₹ ${selectedOrder?.amount + selectedOrder?.amount *( selectedOrder?.discount / 100)  }`  , icon_type:'fontawesome' , color : 'green' },
      { icon: 'money', title: 'Paid ', value: `₹ ${selectedOrder?.amount}`  , icon_type:'fontawesome' , color : 'green' },

      { icon: 'calendar', title: 'Payment Date', value: dateofpayment  ,icon_type:'ionicon' ,color : '#a4c639' },
      { icon: 'time', title: 'Payment Time', value: timeofpayment  ,icon_type:'ionicon' ,color : '#ff23aa' },
      { icon: 'key', title: 'Booking Code', value: selectedOrder?.bookingCode  , icon_type:'entypo' , color : '#49c0b6' },
      { icon: 'user', title: 'Table Size', value:selectedOrder?.tableSize + ' People'  , icon_type:'entypo' , color : '#0091cd' },
      { icon: 'time-slot', title: 'Reservation Slot', value: newTime, icon_type:'entypo' ,color : '#0091cd' },
    ];
  
  

    return (
    <View style={styles.bottomSheetContent}>

        <View style={styles.header}>
            <Text style={styles.bottomSheetHeader}>Transaction Details</Text>
            <Icon
            name='circle-with-cross'
            type='entypo'
            color='grey'
            onPress={() => setBottomSheetVisible(false)}
            containerStyle={styles.closeIcon}
            />
        </View>

      {listItems.map((item , index) => (

        <ListItem key={index.toString()} bottomDivider>
          <Icon name={item.icon} type={item.icon_type} color={item.color}/>

          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
            <ListItem.Subtitle style={{fontWeight: 'bold'}} >{  item.value}</ListItem.Subtitle>
        </ListItem>
    )
  )}
  </View>
    )}

    
  if(!isConnected) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
  <View
                        style={{
                            width,
                            height: hp('6%'),
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <Ionicons
                            name="arrow-back"
                            onPress={() => router.back()}
                            color="#000"
                            size={hp('3.5%')}
                            style={{ marginLeft: wp('4%') }}
                        />
                        <Text
                            style={{
                                marginLeft:  wp('2%') ,
                                fontFamily: 'Poppins-Medium',
                                color: '#000',
                                fontSize:  hp('2.5%') ,
                            }}>
                            My Account
                        </Text>
                    </View>
  <NoInternetScreen/>
  </SafeAreaView>
)
  



    return (
        loading ? <ActivityIndicator style={{ flex: 1 }} size={40} color='#d20000' /> :
            <SafeAreaView style={{ flex: 1  }}>
                <View style={{ flex: 1  }}>
                    <View
                        style={{
                            width,
                            height: hp('6%'),
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <Ionicons
                            name="arrow-back"
                            onPress={() => router.back()}
                            color="#000"
                            size={hp('3.5%')}
                            style={{ marginLeft: wp('4%') }}
                        />
                        <Text
                            style={{
                                marginLeft:  wp('2%') ,
                                fontFamily: 'Poppins-Medium',
                                color: '#000',
                                fontSize:  hp('2.5%') ,
                            }}>
                            My Account
                        </Text>
                    </View>



                    <View style={{ flex: 1  , paddingHorizontal:wp('1%')}}>



                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    // height: 80,
                                    width: wp('30%'),
                                    
                                    // borderRadius: 96 / 2,
                                    // shadowColor: '#0000001A',
                                    // shadowOffset: { height: 8, width: 0 },
                                    // elevation: 5,
                                    // shadowOpacity: 1,
                                    // shadowRadius: 7,
                                    marginHorizontal:wp('2%'),
                                    marginRight:wp('2%')

                                    // marginLeft:20
                                }}
                            >
                                {
                                    profileData?.profileImage.length  ? 
                                    <Avatar
                                        source={  {uri:  profileData?.profileImage} }
                                       
                                        containerStyle={{
                                            height:hp('11%'),
                                            width: hp('11%'),
                                            borderRadius: hp('11%')/ 2,
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                    marginLeft:wp('2%')

                                        }}
                                        // resizeMode="cover"
                                    />
                                    :
                                    <Icon name='user-circle' size={hp('11%')} type='font-awesome'/>
                                    
                                }

                            </View>


                            <View style={{width:wp('70%') , paddingHorizontal:wp('2%')}}>


                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Medium',
                                        fontSize: hp('3.5%'),
                                        color: '#777777',
                                    }}
                                >
                                    {`${profileData?.firstname} ${profileData?.lastname}`}
                                </Text>

                                {city && (

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: hp('0.6%'),
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialIcons name="location-on" size={hp('2.2%')} color="#777777" />
                                    <Text
                                        style={{
                                            color: '#777777',
                                            fontSize: hp('2%'),
                                            marginLeft: wp('1.2%'),
                                            fontFamily: 'Poppins-Regular',
                                        }}
                                    >
                                        {city}
                                    </Text>
                                </View>
                                )}


                                {profileData?.contact && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MaterialIcons name="phone" size={hp('2.2%')} color="#777777" />
                                        <Text
                                            style={{
                                                color: '#777777',
                                                fontSize: hp('2%'),
                                            marginLeft: wp('1.2%'),
                                                fontFamily: 'Poppins-Regular',
                                            }}
                                        >
                                            {`+91 ${profileData?.contact}`}
                                        </Text>
                                    </View>
                                )}
                                {profileData?.email && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        // alignItems: 'flex-start',
                                        // marginTop:5
                                    }}
                                >
                                    <MaterialIcons name="mail" size={hp('2.2%')} color="#777777" style={{marginTop:5}}/>
                                    <Text
                                        style={{
                                            color: '#777777',
                                            fontSize: hp('1.8%'),
                                            marginLeft: wp('1.2%'),
                                            marginRight:wp('3%'),
                                            fontFamily: 'Poppins-Regular',
                                        }}
                                    >
                                        {profileData?.email}
                                    </Text>
                                    
                                </View>
                                )}


                            </View>
                        </View>

                        <View
                            style={{
                                width: wp('90%'),
                                backgroundColor: '#fff',
                                shadowColor: '#0000004D',
                                shadowOpacity: 1,
                                shadowOffset: { width: 6, height: 6 },
                                shadowRadius: 10,
                                flexDirection: 'row',
                                marginTop: hp('4%'),
                                elevation: 5,
                                alignSelf: 'center',
                                borderRadius: hp('1%'),
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Image
                                source={require('src/assets/savings.png')}
                                style={{
                                    height: hp('15%'),
                                    width:  hp('16%'),
                                    marginTop:  hp('2.5%'),
                                    marginBottom: hp('2.5%'),
                                }}
                                resizeMode="cover"
                            />




{/* 
{
    bookings.length >0 &&
<> */}
                            <View
                                style={{
                                    marginTop: hp('3%'),
                                    marginBottom: hp('2.5%'),
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}
                            >

                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-Medium',
                                                fontSize: hp('2.3%'),
                                                color: '#d20000',
                                            }}
                                        >
                                            My Savings
                                        </Text>
                                        <Text style={{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: hp('2%'),
                                        }}>
                                            ₹{getTotalSavings()}
                                        </Text>
                                    </View>
                                </View>


{bookings.length > 0 &&
                        <TransactionHistory data = {bookings} setSelectedOrder={setSelectedOrder} setBottomSheetVisible={setBottomSheetVisible} />
}

                        </View>


                    </View>



                    <BottomSheet
                    isVisible={bottomSheetVisible}
                    onBackdropPress={() => setBottomSheetVisible(false)}
                    children={renderBottomSheetContent()}
                    modalProps={{
                    animationType:'slide'
                    }
                    
                    }
                />


                </SafeAreaView>
        );
    }


// class Header extends Component {
//     render() {
//         return (
//             <View
//                 style={{
//                     width,
//                     justifyContent: 'flex-end',
//                     top: 0,
//                 }}
//             >
//                 <Ionicons
//                     name="arrow-back"
//                     onPress={() => router.back()}
//                     color="black"
//                     size={35}
//                     style={{ marginLeft: 15, marginBottom: 10 }}
//                 />
//             </View>
//         );
//     }
// }

// const mapStateToProps = ({ auth }: { auth: MyAccountProps['auth'] }) => ({ auth });

export default MyAccount;

const styles = StyleSheet.create({
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContainer: {
      /* Define styles for the header container */
    },
  
    bottomSheetContent: {
      paddingHorizontal: wp('4%'),
      backgroundColor: 'white',
      paddingTop:hp('2.5%')
    },
    bottomSheetHeader: {
      fontSize: hp('2.4%'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: hp('1%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
     
      closeIcon: {
        position: 'absolute',
        top: hp('0.3%'),
        right: wp('2.2%'),
      },
  })
import React, { useRef } from 'react';
import { View, Animated   , FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, Avatar,Text ,BottomSheet, Icon } from '@rneui/base';
import { Order } from 'src/types/order.interfaces';
import moment from 'moment';
import { hp, wp } from 'src/app/Login';

const TransactionHistory = ({ data  , setBottomSheetVisible  , setSelectedOrder} : {data:Order[] , setBottomSheetVisible:any ,setSelectedOrder:any }) => {



  const scrollY = useRef(new Animated.Value(0)).current;

 




  const renderItem = ({ item } :{item:Order}) => {

    if(!item.amount) return

    const formattedDate = moment(item.paymentTime).format('DD MMMM [at] HH:mm:ss');
    const saving =  item.amount * (item.discount/100) 
    const bill = item.amount + saving
    // finalAmount :parseInt(amount) - (parseInt(amount) * (billingOrder!.discount / 100)) + convenienceFee,
    // saving : (parseInt(amount) * (billingOrder!.discount / 100)),

    return (

    item.Restaurant &&

    <TouchableOpacity onPress={() => {
      setSelectedOrder({...item , saving , bill});
      setBottomSheetVisible(true);
    }}
    >
    <ListItem bottomDivider  
    >
      

      <View style={styles.avatarContainer}>
          <Avatar
            rounded
            size="medium"
            source={{ uri: item.Restaurant.mainImageUrl }}
          />
        </View>


      <ListItem.Content>
        <ListItem.Title style={{fontWeight:'600' , fontFamily:'Popping-Medium'}}>{item.Restaurant.name}</ListItem.Title>


        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}> */}

        {/* <ListItem.Subtitle style={{ color: item.status ? 'green' : 'red'   , marginRight:5}}>{item.status ? 'Success' : 'Failure'}</ListItem.Subtitle>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#000', marginRight: 5 }} />
          <ListItem.Subtitle style={{ color: '#808080' }}>UPI</ListItem.Subtitle>
          </View> */}

        <ListItem.Subtitle style={{ color: '#808080' }}>Booking ID { item.bookingCode}</ListItem.Subtitle>


          <ListItem.Subtitle style={{ fontSize: hp('1.6%'), color: '#808080' }}>{formattedDate}</ListItem.Subtitle>
        {/* <ListItem.Subtitle style={{ fontSize: 12, color: '#808080' }}>{item.Restaurant.address}</ListItem.Subtitle> */}

      </ListItem.Content>


      <View style={{alignItems:'center'}}>
        {/* <ListItem.Subtitle > Bill : ₹ {bill}</ListItem.Subtitle> */}
        {/* <ListItem.Subtitle>Paid  : ₹ {item.amount}</ListItem.Subtitle> */}
        <ListItem.Subtitle style={{color:'green' , fontFamily:'Poppings-Medium'}}>  - ₹{saving}</ListItem.Subtitle>
      </View>

    </ListItem>
    </TouchableOpacity>
  )}


  return (
<>
    <View style = {{marginTop:hp('1%') , marginLeft:wp('2%') , marginBottom:5   }}>
    <Text style={{fontWeight:'600' , fontSize:20 , fontFamily:'Poppins-Medium' }}> Savings </Text>
    </View>



    <FlatList
      data={data}
      showsVerticalScrollIndicator ={false}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={{ marginTop: hp('1.1%'), paddingHorizontal: wp('3.4%') }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      scrollEventThrottle={16}
      // contentContainerStyle={{ borderTopLeftRadius:20 , borderWidth:1  , borderTopRightRadius:20 , borderColor:'white' }}
      // ListHeaderComponent={ ()=>{
      //   return (
      
      //   )
      // }}
    />
    </>
  );
};



export default TransactionHistory;

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },


})
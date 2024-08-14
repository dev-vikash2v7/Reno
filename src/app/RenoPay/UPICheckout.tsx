import React, {  useEffect, useState } from 'react';
import { View, Text  , StyleSheet  , Image, TouchableOpacity, SafeAreaView} from 'react-native';
import { router } from 'expo-router';
import Header from 'src/components/Common/Header';
import {   IconButton } from 'react-native-paper';
import images from 'src/constants/images';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import crashlytics from '@react-native-firebase/crashlytics';



export default function UpiScreen() {

 
  const {    orderDetails} = useSelector((state : RootState)  => state.order) || {} ;


  useEffect(() => {
    crashlytics().log('UpiScreen mounted.');
  }, [])

  const handlePayment = (method : string ) => {

    router.push({   pathname: '/RenoPay/PaymentStatus', params : {method} })
    
    
};
        
   

const List = ({title , left , right ,onPress} : {title :any, left:any , right :any,onPress:any}) =>{
  return (
    <TouchableOpacity style={styles.upi} onPress={onPress} >
        <View style={styles.left}>
          {left()}
          <Text style={{fontWeight : '400' , fontSize : 14}}>{title}</Text> 
        </View>

        {right()}
    </TouchableOpacity>
  )
}


 
  
  
  return (

<SafeAreaView style ={{ paddingTop:20}}>
    <Header text='Checkout' textStyle={{textAlign : 'center'  }}  style={{   alignItems:'center', paddingTop:20}} onBack = {()=>router.back()}/>

    <View style={{flex:1 , backgroundColor:'white'}}>



    <View style={{alignItems:'center' , justifyContent:'center', flexDirection:'column' , backgroundColor:'lightblue' , height:200}}>
      <Text style={{fontSize:15 , fontWeight:'500' , color:'#000' , fontFamily: 'Ubuntu-Bold',}}>You're Paying</Text>
      <Text style={{fontSize:40 , fontWeight:'bold' , color:'#000' , fontFamily: 'Ubuntu-Bold',}}>₹ {orderDetails.amount}</Text>
    </View>

 

    <Text style = {{marginTop:15 , fontWeight:'600' , fontSize:15 , color:'green' , marginLeft:20}}>Select your prefferred UPI app</Text>



    <View style={styles.upi_container}>
      <List
        title="PhonePe"
        left={() => <Image source={images.phonepe} style={styles.logo}/>}
        right={() => <IconButton icon="arrow-right" />}
        onPress={() => handlePayment('phonepe' )} 
      />
      <List
        title="Google Pay"
        left={() =>  <Image source={images.gpay} style={styles.logo}/>}
        right={() => <IconButton icon="arrow-right"  />}
        onPress={() => handlePayment('gpay' )} 

      />

      <List
        title="Paytm"
        left={() => <Image source={images.paytm} style={styles.logo}/>}
        right={() => <IconButton icon="arrow-right" />}
        onPress={() => handlePayment('paytm' )} 
      />

    </View>

    </View>
</SafeAreaView>
  )

}



  const styles = StyleSheet.create({
    upi_container: {
      flex: 1,
      padding: 20,
    },
    generateQRButton: {
      marginTop: 20,
    },
    upiAddressInput: {
      marginTop: 20,
    },
    logo : {
      width : 30 ,
      height : 30 ,
      marginLeft : 20,
      marginRight : 10
      
      
    },
    upi:{
      alignItems:'center',
      flexDirection:'row',
      width:'100%',
      justifyContent:"space-between",
      borderRadius : 5 ,
      // borderWidth : 0.4 ,
      borderColor : '#000',
      marginBottom : 10,
      // elevation : 0.1,
      height : 60 
    },  
    left : {
      alignItems:'center',
      flexDirection:'row',
    }
  });
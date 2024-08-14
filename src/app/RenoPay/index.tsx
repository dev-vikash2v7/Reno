import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity  } from 'react-native';
import { Button, Text, Title, Paragraph, Icon  } from 'react-native-paper';
import {  router } from 'expo-router';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import { height ,width} from 'src/constants';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import { completeOrder } from 'src/services/order.service';
import crashlytics from '@react-native-firebase/crashlytics';



function ValueBox({label , value , islast , color} : {label :string, value : number , islast ?: boolean , color ?:string} ){
  return (
    <View style = {[styles.valueBox , islast && {borderBottomWidth:0} ] }>
      <Text style={{color:'#000'}}>{label}</Text>
      <Text style = { [ {color:'#000'} , islast && {color }]}>{color && '- '}₹{value.toLocaleString()}</Text>
    </View>
  )
}

export default function RenoPay() {

  
  const { orderDetails , merchantDetails} =  useSelector((state : RootState)  => state.order)  ;


  const handlePayment = () => {
      router.push('/RenoPay/UPICheckout')
  }

  useEffect(() => {
    crashlytics().log('Renopay index mounted.');

}, [])


  return (
    <View style={{flex:1 , backgroundColor:'#edebe8'}}>


<View  style={styles.upperView}>

    <View style={styles.header}>

<TouchableOpacity style = {{marginTop : 20  }} onPress={()=>router.back()}>
      <Icon source={'arrow-left'} size={22} color='white' />
</TouchableOpacity>


      <View style={{ marginLeft : 10}}>
        <Text style={styles.title}>{orderDetails?.Restaurant.name}</Text>
        <Paragraph style={styles.subtitle}> {merchantDetails.city}</Paragraph>
      </View>
    </View>
    
    <View style={styles.listBox}>
      
    <Text style={{color:'white' , fontWeight:'700' , fontSize:24}}>You Pay</Text>
    <Text style={{color:'rgba(255,255,255,0.8)' , fontWeight:'400' , fontSize:30 , textDecorationLine:'line-through' , marginTop : 3}}>₹{orderDetails.billAmount.toLocaleString()}</Text>
    <Text style={{color:'#fff' , fontWeight:'700' , fontSize:50 , marginTop : 3 , marginBottom : 10}}>₹ {''}{  orderDetails.billAmount - orderDetails.saving}</Text>
       

{/* <View style={styles.savingsScreen}>
  <View style={{}}></View>
    <View style={styles.blackbar}>
      <Text style={{color:'green' , fontWeight:'100' , fontSize:18 , marginTop : 5}}>Woah! you're saving ₹{  saving}</Text>
    </View>
</View> */}

<View style={{flexDirection:'row' ,width : width * 0.95 , justifyContent:'center' , alignItems:'center' }}>

      <View style={{position:'relative' ,left: 15,zIndex:99 }}>
      <View style={styles.circle} >
      <FontAwesome name="thumbs-up" size={30} color="white" />
      </View>
      </View>

<View style={[styles.blackbar ]}>
      <Text style={styles.message}>Woah! you are saving ₹{orderDetails.saving} </Text>
    </View>

  </View>
      
    </View>
    </View>



<View  style={styles.lowerView}>

<Text style = {{marginVertical:10 , fontSize : 18 , fontWeight :'bold' , marginLeft  : 5 , color:'#000'}}>Bill Details</Text>


<View style={{width : width * 0.9 , justifyContent:'center' , alignSelf:'center' , marginBottom : 20  , borderRadius : 20  , backgroundColor : 'white' , paddingHorizontal : 20}}>

      <ValueBox
        label="Total Bill"
        value={ orderDetails.billAmount}
      />

      <ValueBox
        label={ orderDetails.discount + "% Regular Discount"}
        value={orderDetails.saving}
        color ='green'
      />
     
      <ValueBox
        label="Convenience Fee"
        value={orderDetails.convenienceFee}
        islast={true}
        />
    </View>

      <Button
        // mode="contained"
        style={styles.button}
        onPress={ handlePayment}
        textColor='white'
        
      >
        Proceed to Pay ₹{orderDetails?.amount.toLocaleString()}
      </Button>
      
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  valueBox  : {
display:'flex',
height : 60 ,
borderBottomWidth : 0.2 , 
borderBottomColor : 'grey',
flexDirection : 'row' , 
justifyContent : 'space-between',
alignItems:'center',
paddingHorizontal : 5
  },
  upperView: {
    top: 0,
    backgroundColor:'#d20000',
    width : width,
    height : height * 0.43,
    paddingBottom:20
  },
  title: {
    marginTop: 30,
    fontSize : 20,
    color:'white',
    fontWeight:'600',
    fontFamily:'PoppingFont',
  },
  subtitle: {
    fontSize : 15,
    color:'white',
    fontWeight:'300',
    fontFamily:'PoppingFont',

  },
  
  button: {
    margin: 10,
    height : 60,
    borderRadius:5,
    backgroundColor:'#d20000',
    fontWeight:'600',
    color:'white',
    fontSize:24,
    width : width * 0.9,
    // marginHorizontal:'auto',
    alignSelf:'center',
    justifyContent:'center',
  
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
  lowerView : {
    marginTop : 30,
    paddingHorizontal : 20

  },
  header : {
    padding:10,
    flexDirection : 'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  listBox:{
    alignItems:'center'
  },
  savingsScreen:  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e9f7e6',
    flexDirection:'row',
    borderRadius:15,
    marginTop:18,
    paddingHorizontal:28

  },
    circle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'green',
      justifyContent: 'center',
      alignItems: 'center',
    },

  blackbar:{
    flex: 1,
    backgroundColor:'#000' ,
    borderRadius : 30 , 
    height : 50 ,
    justifyContent:'center',
    alignItems:'center',
    position:'relative' ,right: 16,zIndex:-1
  },

  message: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'white',
    fontFamily:'Poppong-Regular',
    paddingLeft:10

  },
});

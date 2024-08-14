
import { router } from 'expo-router';
import React, { ForwardedRef, useEffect, useMemo, useState } from 'react';
import {  setOrderDetails } from 'src/redux_store/reducers/order.reducer';
import { useDispatch } from 'react-redux';
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import homeStyle from 'src/styling/home.style';
import { height, width } from 'src/constants';
import { Input } from '@rneui/themed';
import BottomSheet , {BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Order } from 'src/types/order.interfaces';
import { getConveniencePercentage } from 'src/services/user.service';


const BillPopup = ({
    billingOrder , 
    bottomSheetRef ,
    snapPoints
} : {
  billingOrder : Order, 
  bottomSheetRef : any,
  snapPoints : any
} ) =>{


  const [amount, setAmount] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);

  const [isShowing, setIsShowing] = useState<boolean>();

 const  handleClosePress =  ()=> bottomSheetRef.current?.close()
 const handleOnFocus= ()=> bottomSheetRef.current?.snapToPosition(height * 0.799999)
  


 useEffect(() => {
  const backAction = () => {
      if (isShowing) {
          bottomSheetRef?.current?.close()
      } else {
          router.back();
      }
      return true;
  };

  BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
  );

  return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
}, [bottomSheetRef, isShowing]);



 const renderBackdrop = (props : any) => (
  <BottomSheetBackdrop
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    style={{ backgroundColor: "black" }}
    pressBehavior={'close'}
    {...props}
  />
);





  useEffect(()=>{
    
    try{
      if( parseInt(amount) > 0){
        setValid(true)
      }
      else 
         setValid(false)
    }
    catch(e){
      setValid(false)
    }
  },[amount])


    const dispatch = useDispatch();

    return(
      
      <BottomSheet
      onChange={(idx) => {
        setIsShowing(idx < 0 ? false : true);
    }}
      enablePanDownToClose={true}
      backgroundStyle={{ 
        backgroundColor: '#fff',
       }}
       ref={ bottomSheetRef} 
       index={-1} 
       snapPoints={ snapPoints}
        backdropComponent={ renderBackdrop}
        >

    <BottomSheetView style={styles.contentContainer}>
      <KeyboardAvoidingView behavior='padding'>
        <View style={{
            height: '50%',
            justifyContent: 'space-between' ,
            alignItems:'center',
            marginBottom: 20,
            paddingBottom:20,
          }}>

            {/* <TouchableOpacity onPress={handleClosePress} style = {{position:'absolute'  , right : 20 , top : 0}}>
        <Entypo name="circle-with-cross" size={24} color="grey"  />
        </TouchableOpacity> */}

            <View style={{ marginTop: 0, marginHorizontal: 0 }}>


              <Text style={{ fontFamily: 'Poppins', fontSize: 16 , fontWeight : '400'  , marginBottom : 4 ,textAlign:'center' }}>
                PAYING TO
              </Text>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20  ,textAlign:'center'}}>
                {billingOrder?.Restaurant.name}
              </Text>
              

             
             <View  style = {{   marginTop: 20 , marginBottom : 50   }}>
              <Feather name="check-circle" size={40} color="green" style ={{marginRight:10 , position:'absolute' , bottom : 5}} />

             <View style={{flexDirection:'row' ,  justifyContent:'center' , alignItems:'center' , marginTop:23}}>


              <View style = {{backgroundColor : '#d20000' , height:50 , width:width * 0.6, justifyContent:'center' , alignItems:'center' }}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                  // marginBottom: 20,
                  color:'white'
                }}>
                  {billingOrder!.discount}% OFF on total bill
                </Text>
              </View>
              </View>

              </View>


              <View style={homeStyle.amountView} >
                <Input
                  style={homeStyle.amountInput}
                  keyboardType={'number-pad'}
                  placeholderTextColor="#707070"
                  onChangeText={(amount) => setAmount(amount.replace(/[^0-9]/g, '').slice(0, 5))}
                  value={amount.toString()}
                  placeholder="Enter amount as shown on the bill"
                  onFocus={handleOnFocus}
                  
                  leftIcon={
                    <FontAwesome
                      name='rupee'
                      size={20}
                      color='black'
                      />
                  }
                />
            
              </View>
            </View>


           
              <Ripple
                disabled={!valid}
                
                onPress={ async () => {

              
                  if(valid  ){

                   const conveniencePercentage = await getConveniencePercentage() || 2
                     


                    dispatch(setOrderDetails({
                      ...billingOrder , 
                    billAmount :  parseInt(amount),
                    amount :parseInt(amount) - (parseInt(amount) * (billingOrder!.discount / 100)) + parseInt(amount) * (conveniencePercentage/100),
                    saving : (parseInt(amount) * (billingOrder!.discount / 100)),
                    convenienceFee :parseInt(amount) * (conveniencePercentage/100),
                    conveniencePercentage 
                  }))
                }
                  router.push({
                    pathname: '/RenoPay/',
                  })
                }}

                style={{
                  backgroundColor:'#d20000',
                  ...homeStyle.payButtonView,
               
                }}>
                    <Text style={homeStyle.payButtonText}>Next </Text>
              </Ripple>
            </View>
            </KeyboardAvoidingView>
            </BottomSheetView>
            </BottomSheet>
    )
}


export default BillPopup



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
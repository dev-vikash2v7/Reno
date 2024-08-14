import { checkPaymentStatus, generateUPIPaymentLink } from 'src/utils/upiPayment'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useContext, useEffect, useState } from 'react'
import { View  , Text, ActivityIndicator, Linking, Alert, BackHandler} from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from 'react-native-paper';
import WarningPopup from 'src/components/Common/WarningPopup';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import { PaymentStatusType } from 'src/types/interfaces';
import {   setOrderTransaction } from 'src/redux_store/reducers/order.reducer';
import { useDispatch } from 'react-redux';
import { width } from 'src/constants';
import { completeOrder } from 'src/services/order.service'
import { mixpanel } from '../Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeUserOrders } from 'src/redux_store/reducers/restaurent.reducer';
import crashlytics from '@react-native-firebase/crashlytics';




const PaymentStatus = () => {

 
  const nav = useNavigation()



    const {method  }  = useLocalSearchParams()
    const {      orderDetails , merchantDetails } = useSelector((state : RootState)  => state.order)  ;

    const [qr , setQr] = useState<string | null>(null)
    const [loading , setLoading] = useState<boolean>(true)
    
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    
    const [paymentStatus , setPaymentStatus] = useState<PaymentStatusType>('PENDING')
    const [bankReferenceNumber , setBankReferenceNumber] = useState<string >('')
    const [npciTxnId , setNpciTxnId] = useState<string >('null')
    const [decentroTxnId , setDecentroTxnId] = useState<string  >('')
    
    const [visible, setVisible] = useState(false);
    const [title , setTitle] = useState<string >('')
    const [content , setContent] = useState<string >('')
    // const [onClose , setOnClose] = useState<void>(()=>{})
    const dispatch = useDispatch()
    

    const merchantData  = {
      paymentMethod : method, 
      ...orderDetails,
       finalAmount : orderDetails?.amount + ' Rs'  ,
       saving  : orderDetails?.saving +' Rs', 
       billAmount : orderDetails?.billAmount +' Rs' ,
        convenienceFee : orderDetails?.convenienceFee +' Rs',
         conveniencePercentage : orderDetails?.conveniencePercentage 
    }

        
  

    
    useEffect(()=>{  


      async function fetchurl(){
        // console.log('generating payment')

        mixpanel.track('initiate payment' , merchantData)
        crashlytics().log('PaymentStatus mounted.');


console.log('yees')
  
    if( !orderDetails?.Restaurant) return handleFailure()

       const {success,message,decentroTxnId,url} =  await  generateUPIPaymentLink(
        {
          method    , 
          amount : orderDetails?.amount   ,
          merchant_va : merchantDetails.virtualAccount , 
          name : orderDetails.Restaurant.name
        }
        )
       
       if(success && decentroTxnId  && url){
          setDecentroTxnId(decentroTxnId)
          setLoading(false)

        const res =   Linking.canOpenURL(url)

        res.then(()=>  Linking.openURL(url ))

        .catch(()=> {
          setVisible(true)
          setTitle('Transaction Failed')
          setContent('You dont have the selected upi app!')
        })
             
       }
       else{
        handleFailure()
       }
      }
      if(loading == true) {
       fetchurl()
      }
    } , [])



    useEffect(() => {

       async function checkStatus() {
        
          if( !loading && decentroTxnId && timeLeft  > 0  && timeLeft < 300 && timeLeft % 10 == 0)
          {
            // console.log('checkstatus : ' )

            const {transactionStatus, bankReferenceNumber , npciTxnId } = await checkPaymentStatus({  decentroTxnId  })

            switch (transactionStatus) {
              case 'SUCCESS':
                setBankReferenceNumber(bankReferenceNumber)
                setNpciTxnId(npciTxnId)
                setPaymentStatus(transactionStatus)
                handleSuccess()
                break;
      
              case 'FAILURE':
                handleFailure()
                break;
      
              case 'EXPIRED':
                handleExpired()
                break;
            
              default:
                break;
            }
          }
        }
      checkStatus();

  } , [timeLeft])



 

  useEffect(() => {

    if(loading == false){


    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Clean up function to clear intervals when 5 minutes have elapsed or when the component unmounts
    const clearIntervals = () => {
      clearInterval(timerId);
    };

    if(paymentStatus !== "PENDING")  clearInterval(timerId);


    // Clear intervals after 5 minutes
    setTimeout(clearIntervals, 60000 * 1); 

   return clearIntervals;
  }
  } , [loading])


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleCancelTransaction()
      return true; // Return true to prevent default behavior (exit app)
    });

    return () => backHandler.remove();
  }, []);



    const handleFailure  = () => {
      mixpanel.track('payment failed' , merchantData)

      setVisible(true)
      setTitle('Transaction Failed')
      setContent('If any amount is debited will return in 24 hours')
     
    }

    const handleExpired  = () => {
      mixpanel.track('payment expired' , merchantData)

      setVisible(true)
      setTitle('Transaction Expired')
      setContent('If any amount is debited will return in 24 hours')
    
    }


    const handleSuccess  =  async () => {

      
      const currentDate  =  new Date()
      
      const formattedDate = currentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '-');

      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      mixpanel.track('payment success' , {
       orderId :  orderDetails.id , 
        method, 
        decentroTxnId ,  
        ...merchantDetails , 
      amount :   orderDetails?.amount , 
         transactionId :decentroTxnId ,
        dateOPayment  : formattedDate,
        timeOfPayment : formattedTime 
      })

    //  await setChange(true)
    await AsyncStorage.setItem('allOnGoingOrdersChange' , 'yes')

console.log('orderDetails ' , orderDetails)

    dispatch(removeUserOrders( {id : orderDetails.id}))

      await completeOrder(orderDetails.id, orderDetails.amount, decentroTxnId,currentDate.toISOString() , orderDetails?.convenienceFee , 
      orderDetails?.conveniencePercentage ,
      orderDetails?.saving , 
      orderDetails?.billAmount);


      dispatch(setOrderTransaction(  {
          staus : paymentStatus ,
          transactionId :decentroTxnId ,
          bankReferenceNumber , 
          npciTxnId,
          dateOPayment  : formattedDate,
          timeOfPayment : formattedTime
      }))

      setTitle('Transaction Successfull !')
      setContent('Your bill has been payed ! Thankyou for using Reno')
      setVisible(true)
    }


    

    const handleCancellation = () => {
      mixpanel.track('payment cancelled' , merchantData)

      setTitle('Transaction Cancelled')
      setContent('')
      setVisible(true)
 
    };


    const handleCancelTransaction = () => {

      Alert.alert(
        'Confirm payment cancellation',
        'Your transaction is being processed. If you choose to cancel now, any debited amount will be credited back within 24 hours.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', onPress: () => handleCancellation() },
        ]
      );
    };


  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

         <WarningPopup title={title} content={content} success = {paymentStatus === 'SUCCESS'} onClose={() => {
          setVisible(false)

          if(paymentStatus == 'SUCCESS') {
            router.replace('/RenoPay/PaymentCompletion' )
          }
          else 
              nav.goBack()
         }} visible={visible}/>



      {loading ? <View>
        <Text style = {{marginBottom : 10 , fontWeight : '400' , fontSize:16}}>Redirecting you to  {method == 'phonepe' ? 'PhonePe' : method == 'gpay' ? 'GPay' : 'Paytm'} app </Text>
         <ActivityIndicator size={30} color='red'/>
      
      </View> :

      <>
            <View style={{marginBottom:30 , width : '100%'  , alignItems:'center' , justifyContent:'center' ,paddingHorizontal:10}}>
              <Text style={{fontSize: 18 , fontWeight: '400' , textAlign:'center'}}>We are waiting for  payment confirmation   </Text>
              <Text style={{textAlign:'center',marginTop:5}}>Transaction Amount: Rs {orderDetails?.amount.toLocaleString()}</Text>
            </View>


      <CountdownCircleTimer
        isPlaying = {!loading}
        duration={timeLeft}
        onComplete={() => handleExpired() }
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
     
      >
      
        {   ({ remainingTime }) => {
              const minutes = Math.floor(remainingTime / 60)
              const seconds = remainingTime % 60

               return <Text style={{ fontSize: 30 }}> {remainingTime && minutes+':'+seconds}</Text>
        }}
      
      </CountdownCircleTimer>

      <Button onPress={handleCancelTransaction} > Cancel Transaction</Button>
      </>
}
    </View>

  )
}

export default PaymentStatus

// {
//     "decentroTxnId": "B523EF31AB0F4423B8DF0DC653966B4F",
//     "status": "SUCCESS",
//     "responseCode": "S00000",
//     "message": "UPI Transaction Status processed successfully",
//     "data": {
//         "transactionStatus": "PENDING",
//         "type": "UPI_COLLECTION",
//         "bankReferenceNumber": "NA",
//         "npciTxnId": "NA"
//     },
//     "responseKey": "success_transaction_status_pending"
// }

// {
//   "decentroTxnId": "C088C5FBA84C481794E227F24B8FBCBD",
//   "status": "FAILURE",
//   "responseCode": "E00045",
//   "message": "Facing intermittent issues with the provider. Please try again after some time.",
//   "responseKey": "error_provider_error"
// }
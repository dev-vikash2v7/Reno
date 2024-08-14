// ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { EXPO_PUBLIC_Bholaram_Virtual_Account } from 'src/env';
import { OrderState } from '../type';

const initialState : OrderState = {


  otpRouteData : null,
  confirmBookingData : null,
  
  orderDetails : { },
  
  merchantDetails : {
    virtualAccount : EXPO_PUBLIC_Bholaram_Virtual_Account , 
    name : 'Owner Bholaram', 
    city: 'Pune',
  },
  transactionDetails : {
    status : null , 
    timeOfPayment : null ,
    dateOPayment: null ,
    transactionId : null ,
    bankReferenceNumber : null ,
    npciTxnId : null,
  },
} ;

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    
    setOrderTransaction: (state, action) => {
      const {  
        status  , 
        timeOfPayment ,
        dateOPayment ,
        transactionId  ,
        bankReferenceNumber  ,
        npciTxnId
      } = action.payload;

      state.transactionDetails.status = status;
      state.transactionDetails.transactionId = transactionId;
      state.transactionDetails.dateOPayment = dateOPayment;
      state.transactionDetails.timeOfPayment = timeOfPayment;
      state.transactionDetails.bankReferenceNumber = bankReferenceNumber;
      state.transactionDetails.npciTxnId = npciTxnId;
    },
    
    setOrderDetails: (state, action) => {
      state.orderDetails  =  action.payload
    },
    setConfirmBookingData: (state, action) => {
      state.confirmBookingData  =  action.payload
    },
    setOtpRouteData: (state, action) => {
      state.otpRouteData  =  action.payload
    },
  
  }
});

export const { setOrderTransaction ,  setOrderDetails,setConfirmBookingData ,setOtpRouteData} = ordersSlice.actions;
export default ordersSlice.reducer;



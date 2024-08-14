import {postRequest} from 'src/services/index';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const completePayment = async (razorpayKeyId:string, {
  amount,
  name,
  email,
  mobile,
  orderId,
}:any) => {
  let data;
  try {
    data = (
      await postRequest('/createPaymentOrder', {
        amount,
        name,
        email,
        mobile,
      })
    ).data;
  } catch (error) {
    return {success: false, message: 'Payment error', error, data: null};
  }

  const options = {
    description: 'Reno restaurant booking payment',
    image:
      'https://www.renoapp.in/wp-content/uploads/2020/04/cropped-android-chrome-512x512-1.png',
    currency: 'INR',
    key: razorpayKeyId,
    amount: data.amount,
    name: 'Reno',
    order_id: data.id,
    prefill: {email: data.email, name: data.name, contact: data.phoneNumber},
    theme: {color: '#d20000'},
  };

  let response;
  try {
    response = await RazorpayCheckout.open(options);
  } catch (error) {
    return {success: false, message: 'Payment cancelled', error, data: null};
  }

  const to_send = {
    orderId,
    amount: data.amount / 100,
    receipt: data.receipt,
    paymentOrderId: data.id,
    paymentDescription: options.description,
    paymentId: response.razorpay_payment_id,
  };

  try {
    await postRequest('/confirmPayment', to_send);
  } catch (error) {
    return {
      success: false,
      message: `Payment processed but couldn't communicate with the server`,
      error,
      data: to_send,
    };
  }

  return {success: true, message: 'Payment Successful', data: to_send};
};

export const completePaymentRenoPass = async (razorpayKeyId:string, {
  amount,
  name,
  email,
  mobile,
  days,
}:any) => {
  let data;
  try {
    data = (
      await postRequest('/createPremiumMembershipOrder', {
        amount,
        name,
        email,
        mobile,
      })
    ).data;
  } catch (error) {
    return {success: false, message: 'Payment error', error, data: null};
  }

  const options = {
    description: `Reno pass ${days} payment`,
    image:
      'https://www.renoapp.in/wp-content/uploads/2020/04/cropped-android-chrome-512x512-1.png',
    currency: 'INR',
    key: razorpayKeyId,
    amount: data.amount,
    name: 'Reno',
    order_id: data.id,
    prefill: {email: data.email, name: data.name, contact: data.phoneNumber},
    theme: {color: '#d20000'},
  };

  let response;
  try {
    response = await RazorpayCheckout.open(options);
  } catch (error) {
    return {success: false, message: 'Payment cancelled', error, data: null};
  }

  const city = await AsyncStorage.getItem('city');

  const to_send = {
    city,
    days,
    amount: data.amount / 100,
    receipt: data.receipt,
    paymentOrderId: data.id,
    paymentDescription: options.description,
    paymentId: response.razorpay_payment_id,
  };

  try {
    data = await postRequest('/confirmPremiumMembershipOrder', to_send);
  } catch (error) {
    return {
      success: false,
      message: `Payment processed but couldn't communicate with the server`,
      error,
      data: to_send,
    };
  }

  return {success: true, message: 'Payment Successful', data:data.data};
};

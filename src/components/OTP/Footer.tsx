// import React, { Component } from 'react';
// import { Text, View } from 'react-native';
// import { width } from '../../constants';
// import Ripple from 'react-native-material-ripple';
// import { InstantEatData, Order, OrderData } from 'src/types/order.interfaces';
// import { createBooking, createInstantBooking } from 'src/services/order.service';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { verifyOtp } from 'src/services/user.service';

interface Props {
    otp: string
    data: any;
    active: boolean;
    showSnackbar: (show: boolean) => void;
}
// interface State {
//     orderData: Order | null;
//     instantOrderData: any | null;
// }

// class Footer extends Component<Props, State> {
    
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             orderData: null,
//             instantOrderData: null
//         }
//     }


//     async confirmInstantBooking(data: InstantEatData) {
        
//         const res = await createInstantBooking(data);

//         this.setState({ orderData: res.data.orderData });
//         if (res.data.success) {
            
//             await AsyncStorage.setItem('confirmBookingData', JSON.stringify(res.data.orderData));


//             router.push({
//                 pathname: '/InstantEatOrder/BookingConfirmation'
//             });
//         }
//     }

//     async confirmBooking(data: OrderData) {
//         try {
//             const { contact } = (await verifyOtp(parseInt(this.props.otp))).data;
//             if (contact) {
//                 await AsyncStorage.setItem("contact", contact);
//                 const res = await createBooking(data);
//                 this.setState({ orderData: res.data.orderData });
//                 if (res.data.success) {
//                     await AsyncStorage.setItem('confirmBookingData', JSON.stringify(res.data.orderData));
//                     router.push({
//                         pathname: '/CreateOrder/ConfirmBooking'
//                     });
//                 }
//             }
//         } catch (error) {
//             console.log('confirmBooking error' , error);
//         }
//     }

//     render() {
//         return (
//             <View
//                 style={{
//                     position: 'absolute',
//                     bottom: 0,
//                     backgroundColor: '#fff',
//                     shadowColor: '#00000029',
//                     shadowOpacity: 1,
//                     shadowOffset: { height: -5, width: 0 },
//                     height: 80,
//                     elevation: 15,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: width,
//                 }}>
//                 <Ripple
//                     onPress={async () => {
//                         // console.log(this.props.data.instantEat);

//                         !this.props.data.instantEat ?
//                             this.confirmBooking(this.props.data)
//                             :
//                             this.confirmInstantBooking(this.props.data);
//                     }}
//                     style={{
//                         width: '90%',
//                         height: 55,
//                         backgroundColor: this.props.active ? '#d20000' : '#00000059',
//                         borderRadius: 5,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                     }}>
//                     <Text
//                         style={{
//                             fontFamily: 'Poppins-SemiBold',
//                             fontSize: 16,
//                             color: '#fff',
//                         }}>
//                         VERIFY
//                     </Text>
//                 </Ripple>
//             </View>
//         );
//     }
// }

// export default Footer;

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { width } from '../../constants';
import Ripple from 'react-native-material-ripple';
import { InstantEatData, OrderData } from 'src/types/order.interfaces'; // Assuming Order interface doesn't need to be imported here
import { createBooking, createInstantBooking } from 'src/services/order.service';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOtp } from 'src/services/user.service';
import { setConfirmBookingData } from 'src/redux_store/reducers/order.reducer';
import { useDispatch } from 'react-redux';

const Footer = ({ otp, data, active } : Props) => {

    
    const [orderData, setOrderData] = useState(null);
    const [instantOrderData, setInstantOrderData] = useState(null);

    const dispatch = useDispatch()

    const confirmInstantBooking = async (data : InstantEatData) => {
        const res = await createInstantBooking(data);
        setOrderData(res.data.orderData);
        if (res.data.success) {
            dispatch(setConfirmBookingData(res.data.orderData))
            router.push( '/InstantEatOrder/BookingConfirmation');
        }
    };

    const confirmBooking = async (data : OrderData) => {
        try {
            const { contact } = (await verifyOtp(parseInt(otp))).data;
            if (contact) {
                await AsyncStorage.setItem("contact", contact);
                const res = await createBooking(data);
                setOrderData(res.data.orderData);
                if (res.data.success) {
                    dispatch(setConfirmBookingData(res.data.orderData))
                    router.push( '/CreateOrder/ConfirmBooking');
                }
            }
        } catch (error) {
            console.log('confirmBooking error', error);
        }
    };

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#fff',
                shadowColor: '#00000029',
                shadowOpacity: 1,
                shadowOffset: { height: -5, width: 0 },
                height: 80,
                elevation: 15,
                alignItems: 'center',
                justifyContent: 'center',
                width: width,
            }}>
            <Ripple
                onPress={async () => {
                    !data.instantEat ?
                        confirmBooking(data)
                        :
                        confirmInstantBooking(data);
                }}
                style={{
                    width: '90%',
                    height: 55,
                    backgroundColor: active ? '#d20000' : '#00000059',
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        color: '#fff',
                    }}>
                    VERIFY
                </Text>
            </Ripple>
        </View>
    );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import Image from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { width, height } from '../../constants';
import OTPInput from 'src/components/OTP/OTPInput';
import Footer from 'src/components/OTP/Footer';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { otpScreenRouteData } from 'src/types/order.interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux_store/store';
import { mixpanel } from '../Login';

interface OTPScreenProps {
    confirmBooking: () => void;
    confirmInstantBooking: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [otp, setOTP] = useState<string>(__DEV__ ? '0000' : '');
    const [active, setActive] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    
    const data = useSelector((state:RootState) => state.order.otpRouteData)
    const [routeData, setRouteData] = useState<otpScreenRouteData | null>(data);

    
    const getOrderData = async () => {
        try {

            if(!data) return 

            setRouteData(data);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        mixpanel.track('opened OTPScreen')
        getOrderData();
    }, []);

    return (
        loading ?
            <ActivityIndicator size={40} style={{ flex: 1 }} /> :
            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header />
                <Image
                    source={require('../../assets/otpAsset.png')}
                    style={{ height: height / 4, width, alignSelf: 'center' }}
                    resizeMode="contain"
                />
                <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 22,
                            color: '#000',
                        }}>
                        OTP Verification
                    </Text>
                    <Text
                        style={{
                            paddingTop: 10,
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 19,
                            color: '#797f87',
                        }}>
                        Enter OTP send to
                        <Text style={{ fontFamily: 'Poppins-Bold', color: '#767d86' }}>
                            {` +91 ${routeData?.phoneno}`}
                        </Text>
                    </Text>
                    <OTPInput otpCallback={(otp: string) => setOTP(otp)} callbackFromChild={(visible: string) => setVisible(visible === 'show')} />

                    <Footer
                        active={true}
                        showSnackbar={(state: boolean) => setActive(state)}
                        otp={otp}
                        data={
                            routeData?.instantEat
                                ? {
                                    restaurantId: routeData?.restaurantId,
                                    status: 'Confirmed',
                                    instantEat: routeData?.instantEat,
                                    date: (new Date(routeData?.timeStamp!)).toISOString(),
                                    tableSize: routeData?.people,
                                    bookingName: routeData?.name,
                                    contact: routeData?.phoneno,
                                    userId: routeData?.userId,
                                    timeDiscountSlotId: routeData?.timeDiscountSlotId,
                                    discount: routeData?.discount,
                                }
                                : {
                                    tableSize: routeData?.people,
                                    contact: routeData?.phoneno,
                                    timeSlotId: routeData?.timeSlotId,
                                    restaurantId: routeData?.restaurantId,
                                    bookingName: routeData?.name,
                                    userId: routeData?.userId,
                                    status: 'Confirmed',
                                    timeDiscountSlotId: routeData?.timeDiscountSlotId,
                                    instantEat: routeData?.instantEat,
                                    discount: routeData?.discount,
                                    date: (new Date(routeData?.timeStamp!)).toISOString(),
                                }
                        }
                    />
                    <Snackbar
                        visible={active}
                        theme={{ colors: { accent: 'white' } }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            elevation: 17,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            backgroundColor: '#d20000',
                            height: 55,
                            width: '90%',
                            alignSelf: 'center',
                            borderRadius: 5,
                        }}
                        onDismiss={() => setActive(false)}
                        action={{
                            label: 'Okay',
                            onPress: () => { },
                        }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: 'Poppins-Medium',
                                color: '#fff',
                            }}>
                            Incorrect OTP
                        </Text>
                    </Snackbar>
                </View>
            </SafeAreaView>
    );
};

const Header: React.FC = () => {
    return (
        <View style={{ width, height: 55, justifyContent: 'center' }}>
            <Ionicons
                name="arrow-back"
                onPress={() => router.back()}
                color="#000"
                size={35}
                style={{ marginLeft: 15 }}
            />
        </View>
    );
};

export default OTPScreen;

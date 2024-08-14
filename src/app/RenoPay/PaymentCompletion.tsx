import { View, Text, Image, Dimensions, BackHandler} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from 'src/components/Common/Header'
import { router, useNavigation } from 'expo-router'
import { createUserReivew, getUserReview, updateUserReview } from 'src/services/review.service'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Modal } from 'react-native-paper'
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import RenderReview from 'src/components/RenoPay/RenderReview'
import crashlytics from '@react-native-firebase/crashlytics';



const PaymentCompletion = () => {

    
    const { transactionDetails , orderDetails } = useSelector((state : RootState)  => state.order)  ;

    const {   id, discount  ,  amount    , billAmount ,saving  , convenienceFee , bookingCode} = orderDetails

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loadingReview, setLoadingReview] = useState(true);
    const [isReviewActive, setIsReviewActive] = useState(false);
    const [updateReview, setUpdateReview] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState(true);
    const [isRated, setIsRated] = useState(false);
    const nextFieldRef = useRef<TextInput>(null);


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          router.push('/drawer/(tabs)/Home')

          return true; // Return true to prevent default behavior (exit app)
        });
    
        return () => backHandler.remove();
      }, []);
    

    useEffect(() => {
        crashlytics().log('Payment Completion mounted.');

        getReview();
        setLoadingReview(false);
    }, [])

   

    const getReview = async () => {
        const res = await getUserReview();
        let data;
        for (let review of res.data.reviews) {
            if (review.bookingId === id) {
                data = review;
                break;
            }
        }

        if (data) {
            setRating(data.rating);
            setReview(data.review);
            if (data.review !== '') {
                setIsEditable(false);
            }
            if (data.rating) {
                setIsRated(true);
            }
            setReviewId(data.id);
            setIsReviewActive(true);
            setUpdateReview(true);
            setLoadingReview(false);
        } else {
            setLoadingReview(false);
        }
    }

    const submitReview = async () => {
        // const { rating, review, reviewId } = this.state;
        // if (!rating) {
        //     return;
        // }
        setSubmitLoading(true);
        try {
            let res;
            if (updateReview) {
                res = await updateUserReview(review, rating, reviewId!);
            }
            else {
                res = await createUserReivew(review, rating, orderDetails.restaurantId.toString(), id.toString());
            }
            const _data = res.data;
            setReviewId(_data.id);
            setUpdateReview(true);
            setShowInfo(true);
            setSubmitError(false);
            if (review !== '') {
                setIsEditable(false);
            }
            if (rating) {
                setIsRated(true);
            }
            setShowReviewModal(true);
        } catch (e) {
            setShowInfo(true);
            setSubmitError(true);
        }
        setSubmitLoading(false);
    }



    return (
        <>
            <SafeAreaView>
                <View style={styles.header}>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.replace('/drawer/Home')}>
                        <Ionicons
                            name={'arrow-back'}
                            size={24}
                            color={'#404040'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text}>{orderDetails.Restaurant.name}</Text>
                </View>
                <View style={{
                    backgroundColor: 'white',
                    margin: 20,
                    padding: 10,
                    borderRadius: 10
                }}>
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 15,
                        color: 'grey'
                    }}>Bill Amount</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 22
                        }}
                    >
                        ₹{billAmount}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 15,
                            color: 'grey'
                        }}
                    >
                        Booking Code: {bookingCode}
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        color: 'grey'
                    }}>
                        Paid on {transactionDetails.dateOPayment}  At {transactionDetails.timeOfPayment}
                    </Text>
                    <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', marginTop: 10, marginBottom: 10, }} />

                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 22 }}>
                        You Paid ₹{amount}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'black' }}>
                            Total bill amount
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'black' }}>
                            ₹{billAmount}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'green' }}>
                            {`Discount (${discount}%)`}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'green' }}>
                            -₹{saving}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'green' }}>
                            {`Convenience Fee`}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#000' }}>
                            ₹{convenienceFee}
                        </Text>
                    </View>

                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 12,
                        color: 'grey',
                        marginTop: 10
                    }}>
                        Transaction ID: {transactionDetails.transactionId}
                    </Text>
                </View>
                <Text
                    style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 15,
                        marginLeft: 20,
                        marginBottom: 10
                    }}
                >
                    Share Your Experience
                </Text>
                {
                    RenderReview(
                        loadingReview,
                        isReviewActive,
                        setIsReviewActive,
                        updateReview,
                        review,
                        setReview,
                        rating,
                        setRating,
                        isEditable,
                        isRated,
                        submitLoading,
                        submitReview,
                        nextFieldRef
                    )
                }

            </SafeAreaView>
            <Modal
                dismissableBackButton
                dismissable
                style={{
                    alignItems: 'center'
                }}
                onDismiss={() => setShowReviewModal(false)}
                visible={showReviewModal}
            >
                <View style={{
                    height: 300,
                    width: 300,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 20,
                        textAlign: 'center',
                    }}>
                        Review Submitted Successfullly!
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: 15,
                            textAlign: 'center',
                            color: 'grey',
                            marginTop: 10
                        }}
                    >
                        Thanks for {review === '' ? 'rating' : 'reviewing'} your experience
                    </Text>
                    <Image source={require('../../assets/greentick.png')} style={{
                        height: 100,
                        width: 100,
                        marginTop: 10
                    }} />
                    <TouchableOpacity onPress={() => setShowReviewModal(false)} style={{
                        marginTop: 10
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: 13
                        }}>
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal></>
    )
}

export default PaymentCompletion

const styles = StyleSheet.create({
    restaurantRating: {
        height: 38,
        width: 60,
        marginTop: 45,
        opacity: 0.8,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reservationDetailsView: {
        marginTop: 5,
        borderRadius: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        flex: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    personalDetailsView: {
        marginTop: 5,
        borderRadius: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        flex: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    rateButton: {
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderColor: '#d20000',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    rateButtonText: {
        fontSize: 17,
        fontFamily: 'Poppins-Regular',
        color: '#d20000',
    },
    reviewInputView: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 10,
        elevation: 7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 15,
    },
    reviewInput: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        paddingVertical: 0,
        color: '#404040',
        minHeight: 60,
        textAlignVertical: 'top',
        textAlign: 'justify',
        borderBottomWidth: 1,
        borderColor: '#B0B0B0',
        marginBottom: 10,
    },
    submitButtonView: {
        alignSelf: 'center',
        marginTop: 5,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingTop: 15,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: '#404040',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 5
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    accessory: {
        width: Dimensions.get('window').width,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 8
    }
});

import { View, Text, BackHandler, Image, KeyboardAvoidingView, Dimensions, InputAccessoryView, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from 'src/components/Common/Header'
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router'
import { createUserReivew, getUserReview, updateUserReview } from 'src/services/review.service'
import { ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Modal } from 'react-native-paper'



const RenderReview = (
    loadingReview: boolean,
    isReviewActive: boolean,
    setIsReviewActive: React.Dispatch<React.SetStateAction<boolean>>,
    updateReview: boolean,
    review: string,
    setReview: React.Dispatch<React.SetStateAction<string>>,
    rating: number,
    setRating: React.Dispatch<React.SetStateAction<number>>,
    isEditable: boolean,
    isRated: boolean,
    submitLoading: boolean,
    submitReview: () => void,
    nextFieldRef: any
) => {

    if (loadingReview) {
        return (
            <ActivityIndicator
                color={'#d20000'}
                size={28}
                style={{ marginVertical: 10 }}
            />
        );
    }

    if (!isReviewActive) {
        return (
            <Ripple
                rippleColor="#d20000"
                style={styles.rateButton}
                onPress={() => setIsReviewActive(true)}>
                <Text style={styles.rateButtonText}>Rate your experience</Text>
            </Ripple>
        );
    }
    return (
        <View style={styles.reviewInputView}>
            <TextInput
                keyboardType='default'
                autoCorrect={false}
                blurOnSubmit={true}
                ref={nextFieldRef}
                inputAccessoryViewID='Done'
                returnKeyType='done'
                editable={isEditable}
                value={review}
                onChangeText={setReview}
                multiline
                placeholder={'How was your experience?'}
                style={styles.reviewInput}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 30
                }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Ionicons
                            key={index.toString()}
                            name={index <= rating - 1 ? 'star' : 'star-outline'}
                            size={26}
                            color={'#d20000'}
                            disabled={isRated}
                            onPress={() => setRating(index + 1)}
                        />
                    ))}
            </View>
            <View style={styles.submitButtonView}>
                {submitLoading ? (
                    <ActivityIndicator color={'#d20000'} size={24} />
                ) : (
                    !isEditable && isRated ? <></> :
                        <Text
                            onPress={submitReview}
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 16,
                                color: rating ? '#d20000' : '#707070',
                            }}>
                            {'Submit Review'}
                        </Text>
                )}
            </View>
            <InputAccessoryView nativeID="Next">
                <View style={styles.accessory}>
                    <Button
                        onPress={() => nextFieldRef.current.blur()}
                        title='Next'
                    />
                </View>
            </InputAccessoryView>
        </View>
    );
}



export default RenderReview ;


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
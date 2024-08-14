import { hp, mixpanel, wp } from 'src/app/Login';
import { SlotsProps } from 'src/types/interfaces';
import { router } from 'expo-router';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import analytics from '@react-native-firebase/analytics'

class Slots extends Component<SlotsProps> {
    render() {
        return (
            <View>
                <Ripple
                    rippleDuration={300}
                    style={{
                        width: hp('7.5%'),
                        height: hp('7.5%'),
                        marginLeft: this.props.index === 0 ? wp('3.5%') : wp('3%'),
                        marginTop: hp('2%'),
                        marginRight: wp('1%'),
                    }}
                    onPress={
                        this.props.exhausted
                            ? () => { return }
                            :async () => {
                                  await analytics().logEvent('Opened_Restaurant', { 
                                    id: this.props.id, 
                                    name: this.props.name, 
                                    timeSlotSelected: this.props.time ,
                                    city :this.props.city,
                                    rating: this.props.rating,
                                    discount: this.props.discount,

                                })

                                mixpanel.track('opened restaurant', { 
                                    id: this.props.id, 
                                    name: this.props.name, 
                                    timeSlotSelected: this.props.time ,
                                    city :this.props.city,
                                    rating: this.props.rating,
                                    discount: this.props.discount,

                                });

                                router.push({
                                    pathname: '/CreateOrder/', params: {
                                        discount: this.props.discount,
                                        time: this.props.time,
                                        timeDiscountId: this.props.timeDiscountId,
                                        id: this.props.id,
                                        imageUri: this.props.image,
                                        name: this.props.name,
                                        city: this.props.city!,
                                        timeSlotId: this.props.timeSlotId,
                                        noSlotsToday: this.props.noSlotsToday.toString(),
                                        nextDay: this.props.nextDay,
                                        rating: this.props.rating,
                                     address : this.props.address

                                    }
                                })
                            }
                    }
                >
                    <View style={styles.twelvePointBurst}>
                        <View style={styles.twelvePointBurstMain} />
                        <View style={{
                            width: hp('6.5%'),
                            height: hp('6.5%'),
                            borderRadius: hp('0.5%'),
                            position: 'absolute',
                            backgroundColor: '#d20000',
                            top: 0,
                            left: 0,
                            transform: [{ rotate: '30deg' }],
                        }} />
                        <View style={{
                            width: hp('6.5%'),
                            height: hp('6.5%'),
                            borderRadius: hp('0.5%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            backgroundColor: '#d20000',
                            top: 0,
                            left: 0,
                            transform: [{ rotate: '60deg' }],
                        }}>
                            {this.props.exhausted ? (
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp('1%'),
                                        color: '#fff',
                                        transform: [{ rotate: '-120deg' }],
                                    }}
                                >
                                    EXHAUSTED
                                </Text>
                            ) : (
                                <View
                                    style={{
                                        transform: [{ rotate: '-60deg' }],
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: hp('1.8%'),
                                            marginTop: hp('1.1%'),
                                            fontFamily: 'Poppins-Regular',
                                            color: '#fff',
                                        }}
                                    >
                                        {this.props.time.slice(0, 5)}
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: hp('2.4%'),
                                            marginBottom: hp('0.6%'),
                                            fontFamily: 'Poppins-SemiBold',
                                            color: '#fff',
                                        }}
                                    >
                                        {this.props.discount}%
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Ripple>
            </View>
        );
    }
}

const styles = {
    twelvePointBurst: {},
    twelvePointBurstMain: {
        width: 48,
        height: 48,
        borderRadius: 4,
        backgroundColor: '#d20000',
    },
    twelvePointBurst30: {
        width: 48,
        height: 48,
        borderRadius: 4,
        position: 'absolute',
        backgroundColor: '#d20000',
        top: 0,
        left: 0,
        transform: [{ rotate: '30deg' }],
    },
    twelvePointBurst60: {
        width: 48,
        height: 48,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: '#d20000',
        top: 0,
        left: 0,
        transform: [{ rotate: '60deg' }],
    },
};

export default Slots;

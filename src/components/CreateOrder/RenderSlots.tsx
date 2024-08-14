import { hp, wp } from 'src/app/Login';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';

interface Props {
    exhausted: boolean;
    discount: number;
    time: string;
    id: string;
    timeSlotId: string;
    backgroundColor: string;
    callbackFromChild: (
        discount: number,
        time: string,
        id: string,
        timeSlotId: string
    ) => void;
}

class Slots extends Component<Props> {
    render() {
        return (
            <View>
                <Ripple
                    rippleDuration={300}
                    style={{
                        width: hp('6.7%'),
                        height: hp('6.7%'),
                        marginLeft: wp('3%'),
                        marginTop: hp('1.5%'),
                        marginRight: wp('3.2%'),
                    }}
                    onPress={
                        this.props.exhausted
                            ? () => { return; }
                            : () => {
                                this.props.callbackFromChild(
                                    this.props.discount,
                                    this.props.time,
                                    this.props.id,
                                    this.props.timeSlotId
                                );
                            }
                    }>
                    <View style={styles.twelvePointBurst}>
                        <View
                            style={[
                                styles.twelvePointBurstMain,
                                { backgroundColor: this.props.backgroundColor },
                            ]}
                        />
                        <View
                            style={[
                                styles.twelvePointBurst30,
                                { backgroundColor: this.props.backgroundColor },
                            ]}
                        />
                        <View
                            style={[
                                styles.twelvePointBurst60,
                                { backgroundColor: this.props.backgroundColor },
                            ]}>
                            {this.props.exhausted ? (
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp('1%'),
                                        color: '#fff',
                                        transform: [{ rotate: '-120deg' }],
                                    }}>
                                    EXHAUSTED
                                </Text>
                            ) : (
                                <View style={{ transform: [{ rotate: '-60deg' }] }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: hp('1.8%'),
                                            fontFamily: 'Poppins-Regular',
                                            color: '#fff',
                                        }}>
                                        {this.props.time.slice(0, 5)}
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: hp('2.2%'),
                                            fontFamily: 'Poppins-SemiBold',
                                            color: '#fff',
                                        }}>
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

const styles: any = {
    twelvePointBurst: {},
    twelvePointBurstMain: {
        width: hp('6.5%'),
        height: hp('6.5%'),
        borderRadius: hp("0.5%"),
        backgroundColor: '#d20000',
    },
    twelvePointBurst30: {
        width: hp('6.5%'),
        height: hp('6.5%'),
        borderRadius: hp("0.5%"),
        position: 'absolute',
        backgroundColor: '#d20000',
        top: 0,
        left: 0,
        transform: [{ rotate: '30deg' }],
    },
    twelvePointBurst60: {
        width: hp('6.5%'),
        height: hp('6.5%'),
        borderRadius: hp("0.5%"),
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

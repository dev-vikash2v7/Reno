import React, { Component } from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import Ripple from 'react-native-material-ripple';
import _ from 'lodash';
import { height, width } from 'src/constants';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import moment from 'moment';
import { Order } from 'src/types/order.interfaces';
import { router } from 'expo-router';
import PastBookingsCard from './PastBookingsCard';


interface PastBookingProps {
    data: Order[];
}

class PastBooking extends Component<PastBookingProps> {
    render() {
        if (!_.isEmpty(this.props.data)) {
            return (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: 150 }} />}
                    data={this.props.data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        if (!item.Restaurant) {
                            return null;
                        }

                        const discountProperty =
                            getDayFromNumber(new Date(item.date).getDay()).substring(0, 3) +
                            'Discount';

                        return (
                            <PastBookingsCard item={item} />
                        );
                    }}
                />
            );
        } else {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/no-reservations.png')}
                        style={{ height: height * 0.3, width: width, marginTop: 50 }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            marginTop: 20,
                            fontSize: 26,
                            color: '#000',
                        }}>
                        No Reservations Found
                    </Text>
                    <View style={{ flex: 1, paddingHorizontal: 30 }}>
                        <Text
                            style={{
                                marginTop: 8,
                                color: '#777777',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 15,
                                textAlign: 'center',
                            }}>
                            Reserve a table now and avail discounts on your bill
                        </Text>
                    </View>
                </View>
            );
        }
    }
}

export default PastBooking;

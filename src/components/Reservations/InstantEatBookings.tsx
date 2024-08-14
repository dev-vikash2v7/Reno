import React, { Component } from 'react';
import { Text, View, FlatList, Image, Platform } from 'react-native';
import _ from 'lodash';
import { height, width } from 'src/constants';
import { Order } from 'src/types/order.interfaces';
import PastBookingsCard from './PastBookingsCard';
import UpcomingBookingCard from './UpcomingBookingsCard';

class InstantEatBookings extends Component<{ 
    data: Order[] ,
     bottomSheetRef ,
    setBillingOrder ,
    setWarningVisible , 
    setSuccessVisible  ,
     setContent , 
     setAlertVisible  , 
      setLocation ,
      handleSuccess, 
      setLoadingVisible
    }> {


    render() {
        if (!_.isEmpty(this.props.data)) {
            return (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={Platform.OS == 'android' ? <View style={{ height: 150 }}/> : <></>}

                    data={this.props.data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        if (!item.Restaurant) {
                            return null;
                        }
                        const milliseconds = new Date(item.createTime).getTime();
                        const expiryTime = milliseconds + 15 * 60 * 1000;
                        if (item.status === 'Completed' || item.status === 'Cancelled' || Date.now() > expiryTime) {
                            return <PastBookingsCard item={item} />
                        }
                        return (
                            <UpcomingBookingCard infoOnly={false} index={index} item={item} setItem = { this.props.setBillingOrder}  bottomSheetRef={ this.props.bottomSheetRef}   setSuccessVisible={this.props.setSuccessVisible} setWarningVisible = {this.props.setWarningVisible} setContent= {this.props.setContent}  setAlertVisible={this.props.setAlertVisible}   setLocation={this.props.setLocation}setLoadingVisible = {this.props.setLoadingVisible} handleSuccess={this.props.handleSuccess} />
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

export default InstantEatBookings;

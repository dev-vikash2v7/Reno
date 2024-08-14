import { View, Text, PermissionsAndroid, FlatList, Platform, StatusBar, StyleSheet, BackHandler, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import _ from 'lodash';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';

import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from 'src/app/Login';

const RefreshLocation = ({refreshLocation  }) => {
  return (
    <SafeAreaView style={{
        position: 'absolute',
        top: hp('3%'),
        width: '100%',
        alignItems: "center"
    }}>
        <Ripple
            style={[styles.bubble, styles.button]}
            onPress={refreshLocation}>
            <Entypo name="location-pin" color="#d20000" size={hp('2.2%')} />
            <Text
                style={{
                    color: '#d20000',
                    fontFamily: 'Poppins-SemiBold',
                    marginLeft: wp('1%'),
                    fontSize: hp('1.8%'),
                }}>
                Refresh Location
            </Text>
        </Ripple>
    </SafeAreaView>

  )
}

export default RefreshLocation


const styles = StyleSheet.create({
    bubble: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: hp('2.2%'),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wp('2.2%'),
        paddingVertical: hp('0.8%'),
    },
});
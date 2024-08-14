import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground  , Image} from 'react-native';

import { height, width } from 'src/constants';

import { hp, wp } from 'src/app/Login';

const NoInternetScreen = () => {
 
  return (
    <View style={styles.container}>

<View  style={{ width:width*0.7 , height:height*0.31 }}>


{/* <LottieView
                  source={require("src/assets/images/q.png")}
                  autoPlay
                  loop
                  // ref={animationRef}
                /> */}
        <Image source={require('../../assets/images/nointernet.png')} style={{width:'100%' , height:'100%' , resizeMode:'cover'}} />

        </View>

        <View style={styles.noInternetContainer}>

        {/* <Image source={{uri : require('../../assets/images/wifi.png')}} width={200} height={200}   resizeMode="cover"/> */}

        {/* <ImageBackground  source={require('../../assets/images/wifi.png')} width={200} height={200}/> */}
      
          <Text style={styles.noInternetText}>Unable to load data</Text>
          <Text style={[styles.noInternetText , {marginTop:5 ,fontWeight:'300' , fontSize:17}] }>Please check your internet connection or try again later.</Text>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  noInternetContainer: {
    // backgroundColor: 'red',
    padding: wp('2%'),
    borderRadius: hp('1%'),
    justifyContent:'center'
  },
  noInternetText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '400',
    textAlign:'center'
  },
});

export default NoInternetScreen;

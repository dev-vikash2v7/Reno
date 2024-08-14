import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Image from 'react-native-fast-image';
import { Svg, Polygon } from 'react-native-svg';
import { height, width } from 'src/constants';
// import RenderSlots from './RenderSlots';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RenderRestaurantsState } from 'src/types/interfaces';
import { router } from 'expo-router';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import * as Storage from 'aws-amplify/storage';
import { Entypo } from '@expo/vector-icons';
import { hp, wp } from 'src/app/Login';
interface RenderRestaurantsProps {
  image: string;
  id: string;
  longitude: string;
  latitude: string;
  name: string;
  rating: number;
  hasPickup: boolean;
  distance: number;
  discount: number;
  timeDiscountId: string
  address: string
}


class RenderRestaurants extends Component<RenderRestaurantsProps, RenderRestaurantsState> {
  constructor(props: RenderRestaurantsProps) {
    super(props);
    this.state = {
      city: null,
      imageIndex: 0,
      imagesData: [],
      uploadedImages: [],
      imgUrl: ''
    };
  }


  async componentDidMount() {
    console.log('distance' , this.props.distance)

    this.getCity();
    if (this.props.image[0] === 'h') {
      this.setState({ imgUrl: this.props.image });
    } else {

      const u = `https://d3eiw2rs38fo3w.cloudfront.net/public/${this.props.image}`;
      this.setState({ imgUrl: u.toString() });
    }
  }

  async getCity() {
    const city = await AsyncStorage.getItem('city');
    this.setState({ city });
  }

  
  render() {
    return (
      <View style={{ width: width, alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            // return ;
            router.push({
              pathname: '/CreateOrder', params: {
                // timeDiscounts: this.props.timeDiscounts,
                imageUri: this.props.image,
                id: this.props.id,
                longitude: this.props.longitude,
                latitude: this.props.latitude,
                name: this.props.name,
                city: this.state.city!,
                rating: this.props.rating ? this.props.rating : '0',
                discount: this.props.discount,
                instantEat: "true",
                timeDiscountId: this.props.timeDiscountId,
                noSlotsToday: "false",
                nextDay: new Date().getTime(),
                address : this.props.address
              }
            })
            
          }}
          style={{
            width:wp('85%'),
            alignSelf: 'center',
            marginBottom: hp('2.5%'),
            borderRadius: hp('1.8%'),
            backgroundColor: '#fff',
            height: hp('40%'),
            elevation: 7,
            shadowColor: '#000',
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.2,
          }}
        >
          <Image
            source={{ uri: this.state.imgUrl }}
            style={{
              height: hp('23%'),
              width: '100%',
              borderTopRightRadius: hp('2.4%'),
              overflow: 'hidden',
              borderTopLeftRadius: hp('2.4%'),
            }}
            resizeMode="cover"
          >
            

          </Image>
          <View style={{ flexDirection: 'row', position: 'absolute', top: hp('24.5%'), left: wp('2.4%'), width: '95%', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: hp('2.35%'),
                color: '#000',
              }}
            >
              {this.props.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: hp('1.9%'),
                color: '#7a7a7a',
              }}
            >
              {this.props.address.split(' ')[this.props.address.split(' ').length - 1]}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              position: 'absolute',
              top: hp('28%'),
              left: wp('2.1%'),
              fontSize: hp('1.9%'),
              color: '#7a7a7a',
            }}>


            {Math.ceil(this.props.distance / 1000)} KM away

          </Text>
        
          <View
            style={{
              width: wp('85%'),
              height: hp('7%'),
              backgroundColor: '#d20000',
              borderBottomRightRadius: hp('2.4%'),
              borderBottomLeftRadius: hp('2.4%'),
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: hp('2.1%'),
                color: '#fff',
              }}>
              {`BOOK With ${this.props.discount}% discount`}
            </Text>
          </View>
        </TouchableOpacity>



        <View style={{ position: 'absolute', left: 15, top: 15 }}>



<View style={{ position: 'absolute', left: wp('5%'), backgroundColor:  this.props.rating > 4 ? 'green' :  this.props.rating > 3 ? 'orange' : 'red', height: hp('4.5%'), width: wp('14%'), justifyContent: 'center', alignItems: 'center', borderRadius: hp('1%'), flexDirection: 'row' }}>

      <Text style={{ color: 'white', fontSize: hp('2.3%'), fontFamily: 'Poppins-SemiBold' }}>
        { this.props.rating ?  this.props.rating.toFixed(1) : 0}
      </Text>
      <Entypo name='star' color={'white'} size={hp('2.5%')} style={{ marginBottom: hp('0.6%') }} />
    </View>

        </View> 








        {this.props.hasPickup ? (
         <View style={{ position: 'absolute', right: 13, top: 15 }}>
         <View
           style={{
             justifyContent: 'center',
             elevation: 9,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 5 },
             shadowOpacity: 0.5,
             shadowRadius: 2,
             backgroundColor: 'green',
             borderTopRightRadius: 5,
             borderBottomLeftRadius: 5,
             borderTopLeftRadius: 5,
             paddingHorizontal: 10,
             zIndex: 10,
           }}
         >
           <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold' }}>
             Dine In/Takeaway
           </Text>
         </View>
         <View
           style={{
             width: 0,
             height: 0,
             backgroundColor: 'transparent',
             borderStyle: 'solid',
             top: 16,
             right: 4.4,
             borderLeftWidth: 8,
             position: 'absolute',
             borderRightWidth: 8,
             borderBottomWidth: 16,
             borderLeftColor: 'transparent',
             borderRightColor: 'transparent',
             borderBottomColor: '#006400',
             transform: [{ rotate: '-44.5deg' }],
           }}
         />
       </View>
        ) : (
          <View style={{ position: 'absolute', right: wp('3.4%'), top: hp('2%')}}>
          {/* <View style={{ position: 'absolute', right: 13, top: 15}}> */}
          <View
            style={{
              justifyContent: 'center',
              elevation: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: '#d29034',
              borderTopRightRadius:  hp('0.5%'),
              borderBottomLeftRadius:  hp('0.5%'),
              borderTopLeftRadius: hp('0.5%'),
              paddingHorizontal:  wp('2.4%'),
              // paddingHorizontal: 10,
              zIndex: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold',fontSize:hp('1.9%') }}>
              Dine In
            </Text>
          </View>

          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              top: hp('2.2%'),
              // top: 16,
              right: wp('1.4%'),
              borderLeftWidth: hp('1%'),
              // borderLeftWidth: 8,
              position: 'absolute',
              borderRightWidth: hp('1%'),
              borderBottomWidth: hp('2.1%'),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#be8228',
              transform: [{ rotate: '-44.5deg' }],
            }}
          />
        </View>
        )}
      </View>
    );
  }
}

export default RenderRestaurants;


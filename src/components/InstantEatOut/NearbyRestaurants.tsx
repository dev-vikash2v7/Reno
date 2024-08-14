import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Image from 'react-native-fast-image';
import { Svg, Polygon } from 'react-native-svg';
import Ripple from 'react-native-material-ripple';
import { height, width } from 'src/constants';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Restaurant } from 'src/types/interfaces';
import { router } from 'expo-router';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import { Entypo } from '@expo/vector-icons';

Amplify.configure(awsconfig);

interface RestaurantsProps {
    data: Restaurant;
    city: string;
    discount: number;
    setDismissOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    timeDiscountId: string;
}

interface RenderRestaurantsState {
    imgUrl: string;
    imgLoading: boolean
}


const RenderRestaurants: React.FC<RestaurantsProps> = ({
    data, 
    city , 
    discount,
    setDismissOverlay,
    timeDiscountId
}) => {

    const[imgUrl , setImgUrl] = useState('')
    const[imgLoading , setImgLoading] = useState(true)
   
    useEffect(()=>{

        if (data.mainImageUrl) {
            setImgUrl(data.mainImageUrl)
            setImgLoading(false)
            }
        else {
            const url = `https://d3eiw2rs38fo3w.cloudfront.net/public/${ data.uploadedImages[0]}`;
            setImgUrl(url.toString())
            setImgLoading(false)
        }
}, []) 


        return (
            <View
                style={{
                    marginBottom: height * 0.18,

                    width: width * 0.9,
                    backgroundColor: '#fff',
                    elevation: 7,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexDirection: 'row',
                }}
            >
                {
                    imgLoading ?
                        <View style={{
                            width: 150,
                            overflow: 'hidden',
                        }}>
                            <ActivityIndicator style={{ flex: 1 }} size={30} color={'#d20000'} />
                        </View> :
                        <Image
                            source={{ uri: imgUrl }}
                            style={{
                                width: 150,
                                overflow: 'hidden',
                            }}
                        >
                            <View
                                style={{
                                    marginRight: 20,
                                    paddingHorizontal: 5,
                                    backgroundColor: '#fff',
                                    opacity: 0.8,
                                    paddingVertical: 5,
                                    alignSelf: 'flex-end',
                                    borderBottomLeftRadius: 7,
                                    borderBottomRightRadius: 7,
                                    flexDirection:'row',
                                    alignItems:'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: 18,
                                        color: '#000',
                                    }}
                                >
                                    {data.rating ? data.rating.toFixed(1) : 0}
                                </Text>

             <Entypo name='star' color={'black'} size={20} style={{ marginBottom: 5 }} />

                            </View>
                        </Image>
                }

                <View
                    style={{
                        flex: 1,
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#000',
                            textAlign: 'justify',
                            paddingLeft:2
                        }}
                    >
                        { data.name}
                    </Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 15, top: 5 }} onPress={() =>  setDismissOverlay(true)} >
                        <Ionicons name='close' size={20} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14,
                            color: '#7a7a7a',
                            paddingLeft:2
                        }}
                    >
                        { data.address}
                        {/* { data.city.name} */}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <SimpleLineIcons name="location-pin" color="#7a7a7a" size={15} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    color: '#000',
                                    paddingLeft: 5,
                                }}
                            >
                                {( data.distance / 1000).toFixed(1)} km
                            </Text>
                        </View>
                        {/* <View
                            style={{
                                marginLeft: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="md-time" color="#7a7a7a" size={18} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    color: '#000',
                                }}
                            >
                                { data.duration > 3600 ? (( data.duration / 3600).toFixed(1) + ' hr' + (( data.duration % 3600) / 60).toFixed(1) + ' min') : (( data.duration / 60).toFixed(1)) + 'mins'}
                            </Text>
                        </View> */}
                    </View>
                    <Ripple
                        rippleColor="#d20000"
                        onPress={() => {
                            router.push({
                                pathname: '/CreateOrder/', params: {
                                    // timeDiscounts:  timeDiscounts,
                                    imageUri:  data.mainImageUrl ?  data.mainImageUrl :  data.uploadedImages[0],
                                    id:  data.id,
                                    longitude:  data.longitude,
                                    latitude:  data.latitude,
                                    name:  data.name,
                                    city:  city,
                                    rating:  data.rating ?  data.rating : '0',
                                    discount:  discount,
                                    timeDiscountId:  timeDiscountId,
                                    instantEat: "true",
                                    noSlotsToday: "false",
                                    nextDay: new Date().getTime(),
                                    address : data.address
                                }
                            })
                        }
                        }
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 5,
                            borderRadius: 7.5,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#d20000',
                            paddingVertical: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'Poppins-SemiBold',
                                color: '#d20000',
                            }}
                        >
                            Book Now
                        </Text>
                    </Ripple>
                </View>
            </View>
        );
    }


export default RenderRestaurants;

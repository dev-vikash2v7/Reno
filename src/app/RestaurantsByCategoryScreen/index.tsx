import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Platform, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from 'src/components/Common/Header';
import RenderRestaurants from 'src/components/Home/RenderRestaurants';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import { BrandTile, Restaurant, TimeDiscount } from 'src/types/interfaces';
import { router, useLocalSearchParams } from 'expo-router';
import { getRestaurantsByCategory } from 'src/services/restaurants.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import * as Storage from 'aws-amplify/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux_store/store';

import { setRestaurantsByCategory } from 'src/redux_store/reducers/restaurent.reducer';
import { mixpanel } from '../Login';

Amplify.configure(awsconfig);

const RestaurantsByCategoryScreen: React.FC<any> = ({ route, navigation }) => {

    const category = useSelector((state:RootState) => state.restaurent.restaurantsByCategory)
    const [loading, setLoading] = useState(false);
    const data  = category?.restaurants

    const dispatch = useDispatch()

    useEffect(() => {
        mixpanel.track('opened RestaurantsByCategoryScreen' , {  category} )
    }, []);

    const renderRestaurants = () => {
        
        if (loading) return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={'#404040'} size={36} />
        </View>
        );

        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}

                data={ data}

                contentContainerStyle={{ paddingTop: 15 }}

                renderItem={({ item }) => {
                    const day = getDayFromNumber(new Date().getDay());
                    let timeDiscounts: TimeDiscount[] = [];
                    for (let timeDiscount of item.timeDiscount) {
                        if (timeDiscount.day.toUpperCase() === day.toUpperCase()) {
                            timeDiscounts.push(timeDiscount);
                        }
                    }
                    let noSlotsToday = false;
                    let j = new Date().getTime();
                    if (!timeDiscounts.length) {
                        let t1 = item.timeDiscount;
                        noSlotsToday = true;
                        let today = new Date().getDay();
                        let nextDay = new Date();
                        const i = today;
                        today = (today + 1) % 7;
                        while (today !== i) {

                            j += 24 * 60 * 60 * 1000;
                            timeDiscounts = t1.filter(t => t.day.toUpperCase() === getDayFromNumber(today).toUpperCase());
                            if (timeDiscounts.length) {
                                break;
                            }
                            today = (today + 1) % 7;
                        }
                        if (!timeDiscounts.length) {
                            timeDiscounts = item.timeDiscount.filter((t) => {
                                t.day.toUpperCase() === getDayFromNumber(i).toUpperCase();
                            })
                        }
                        if (!timeDiscounts.length) {
                            return null
                        }
                    }

                    return (
                        <RenderRestaurants
                            nextDay={j}
                            noSlotsToday={noSlotsToday}
                            id={item.id}
                            name={item.name}
                            timeDiscounts={timeDiscounts}
                            hasPickup={item.hasPickup}
                            images={item.images}
                            longitude={item.longitude}
                            latitude={item.latitude}
                            rating={item.rating}
                            image={item.mainImageUrl}
                            setLoading={setLoading}
                            address={item.address}
                            aov={item.aov}
                            distance={item.distance}
                            uploadedImages={item.uploadedImages}
                            guest={false} />
                    );
                }}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1  , backgroundColor:'#fff' , paddingBottom:20}}>
            <Header
                onBack={() => {
                    dispatch(setRestaurantsByCategory(null))

                    router.back()
                }}
                text={category?.name}
            />
            {renderRestaurants()}
        </SafeAreaView>
    );
};

export default RestaurantsByCategoryScreen;

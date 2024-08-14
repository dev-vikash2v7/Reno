import React, { Component, FC, useEffect, useState } from 'react';
import { Text, View, FlatList, Platform, StatusBar } from 'react-native';
import Image from 'react-native-fast-image';
import { width } from '../../constants';

import { Searchbar } from 'react-native-paper';
import Header from 'src/components/Common/Header'

import RestaurantTypes from 'src/components/search/RestaurantTypes';

import { getRestaurantCategoriesByCity, getRestaurantsByCategory, getRestaurantsByCity } from 'src/services/restaurants.service';
import { ActivityIndicator } from 'react-native-paper';
// import { connect } from 'react-redux';
import Ripple from 'react-native-material-ripple';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant, RestaurantCategory } from 'src/types/interfaces';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from '../Login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import { setAllRestaurentsByCity } from 'src/redux_store/reducers/restaurent.reducer';
import { Entypo } from '@expo/vector-icons';

let data: Restaurant[] | null = null;
const SearchScreen: FC = (item: any): JSX.Element => {

  const [loading, setLoading] = useState<boolean>(false);
  const [catloading, setCatLoading] = useState<boolean>(false);

  const [category, setCategory] = useState<RestaurantCategory[] >([]);
  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState<string|null>(null);
  
  const { allRestaurentsByCity } = useSelector((state : RootState) => state.restaurent)
  const [restaurant, setRestaurant] = useState<Restaurant[]>(allRestaurentsByCity);


const dispatch = useDispatch()
  
  const fetchRestaurants = async () => {
    setLoading(true);
    if(allRestaurentsByCity.length == 0 ) {
      const new_restaurants = await getRestaurantsByCity();
      setRestaurant(new_restaurants);
      dispatch(setAllRestaurentsByCity(new_restaurants))
    }
    setLoading(false);

  }
  

async function fetchCategories(){
  
try{

  setCatLoading(true)
  const all_categories  : RestaurantCategory[]  = await getRestaurantCategoriesByCity();
  
  const categoriesWithRestaurants = all_categories.map(category => (
    {
    ...category,
    restaurants: restaurant.filter(restaurant => restaurant.categoryId === category.id)
  })).filter(category => category.restaurants.length > 0);;
  
setCategory(categoriesWithRestaurants)

setCatLoading(false)
}
catch(err){
  console.error('EEEEEee' , err)
}
setCatLoading(false)


}

  useEffect(() => {

    async function fetch() {
      setLoading(true)
     await fetchRestaurants()
     await fetchCategories()

     setCity(await AsyncStorage.getItem('city'))

     setLoading(false)

    }
fetch()

  }, []);


  const searchFilterFunction = _.debounce((searchText) => {

    if (data && data.length) {

      const newdata = data.filter((item) => {
        const itemUp = item.name.toUpperCase();
        const searchUp = searchText.toUpperCase();
        return itemUp.includes(searchUp);
      });
      mixpanel.track('searched up', { searchText });
      setRestaurant(newdata);
    }
  }, 350);

  function onSearchResultPress(item: any) {

    mixpanel.track('opened restaurant', { 
      id: item.id,
      name: item.name, 
      timeSlotSelected: item.timeDiscounts ,
      city :item.city,
      rating: item.rating,
      discount: item.timeDiscounts,
      distance : item.distance,
     });

    router.push({
      pathname: '/CreateOrder/', params: {
        imageUri: item.image,
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        name: item.name,
        city: item.city!,
        noSlotsToday: 'false',
        nextDay: 0,
        rating: item.rating ? item.rating.toString() : '0',
      }
    })
  }

  function renderLoading() {
    if (!loading) return;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} color="#404040" size={36} />
        </View>
      </View>
    );
  }

  function renderSearchBar() {
    if (loading) return;

    return (
      <Searchbar
        onChangeText={async (text) => {
          setSearchText(text);
          searchFilterFunction(text);
        }}
        value={searchText}
        style={{
          marginTop: 10,
          width: width * 0.87,
          height: 50,
          marginBottom: 10,
          alignSelf: 'center',
          backgroundColor: '#fff',
          shadowOpacity: 0.25,
          borderRadius: 10,
          borderColor: 'black',
          borderWidth: 1,
        }}
        placeholder='Search for "Restaurants"'
        placeholderTextColor="#D1D1D1"
        inputStyle={{
          color: '#3E3E3E',
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
          paddingBottom: 5
        }}
        autoFocus={false}
        selectionColor="#d20000"
      />
    );
  }

  function renderSearchList() {
    if (loading) return;
    // console.log(this.item.search.restaurantTypes, 1000);
    if (searchText === '' && category) {
      return (
        catloading ? <ActivityIndicator size={30} color='#d20000' /> :    <RestaurantTypes types={category} />
      );
    }


    return (
      <FlatList 
      keyboardShouldPersistTaps="handled"
        data={restaurant}
        renderItem={({ item }) => {
          return (

         ( item.rating && item.mainImageUrl.length > 0)  &&


            <Ripple
              style={{
                flexDirection: 'row',
                paddingHorizontal:15,
                marginBottom:20,
                marginTop:5,
              }}
              onPress={() => onSearchResultPress(item)}>


              <Image
                source={{ uri: item.mainImageUrl }}
                style={{ height: 100, width: width * 0.34, borderRadius: 10 ,marginRight:5}}
                resizeMode="cover"
              />


              <View
                style={{
                  width: width * 0.4,
                  marginLeft:3,
                  marginRight:5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 15,
                    color: '#000',
                    // flex:1,
                    flexWrap:'wrap'
                  }}>
                  {item.name } 
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#7a7a7a',
                    fontSize: 14,
                  }}>
                  {city ? city : ''}
                </Text>
              </View>




               <View style={{ position: 'absolute', right: 0, top: 0, backgroundColor:  item.rating > 4 ? 'green' :  item.rating > 3 ? 'orange' : 'red', height: 35, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row' , marginLeft:5 , marginRight:10}}>
            <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Poppins-SemiBold' }}>
              { item.rating ?  item.rating.toFixed(1) : 0}
            </Text>
            <Entypo name='star' color={'white'} size={17} style={{ marginBottom: 5 }} />
            </View>


            </Ripple>
          );
        }}
        //enableEmptySections={true}
        style={{ marginTop: 10 }}
      //keyExtractor={(item, index) => index}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header text="Search" onBack={()=>{router.back()}}/>
      {renderLoading()}
      {renderSearchBar()}
      {renderSearchList()}
    </SafeAreaView>
  );
}

export default SearchScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRequest, postRequest } from './index';
import { Restaurant, RestaurantCategory } from 'src/types/interfaces';
import { getDistance } from 'geolib';

export async function getAllCities() {
  return await getRequest(`/consumer/cities`);
}

export async function getRestaurantsByCity(): Promise<Restaurant[]> {
  const cityName = await AsyncStorage.getItem('city');
  const res  = await getRequest(`/consumer/restaurants?cityName=${cityName}`)


  // console.log('res.data' ,  res.data , res.data.restaurantList)

  return  res.data.restaurantList
}



export async function getRestaurantCategoriesByCity(): Promise<RestaurantCategory[]> {
  const cityName = await AsyncStorage.getItem('city');
  return (await getRequest(`/consumer/categories?cityName=${cityName}`)).data.restaurantCategory;
}

export async function getRestaurantsByCategory(categoryId: string) {
  return await postRequest('/consumer/categories-restaurants', { categoryId });
}



export async function getBrandTilesByCity() {
  const cityName = await AsyncStorage.getItem('city');
  return (await postRequest(`/common/brandTiles`, { cityName }));
}


export async function getTodaysRestaurant(day: string) {
  return await postRequest('/consumer/todays-restaurants', { day });
}


export async function getRestaurantDetails(id: string) {
  return await postRequest('/consumer/restaurant-details', { id });
}



export  function getNearbyRestaurants( longitude: number, latitude: number , restaurants : Restaurant[]) {

  

  const activeRestaurants = restaurants.filter(rest =>  rest.latitude && rest.longitude && (rest.shutdown ? 0 : 1));

  // Calculate distances between user coordinates and restaurant coordinates
  const restaurantsWithDistances = activeRestaurants.map(rest => {
      const distance = getDistance(
          { latitude: parseFloat(latitude?.toString()!), longitude: parseFloat(longitude?.toString()!) },
          { latitude: parseFloat(rest.latitude!.toString()), longitude: parseFloat(rest.longitude!.toString()) }
      );
      return { ...rest, distance };
  });

  // Sort restaurants based on distance
  const sortedRestaurants = restaurantsWithDistances.sort((a, b) => a.distance - b.distance);

  return restaurantsWithDistances
}



// export async function getNearbyRestaurants(city: string, longitude: string, latitude: string , restaurants : Restaurant) {
//   return await getRequest(`/common/nearby?city=${city}&longitude=${longitude}&latitude=${latitude}`);
// }

export async function getRestaurantDistanceWithUser(rest_lat: string, rest_long: string, user_lat: string , user_long : string) {
  return await getRequest(`/common/getRestaurantDistanceWithUser?rest_lat=${rest_lat}&rest_long=${rest_long}&user_lat=${user_lat}&user_long=${user_long}`);
}
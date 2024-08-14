import { Restaurant } from 'src/types/interfaces';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Chip } from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler'
import { wp } from 'src/app/Login';

interface FilterProps{
    unfilteredRestaurants : Restaurant[],
    filter : { pubs: boolean, casual: boolean, luxury: boolean },
     setFilter : React.Dispatch<React.SetStateAction<{ pubs: boolean, casual: boolean, luxury: boolean }>>,
     setRestaurants : React.Dispatch<React.SetStateAction<Restaurant[] >>,
}
const Filters: React.FC<FilterProps> = ({
    unfilteredRestaurants,
    filter,
     setFilter,
     setRestaurants,

}) => {


  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' , left : wp('28%') , position:'absolute', width:wp('62%')}}>
      
                          <Chip mode='outlined' selectedColor='#d20000' showSelectedOverlay={true} selected={filter.pubs} style={styles.filterChip} onPress={() => {
                            if (!filter.pubs) {

                              setRestaurants(unfilteredRestaurants.filter((restaurant) => {
                                return restaurant.restaurantCategoryOnRestaurant ? restaurant.restaurantCategoryOnRestaurant.some((cate) => cate.restaurantCategory.name.includes('Bar')) : restaurant.name.includes("Bar");
                              }))
                            }
                            else {
                              setRestaurants(unfilteredRestaurants);
                            }
                            setFilter({ pubs: !filter.pubs, luxury: false, casual: false });
                          }}>Pubs and Bars</Chip>


                          <Chip mode='outlined' selectedColor='#d20000' showSelectedOverlay={true} selected={filter.casual} style={styles.filterChip} onPress={() => {
                            if (!filter.casual) {
                              setRestaurants(unfilteredRestaurants.filter((restaurant) => {
                                return restaurant.aov ? restaurant.aov <= 500 : false;
                              }))
                            }
                            else {
                              setRestaurants(unfilteredRestaurants);
                            }
                            setFilter({ casual: !filter.casual, luxury: false, pubs: false });
                          }}>Budget EatOut</Chip>


                          <Chip mode='outlined' selectedColor='#d20000' showSelectedOverlay={true} selected={filter.luxury} style={styles.filterChip} onPress={() => {
                            if (!filter.luxury) {
                              setRestaurants(unfilteredRestaurants.filter((restaurant) => {
                                return restaurant.aov ? restaurant.aov > 500 : false;
                              }))
                            }
                            else {
                              setRestaurants(unfilteredRestaurants);
                            }
                            setFilter({ casual: false, luxury: !filter.luxury, pubs: false });
                          }}>Fine Dining</Chip>


                        </ScrollView>

  )
}

export default Filters



const styles = StyleSheet.create({
    
    filterChip: {
      marginLeft: wp('1%'),
      backgroundColor: "white"
    },

   

  })
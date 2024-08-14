// ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { RestaurantState } from '../type';

const initialState : RestaurantState = {
  allRestaurentsByCity : [],
  allRestaurantsCategories : [],
  restaurantsByCategory : null,
  allOnGoingOrders :[], 
  userOrders :[], 
  timeDiscount : null,
  changeRestaurant : null

} ;



const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {

    
    setAllRestaurentsByCity: (state, action) => {
        state.allRestaurentsByCity = action.payload;
    },

    setChangeRestaurant: (state, action) => {
        state.changeRestaurant = action.payload;
    },

    updateTimeDiscount: (state, action) => {
        state.timeDiscount = action.payload;
    },
   
    // setAllNearbyRestaurent: (state, action) => {
    //     state.allNearbyRestaurents = action.payload;
    // },
    setAllRestaurantsCategories: (state, action) => {
        state.allRestaurantsCategories = action.payload;
    },
    setRestaurantsByCategory: (state, action) => {
        state.restaurantsByCategory = action.payload;
    },

    setAllOnGoingOrders: (state, action) => {
      state.allOnGoingOrders = action.payload.data;
    }   ,
 
    setUserOrders: (state, action) => {
      state.userOrders = action.payload;
    }   ,


    addUserOrders: (state, action) => {
      // state.userOrders.push(action.payload)
      state.allOnGoingOrders.push(action.payload)
    }   ,

    removeUserOrders: (state, action) => {

      // let a = state.userOrders.filter(elm =>  elm.id != action.payload.id )
      let b = state.allOnGoingOrders.filter(elm =>  elm.id != action.payload.id )
      // state.userOrders = a;
      state.allOnGoingOrders  = b;
    } ,


    UnlockUserOrder: (state, action) => {

      let a = state.allOnGoingOrders 
      
      // console.log('unlcok user order : ' , action.payload)

      a.map(elem => {
        
        if(elem.id == action.payload.id){
              elem.status = 'Unlocked'
              elem.unlockLocation = action.payload.location
              return
        }
      })
      // state.userOrders = a;
      state.allOnGoingOrders  = a;
    } ,





  }
});

export const { setAllRestaurentsByCity   , setAllRestaurantsCategories ,setRestaurantsByCategory ,setAllOnGoingOrders  , addUserOrders , removeUserOrders , UnlockUserOrder ,setUserOrders , updateTimeDiscount ,setChangeRestaurant} = restaurantSlice.actions;

export default restaurantSlice.reducer;

// ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../type';


const initialState : UserState = {
  name: '',
  email: '',
  phone: '',
  profileImg : '',
  city : null,
  coordinates : {
    latitude: 0,
    longitude: 0,
    location_map_url : ''
  },
  jwtToken : null
} ;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    
    setUser: (state, action) => {
      const { name , profileImg , city , jwtToken} = action.payload;
      state.name = name;
      // state.email = email;
      // state.phone = phone;
      state.profileImg = profileImg;
      state.city = city,
      state.jwtToken = jwtToken 
    },
    
    setCoordinates: (state, action) => {
      const { latitude , longitude  , location_map_url} = action.payload;
      state.coordinates.latitude = latitude;
      state.coordinates.longitude = longitude;
      state.coordinates.location_map_url = location_map_url;

    },
 
    setCity: (state ,action)=>{
      state.city = action.payload
}   ,
    setProfileImg: (state ,action)=>{
      state.profileImg = action.payload
}   ,
    setLogout: (state ,action)=>{
      state 
}   ,
    
  }
});

export const { setUser , setCoordinates , setCity, setProfileImg } = userSlice.actions;
export default userSlice.reducer;




import { Restaurant } from 'src/types/interfaces';
import React, { useState} from 'react';

import { Searchbar } from 'react-native-paper';
import { width } from 'src/constants';
import { hp, wp } from 'src/app/Login';

interface Props{
    unfilteredRestaurants : Restaurant[],
     setRestaurants : React.Dispatch<React.SetStateAction<Restaurant[] >>,
}
const Search: React.FC<Props> = ({
    unfilteredRestaurants,
     setRestaurants,

}) =>{


    const [searchTerm, setSearchTerm] = useState('');
  

    const handleSearch = (searchTerm :string) => {

      setSearchTerm(searchTerm);
  
      // Perform search logic here
      const filteredRestaurants = unfilteredRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      setRestaurants(filteredRestaurants);
    };
  
  return (
    <>
   

<Searchbar
        onChangeText={async (text : string) => {
          handleSearch(text);
        }}
        value={searchTerm}
        style={{
          width: wp('90%'),
          // height: 40,
          marginBottom: hp('3%'),
          alignSelf: 'center',
          backgroundColor: '#fff',
          shadowOpacity: 0.25,
          borderRadius: hp('1.1%'),
          borderColor: 'black',
          borderWidth: 1,
          alignItems :'center',
          alignContent:'center',
          justifyContent:'center',
      
        
        
          
        }}
        iconColor='red'
        placeholder='Search for "Restaurants"'
        placeholderTextColor="#D1D1D1"
      elevation={1}

      

        inputStyle={{
          color: '#000',
          // fontFamily: 'Poppins-Regular',
          fontSize: hp('2.2%'),
          // paddingBottom: 5

        }}
        autoFocus={false}
        selectionColor="#d20000"
      />

   
    </>
  // </TouchableOpacity>
  )
}

export default Search
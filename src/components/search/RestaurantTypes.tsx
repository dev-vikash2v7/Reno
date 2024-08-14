import React, { Component, FC } from 'react';
import { Text, View, FlatList, StyleSheet, GestureResponderEvent, ScrollView, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Image from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import { RestaurantCategory } from 'src/types/interfaces';
import { useRouter } from 'expo-router';
import { mixpanel } from 'src/app/Login';
import { useDispatch } from 'react-redux';
import { setRestaurantsByCategory } from 'src/redux_store/reducers/restaurent.reducer';
import { SearchBar, Card, ListItem, Icon, Button } from '@rneui/base';

export const width = Dimensions.get('screen').width;

const RestaurantTypes: FC<{ types: RestaurantCategory[] }> = (props): JSX.Element => {


 
  const router = useRouter();
  const dispatch = useDispatch();




  const handleCard = (item:RestaurantCategory) =>{

    dispatch(setRestaurantsByCategory(item))
    mixpanel.track('opened category', { name: item.name });
    router.push({
      pathname: '/RestaurantsByCategoryScreen/',
    })
  }

  
  const renderCategoryCard = (item: RestaurantCategory) => (
    <Card key={item.id} containerStyle={{marginBottom: 20, 
      elevation: 4, 
      paddingHorizontal: 8, 
      shadowColor: '#000', 
      // shadowOffset: { width: 0, height: 1 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 2,
      height: 190, // Adjust the height according to your design
      width: '40%', // Adjust the width to make it fit two cards in a row
      alignItems: 'center', // Align items to center
      borderRadius:10,
      
    }}
    
    >
      <TouchableOpacity onPress={() => handleCard(item)}>
    <Card.Image  source={{ uri: item.imageUrl }} 
      style={{ width: 120, height: 100 }} // Set image width and height
      resizeMode="cover" // Resize mode to cover the entire image
      />
    <Text 
      style={{ 
        marginBottom: 10, 
        textAlign: 'center', 
        fontFamily: 'Poppins-Medium', 
        fontSize: 16 // Decrease the font size
      }}
    >
      {item.name}
    </Text>
{/*    
    <Button
      buttonStyle={{ 
        width: '100%', 
        backgroundColor: '#d20000', // Set background color to transparent

      }} 
      containerStyle={{ 
        position: 'relative', 
        top: 0, 
        width: '100%', 
        alignItems: 'center', 
        // paddingBottom: 10 // Adjust padding bottom as needed
      }} 
      onPress={() => handleCard(item)}
    >
  </Button> */}
  <Icon
    name='arrow-forward'
    type='ionicon'
    color='white'
    size={30} // Adjust icon size as needed
    onPress={() => handleCard(item)}
    containerStyle={{marginBottom:10 ,paddingBottom:10}}
    backgroundColor={'#d20000'}
  />
  </TouchableOpacity>
  </Card>
  );
 

  const renderCategories = () => {
    return props.types.map((item) => {
      return renderCategoryCard(item);
    });
  };
  
  return (
    <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10  , alignItems:'center',  }}>
      {renderCategories()}
    </ScrollView>
  );
}

export default RestaurantTypes;

const styles = StyleSheet.create({
  headingText: {
    color: '#707070',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center'
  },
  rippleView: {
    height: 120,
    flexDirection: 'column',
    margin: 8,
    // flex: 1,
    alignSelf: 'center',
    borderRadius: 6,
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  imageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  imageText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight:'400'
  },
});

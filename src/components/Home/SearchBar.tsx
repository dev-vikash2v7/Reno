import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { mixpanel } from 'src/app/Login';

const SearchBar = ({guest}) => {
  return (
    <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      if (guest && guest.toString() === '1') {
        router.push('/Login/');
        return;
      }
      mixpanel.track('opened search');
      router.push('/Search/')
    }}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#A0A0A0',
      flex: 1,
      marginVertical: 15,
      marginHorizontal: 20,
    }}>
    <Ionicons name="search" color={'#A0A0A0'} size={14} />
    <Text
      style={{
        fontFamily: 'Poppins-Regular',
        color: '#A0A0A0',
        fontSize: 14,
        marginLeft: 5,
      }}>
      Search
    </Text>
  </TouchableOpacity>
  )
}

export default SearchBar
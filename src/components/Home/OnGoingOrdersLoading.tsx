import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
// import SkeletonLoading from 'react-native-skeleton-loading'
// import SkeletonContent from 'react-native-skeleton-content';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { FadeIn, Layout } from 'react-native-reanimated';
import { Animated } from 'react-native';
import { ScrollView } from 'react-native';
import { width } from 'src/constants';

const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
        type: 'timing',
        duration: 200,
    },
    backgroundColor: '#D4D4D4',
} as const;


const OnGoingOrdersLoading = () => {
  return (
  
 
    <Animated.View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:10
            }}>
    <FlatList
    data={[1]}
    contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center'
    }}
    style={{
        width: Dimensions.get('screen').width - 40,

        // borderWidth: 1,
        borderRadius: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        // padding: 2
        marginTop: 10
    }}
    renderItem={({ item, index }) => {
        return (
            <Skeleton width={Dimensions.get('screen').width - 40} height={120} {...SkeletonCommonProps} />
        )
    }}


/>

</Animated.View>
  )
}

export default OnGoingOrdersLoading


const styles = StyleSheet.create({
  sortByStyle2: {
      borderWidth: 1,
      borderColor: '#d20000',
      height: 36,
      top: '42%',
      width: '30%',
      position: 'absolute',
      zIndex: 2,
      borderRadius: 10,
      backgroundColor: 'white',
      // elevation: 15,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 5 },
      // shadowOpacity: 0.5,
      // shadowRadius: 2,
      justifyContent: 'center'
  },
  filterChip: {
      marginLeft: 10,
      backgroundColor: "white"
  },
})
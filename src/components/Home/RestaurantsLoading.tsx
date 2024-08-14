import React from 'react'
import { FlatList } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { Animated } from 'react-native';
import { width } from 'src/constants';

const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
        type: 'timing',
        duration: 1500,
    },
    backgroundColor: '#D4D4D4',
} as const;


const RestaurantsLoading = () => {
  return (
    <Animated.View>
    <Animated.View style={{ width: width, alignItems: 'center' }}>
        <Animated.View style={{
            width: width * 0.9,
            alignSelf: 'center',
            marginBottom: 20,
            borderRadius: 15,
            backgroundColor: '#fff',
            height: 320,
            elevation: 7,
            shadowColor: '#000',
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.2,
        }}>
            <Skeleton height={(width * 7) / 16} width={'100%'} {...SkeletonCommonProps} >
            </Skeleton>
            <Animated.View style={{ flexDirection: 'row', position: 'absolute', top: 185, left: 10, width: '95%', justifyContent: 'space-between' }}>
                <Skeleton  {...SkeletonCommonProps} height={25} width={200}>

                </Skeleton>
            </Animated.View>
            <Animated.View style={{ flexDirection: 'row', position: 'absolute', top: 225, left: 10, width: '95%', justifyContent: 'space-between' }}>
                <Skeleton  {...SkeletonCommonProps} height={18} width={75} />
                <Skeleton  {...SkeletonCommonProps} height={18} width={75} />
                {/* <Skeleton  {...SkeletonCommonProps} height={20} width={75} /> */}
            </Animated.View>
            <FlatList
                horizontal
                style={{ left: 10, marginRight: 10, position: 'absolute', bottom: 10 }}
                data={[1, 2, 3]}
                renderItem={({ item, index }) => {
                    return (
                        <Animated.View style={{
                            marginLeft: index === 0 ? 5 : 15,
                            marginTop: 20,
                            marginRight: 4,
                        }}>
                            <Skeleton height={55} width={55} show {...SkeletonCommonProps} />
                        </Animated.View>
                    )
                }}
            />
        </Animated.View>
    </Animated.View>
</Animated.View>
  )
}

export default RestaurantsLoading
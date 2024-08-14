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
        duration: 1500,
    },
    backgroundColor: '#D4D4D4',
} as const;





const Loading = () => {
    return (
        <Animated.View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:25
            }}>
            <Animated.View style={{ alignItems: 'center' }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>

                            <Animated.View style={{ zIndex: 20 }}>
                                <Skeleton.Group show >
                                    <Animated.View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            // paddingHorizontal: 10,
                                            paddingVertical: 5,
                                            borderRadius: 10,
                                            // borderWidth: 1,
                                            // borderColor: '#A0A0A0',
                                            flex: 1,
                                            marginVertical: 15,
                                            marginHorizontal: 20,
                                        }}>
                                        <Skeleton
                                            // height={70}
                                            // width={70}
                                            height={35}
                                            width={Dimensions.get('screen').width - 40}
                                            // height={20}
                                            {...SkeletonCommonProps}>
                                        </Skeleton>
                               
                                    </Animated.View>
                                </Skeleton.Group>




                                <FlatList
                                    data={[1, 2, 3]}
                                    style={{
                                        marginLeft: 20,
                                        // marginRight: 25
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal
                                    renderItem={({ item }) => {
                                        return (

                                            <Animated.View
                                                style={{
                                                    height: (168 * 3) / 3.7,
                                                    width: (Dimensions.get('screen').width - 60) / 2.5,
                                                    borderRadius: 12,
                                                    backgroundColor: '#fff',
                                                    marginRight: 20,
                                                    marginTop: 15,
                                                    marginBottom: 10,
                                                    elevation: 10,
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 5 },
                                                    shadowOpacity: 0.5,
                                                    shadowRadius: 2,
                                                    overflow: 'hidden',
                                                }}>
                                                <Skeleton height={'100%'} width={'100%'}  {...SkeletonCommonProps} >
                                                </Skeleton>
                                            </Animated.View>
                                        )
                                    }}
                                />



                                
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
                                        marginLeft: 20,
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

                                
                                <Animated.View
                                    style={{
                                        marginLeft: 20,
                                        height: 100,
                                        marginRight: 20,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        zIndex: 20
                                    }}>
                                    <Skeleton width={200} height={30} {...SkeletonCommonProps}>
                                    </Skeleton>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', position: 'absolute', top: '42%', left: '30%', width: '70%' }}>
                                        <Animated.View style={styles.filterChip}>

                                            <Skeleton height={35} width={100} {...SkeletonCommonProps} >
                                            </Skeleton>
                                        </Animated.View>
                                        <Animated.View style={styles.filterChip}>

                                            <Skeleton height={35} width={100} {...SkeletonCommonProps} >
                                            </Skeleton>
                                        </Animated.View>
                                    </ScrollView>
                                    <Animated.View style={[styles.sortByStyle2, { borderWidth: 0 }]} >
                                        <Skeleton height={35} width={'100%'} {...SkeletonCommonProps} >

                                        </Skeleton>
                                    </Animated.View>
                                </Animated.View>
                            </Animated.View>



                            <FlatList
                                ListFooterComponent={<View style={{ height: 30 }} />}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={10}
                                data={[0, 1]}
                                renderItem={({ item, index }) => {

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
                                    );
                                }}
                            />

                        </>
                    }
                    renderItem={() => <></>}
                    data={null}
                />
            </Animated.View>
        </Animated.View>
    )
}

export default Loading;

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
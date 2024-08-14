import React from 'react'
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { normalizeScale } from 'src/types/utils';

const { height, width } = Dimensions.get('window');
const size = 13


const Star = ({size}) => {
  return (
    <View style={styles.twelvePointBurst} >
                                    <View
                                        style={[styles.twelvePointBurstMain,
                                        ]}
                                    />
                                    <View
                                        style={[styles.twelvePointBurst30,
                                        ]}
                                    />
                                    <View
                                        style={[styles.twelvePointBurst60,
                                        ]}
                                    />
                                    <View style={[{ position: 'absolute', left: PixelRatio.getFontScale(), top: 5, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 10,
                                                // marginLeft: 3,
                                                fontFamily: 'OpenSans-Medium',
                                                color: '#fff',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '800'
                                            }}>
                                            {item.TimeSlot.time}
                                        </Text>

                                    </View>
                                    </View>
  )
}




const styles = StyleSheet.create({

    dateFilter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
    },
    closeButton: {
        position: 'relative',
        top: -10,
        right: 10,
    },

    calendar: {
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },

    twelvePointBurst: {
        margin: 10
    },
    twelvePointBurstMain: {
        width: normalizeScale(width / size),
        height: normalizeScale(width / size),
        borderRadius: 3,
        backgroundColor: '#d20000',
    },
    twelvePointBurst30: {
        width: normalizeScale(width / size),
        height: normalizeScale(width / size),
        borderRadius: 3,
        position: 'absolute',
        backgroundColor: '#d20000',
        transform: [{ rotate: '30deg' }],
    },
    twelvePointBurst60: {
        width: normalizeScale(width / size),
        height: normalizeScale(width / size),
        borderRadius: 3,
        position: 'absolute',
        backgroundColor: '#d20000',
        transform: [{ rotate: '60deg' }],
    },


})

const style = {
    textColor: '#6b6a6a',
    fontSize: 14
}


export default Star
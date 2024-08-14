import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { hp, wp } from 'src/app/Login';

interface SortByProps {
    isSorting: boolean;
    setIsSorting:  React.Dispatch<React.SetStateAction<boolean>>;
    sortName :  string | null ,
    setSortName : React.Dispatch<React.SetStateAction<string | null>>,
}

export enum Sort {
    Distance = "Distance",
    Ratings = "Ratings",
    Discount = "Discount",
    AOV_Price = "Price",
}



const SortBy = ({ isSorting, setIsSorting ,  sortName ,   setSortName  }: SortByProps) => {


    
    
    return (
        <>
            {
                isSorting ?
                    <View style={styles.sortByStyle1}>
                                <TouchableOpacity style={{ backgroundColor: sortName === Sort.Distance ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                    setSortName(Sort.Distance);
                                    setIsSorting(false);
                                }}>
                                    <Text style={{
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: hp('1.8%'),
                                        marginLeft: wp('4%'),
                                        color: sortName === Sort.Distance ? 'white' : 'black'
                                    }}>
                                        Distance
                                    </Text>
                                </TouchableOpacity>




                            <TouchableOpacity style={{ backgroundColor: sortName === Sort.Ratings ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                setSortName(Sort.Ratings);
                                setIsSorting(false);
                            }}>
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: hp('1.8%'),
                                    marginLeft: wp('4%'),
                                    color: sortName === Sort.Ratings ? 'white' : 'black'
                                }}>
                                    Ratings
                                </Text>
                            </TouchableOpacity>





                            <TouchableOpacity style={{ backgroundColor: sortName === Sort.Discount ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                setSortName(Sort.Discount);
                                setIsSorting(false);
                            }}>
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: hp('1.8%'),
                                    marginLeft: wp('4%'),
                                    color: sortName === Sort.Discount ? 'white' : 'black'
                                }}>
                                    Discounts
                                </Text>
                            </TouchableOpacity>







                            <TouchableOpacity style={{ backgroundColor: sortName === Sort.AOV_Price ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                setSortName(Sort.AOV_Price);
                                setIsSorting(false);
                            }}>
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: hp('1.8%'),
                                    marginLeft: wp('4%'),
                                    color: sortName === Sort.AOV_Price ? 'white' : 'black'
                                }}>
                                    Price
                                </Text>
                            </TouchableOpacity>

                    </View > 
                    
                    :
                    // <Modal visible={true} onDismiss={()=>setIsSorting(false)}>

                    <View style={styles.sortByStyle2}>
                        <TouchableOpacity onPress={() => setIsSorting(true)} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: hp('1.8%'),
                                marginLeft: wp('3%'),
                                color: "#d20000",
                                marginRight: sortName ? '2%' : '10%'
                            }}>
                                {
                                    !sortName ? 'Sort' : sortName
                                }
                            </Text>
                            {
                                sortName ? <MaterialIcons onPress={() => {     setSortName(''); setIsSorting(false)}} name='close' size={hp('2.8%')} /> :
                                    <MaterialIcons name='sort' size={hp('3%')} />
                            }
                        </TouchableOpacity>
                    </View>
                    // </Modal>

            }
        </>
    )
}

export default SortBy;

const styles = StyleSheet.create({
    sortModalButtons: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '30%',
        marginLeft: '10%'
    },
    sortModalButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        marginLeft: '2%'
    },
    sortByStyle1: {
        height: 150,
        width: '40%',
        position: 'absolute',
        top: '42%',
        zIndex: 2,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: '#d20000',
        borderWidth: 1,
        justifyContent: 'space-around'
      },
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
        justifyContent: 'center'
      },
      filterChip: {
        marginLeft: 10,
        backgroundColor: "white"
      },
})
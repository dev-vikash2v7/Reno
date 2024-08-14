import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

interface SortByProps {
    isSorting: boolean;
    sortName: string | null;
    setSortName: (a: Sort | null) => void;
    setIsSorting: (a: boolean) => void;
    sortByStyle1: any;
    sortByStyle2: any;
    distance: boolean
}

export enum Sort {
    Distance = "Distance",
    Ratings = "Ratings",
    Discount = "Discount"
}

const SortBy = ({ isSorting, setSortName, setIsSorting, sortName, sortByStyle1, sortByStyle2, distance }: SortByProps) => {
    return (
        <>
            {
                isSorting ?
                    <View style={sortByStyle1}>
                        <>
                            {
                                distance &&
                                <TouchableOpacity style={{ backgroundColor: sortName === Sort.Distance ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                    setSortName(Sort.Distance);
                                    setIsSorting(false);
                                }}>
                                    <Text style={{
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: 14,
                                        marginLeft: '10%',
                                        color: sortName === Sort.Distance ? 'white' : 'black'
                                    }}>
                                        Distance
                                    </Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{ backgroundColor: sortName === Sort.Ratings ? 'rgba(209, 0, 0, 0.73)' : 'white' }} onPress={() => {
                                setSortName(Sort.Ratings);
                                setIsSorting(false);
                            }}>
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 14,
                                    marginLeft: '10%',
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
                                    fontSize: 14,
                                    marginLeft: '10%',
                                    color: sortName === Sort.Discount ? 'white' : 'black'
                                }}>
                                    Discounts
                                </Text>
                            </TouchableOpacity>
                        </>
                    </View > :
                    <View style={sortByStyle2}>
                        <TouchableOpacity onPress={() => setIsSorting(true)} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 14,
                                marginLeft: '10%',
                                color: "#d20000",
                                marginRight: sortName ? '2%' : '10%'
                            }}>
                                {
                                    !sortName ? 'Sort' : sortName
                                }
                            </Text>
                            {
                                sortName ? <MaterialIcons onPress={() => {
                                    setSortName(null);
                                }} name='close' size={20} /> :
                                    <MaterialIcons name='sort' size={23} />
                            }
                        </TouchableOpacity>
                    </View>
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
    }
})
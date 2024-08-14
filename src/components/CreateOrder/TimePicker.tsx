import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Linking,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  BackHandler,
} from 'react-native';
import { height, width } from '../../constants';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import RenderSlots from 'src/components/CreateOrder/RenderSlots';
import { TimeDiscount } from 'src/types/interfaces';


interface Props{
    timeDiscounts : TimeDiscount[],
    time: string, 
    onTimeSlotSelected : (discount: number, time: string, id: string, timeSlotId: string) => void,
    timeDiscountLoading : boolean
}


const TimePicker: React.FC<Props> = ({
    timeDiscounts,
     time,
     onTimeSlotSelected,
     timeDiscountLoading

}) =>{
  return (
    <>
    <Text
      style={{
        marginTop: 15,
        fontFamily: 'Poppins-Regular',
        color: '#000000',
        fontSize: 17,
        marginLeft: 15 + 7,
      }}>
      What time?
    </Text>
    {timeDiscountLoading ? (
      <View
        style={{
          width: width,
          height: 50,
          marginLeft: 10,
          marginTop: 20,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator animating={true} color="#d20000" size="small" />
      </View>
    ) : (
      timeDiscounts?.length ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          style={{ height: 80, marginLeft: 15, marginRight: 15 }}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          data={timeDiscounts.sort((a, b) => a.timeSlot.time < b.timeSlot.time ? -1 : 1)}
          renderItem={({ item }) => {
            return (
              <RenderSlots
                discount={item.discount}
                exhausted={item.exhausted}
                time={item.timeSlot.time}
                timeSlotId={item.timeSlot.id}
                id={item.id}
                backgroundColor={
                  time === item.timeSlot.time
                    ? '#FFA500'
                    : '#d20000'
                }
                callbackFromChild={onTimeSlotSelected}
              />
            );
          }}
        />
      ) : (
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            color: '#d20000',
            fontSize: 16,
            flexWrap: 'wrap',
            textAlign: 'center',
          }}>
          No slots available for this day.
        </Text>
      )
    )}
  </>
  )
}

export default TimePicker
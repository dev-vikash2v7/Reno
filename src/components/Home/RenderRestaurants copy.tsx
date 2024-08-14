import React, { useEffect, useState, useRef } from 'react';
import { Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';
import RenderSlots from './RenderSlots';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { Entypo } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import { hp, mixpanel  ,wp} from 'src/app/Login';
import { width } from 'src/constants';
import { router } from 'expo-router';
import { Restaurant } from 'src/types/interfaces';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

Amplify.configure(awsconfig);

const RenderRestaurants = (props : any) => {

  const city =  props.city
  const [imageIndex, setImageIndex] = useState(0);
  const imagesData  = [props.image, ...props.images];
  const flatListRef = useRef<FlatList<string>>(null);
  const scrollX = new Animated.Value(0);
  const length = imagesData.length;


  // const jsonData = '{"date": "2024-04-15T21:41:17.896Z", "numberOfDays": 2}';

  let formattedDate

  if(props.shutdown){

    
    const { date, numberOfDays } = props.shutdown;
    
    const startDate = moment(date);
    
    const endDate = moment(startDate).add(numberOfDays, 'days');
    
     formattedDate = endDate.format('Do MMMM');
  }
  
  
  // useEffect(() => {

  //   let  scrollInterval = setInterval(() => {

  //       if (flatListRef.current ) {

  //         const nextIndex = (imageIndex + 1) % imagesData.length;
  //         const widthVal = Dimensions.get('window').width;
  //         setImageIndex(nextIndex);
  //         const offset = nextIndex * widthVal;
          
  //             flatListRef.current.scrollToOffset({ offset, animated: true });
  //       }
  //     }, 10000);

  //   return () => clearInterval(scrollInterval);
  // }, []);



  const dispatch = useDispatch()


  
  return (
    <View style={{  flex: 1, alignItems: 'center', justifyContent: 'center' , marginBottom:28  ,  height:305  ,width}}>
    <TouchableOpacity
      activeOpacity={1}
      onPress={async() => {
        
        if ( props.guest) {
          router.push('/Login/');
          return;
        }

        mixpanel.track('opened restaurant', { 
          id:  props.id ,
          name:  props.name, 
          timeSlotSelected:  props.timeDiscounts ,
          city :   city,
          rating:  props.rating,
          discount:  props.timeDiscounts,
          distance :  props.distance,
        });


        // dispatch(setSelectedRestaurant({id : props.id}))
        await AsyncStorage.setItem('selectedId' , props.id)


        router.push({
          pathname: '/CreateOrder/', params: {
            imageUri:  props.image,
            id:  props.id,
            longitude:  props.longitude,
            latitude:  props.latitude,
            name:  props.name,
            city:    city!,
            rating:  props.rating ?  props.rating.toString() : '0',
            noSlotsToday:  props.noSlotsToday.toString(),
            nextDay:  props.nextDay,
            address : props.address
          }
        })
      }}
      style={{
        width: width - 40,
        alignSelf: 'center',
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 7,
        shadowColor: '#000',
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.2,
        minHeight: ((props.name ).length > 25 || (props.address ).length > 25)  ? 300  : 305 ,
        // height:305
        // maxHeight:400
      }}
    >
     
      <FlatList
        ref={ flatListRef}
        keyExtractor={(_, index) => index.toString()}
        data={   imagesData}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x:  scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        pagingEnabled
        horizontal
        decelerationRate={'normal'}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          if (!item) {
            return null;
          }
          return (
            <Image
              source={{ uri: item }}
              style={{
                height: (width * 7) / 16,
                width,
              }}
              resizeMode="cover"
            />
          )
        }}
      />

      {
         length > 1 && <View
          style={{
            position: 'absolute',
            left: width / 2 - 20,
            top: (width * 7) / 16 - 15,
            backgroundColor: 'white',
          }}>
          <ExpandingDot
            data={   imagesData}
            expandingDotWidth={20}
            scrollX={ scrollX}
            inActiveDotOpacity={1}
            dotStyle={{
              width: 9,
              height: 9,
              borderRadius: 5,
              elevation: 10,
              marginHorizontal: 2,
              // borderWidth: 1,
              shadowColor: 'black',
              shadowOffset: { width: 20, height: 20 },
              shadowRadius: 5,
              shadowOpacity: 1
            }}
            activeDotColor='red'
            inActiveDotColor='white'
            containerStyle={{
              top: 0,
            }}
          />
        </View> 
      }


<View style={{ width:width *0.65,flexDirection:'row' , justifyContent:'space-between' , position: 'absolute', top: 170, left: 10 , alignItems:'flex-start' , marginBottom:5}}>

      <View style={{ marginBottom:20   , width:'89%' , marginRight:5  }}>

        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 17,
            color: '#000',
            flexWrap:'wrap',
            marginBottom:0.5
          }}
        >
          { props.name }
        </Text>

        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: 'grey',
          }}
        >
          {/* { props.address.split(' ')[ props.address.split(' ').length - 1]} */}
          { props.address }
        </Text>
      </View>



      <View style={{  flexDirection:'column'  , 

marginRight:8

      }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: 'grey',
          }}
        >
          ₹{ props.aov} for two
        </Text>
        {
           props.distance &&
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: 'black',

              }}
            >
              {( props.distance / 1000).toFixed(1)} KM
            </Text> 
        }
      </View>



      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginRight: 10,marginTop:5 , left:0 , bottom:8  , position:'absolute'  , paddingHorizontal:5 }}
        contentContainerStyle ={{justifyContent:'center' , alignSelf:'center'}}

        //////////////////error - Property is not configuralble///////////////
        data={ props.timeDiscounts ? props.timeDiscounts.sort((a, b) => a.timeSlot.time < b.timeSlot.time ? -1 : 1) :[]}

        keyExtractor={(item) => item.id.toString()}
        horizontal


        renderItem={({ item, index }) => {
          let exhausted = item.exhausted;
          return (
            <RenderSlots
              noSlotsToday={ props.noSlotsToday}
              nextDay={ props.nextDay}
              index={index}
              exhausted={exhausted}
              image={ props.image}
              discount={item.discount}
              rating={ props.rating}
              time={item.timeSlot.time}
              id={ props.id}
              timeSlotId={item.timeSlot.id}
              timeDiscountId={item.id}
              city={   city}
              name={ props.name}
              timeDiscounts={ props.timeDiscounts}
              address={ props.address}
            // navigation={ props.navigation}
            />
          );
        }}
      />



    </TouchableOpacity >
    
    <View style={{ position: 'absolute', left: 25, top: 15, backgroundColor:  props.rating > 4 ? 'green' :  props.rating > 3 ? 'orange' : 'red', height: 35, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row' }}>
      <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-SemiBold' }}>
        { props.rating ?  props.rating.toFixed(1) : 0}
      </Text>
      <Entypo name='star' color={'white'} size={20} style={{ marginBottom: 5 }} />
    </View>


    {
       props.hasPickup ? (
        <View style={{ position: 'absolute', right: 7, top: 15 }}>
          <View
            style={{
              justifyContent: 'center',
              elevation: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: 'green',
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5,
              paddingHorizontal: 10,
              zIndex: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold' }}>
              Dine In/Takeaway
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              top: 16,
              right: 4.4,
              borderLeftWidth: 8,
              position: 'absolute',
              borderRightWidth: 8,
              borderBottomWidth: 16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#006400',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      ) : (
        <View style={{ position: 'absolute', right: 7, top: 15 }}>
          <View
            style={{
              justifyContent: 'center',
              elevation: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: '#d29034',
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5,
              paddingHorizontal: 10,
              zIndex: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold' }}>
              Dine In
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              top: 16,
              right: 4.4,
              borderLeftWidth: 8,
              position: 'absolute',
              borderRightWidth: 8,
              borderBottomWidth: 16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#be8228',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>



      )
    }
    {

       props.noSlotsToday ?
        <View style={{ position: 'absolute', right: 7, top: 50 }}>
          <View
            style={{
              justifyContent: 'center',
              elevation: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: '#d20000',
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5,
              paddingHorizontal: 10,
              zIndex: 10
            }}
          >
            <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold' }}>
              Not Avaiable Today
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              top: 16,
              right: 4.4,
              borderLeftWidth: 8,
              position: 'absolute',
              borderRightWidth: 8,
              borderBottomWidth: 16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#a00000',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View> : <></>
    }
    {

       props.shutdown &&

    
        <View style={{ position: 'absolute', right: 7, top: 50 }}>
          <View
            style={{
              justifyContent: 'center',
              elevation: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: '#d20000',
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5,
              paddingHorizontal: 10,
              zIndex: 10
            }}
          >
            <Text style={{ color: '#FFF', fontFamily: 'Poppins-SemiBold' }}>
              Available from {formattedDate}
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              top: 16,
              right: 4.4,
              borderLeftWidth: 8,
              position: 'absolute',
              borderRightWidth: 8,
              borderBottomWidth: 16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#a00000',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
    }
  </View>
  );
};

export default RenderRestaurants;

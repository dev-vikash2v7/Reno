import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Dimensions , PermissionsAndroid } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Restaurant } from 'src/types/interfaces';
import RenderRestaurants from './RenderRestaurants';
import SortBy, { Sort } from '../Common/SortBy';
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import Search from '../Common/Search';
import Filters from '../Common/Filters';
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import { hp, wp } from 'src/app/Login';



interface Props {
    data: Restaurant[]
}




const RestaurantLists = ({ data }: Props) => {

    
    const snapPoints = useMemo(() => ['22%', '25%', '30%', '50%', '75%', '80%', '99%'], []);

    const [isSorting, setIsSorting] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sheetPosition, setSheetPosition] = useState<number>(0);
  const [sortName, setSortName] = useState<string | null>(null);






    const renderBackdrop = useCallback(  (props: any) => <BottomSheetBackdrop {...props} pressBehavior={"collapse"} />,  []  );
        
        const [filter, setFilter] = useState({ pubs: false, casual: false, luxury: false });
        const [restaurants, setRestaurants] = useState<Restaurant[]>(data);
        

        const animatedPosition = useSharedValue(0);
        
        useDerivedValue(() => {
            if (animatedPosition.value >= 5.5) {
                runOnJS(setSheetPosition)(6);
            } else {
            runOnJS(setSheetPosition)(0);
        }
    }, [animatedPosition]);




    ////////////
    const sortByRating = () => {
        setLoading(true);
        let sortedData = [...data];
        sortedData.sort((a, b) => b.rating - a.rating);
        setRestaurants(sortedData);
        setTimeout(() => {
          setLoading(false);
        }, 1)
      }
    
      const sortByAvgPrice = () => {
        setLoading(true);
        let sortedData = [...data];
        sortedData.sort((a, b) => a.aov - b.aov);
        setRestaurants(sortedData);
        setTimeout(() => {
          setLoading(false);
        }, 1)
      }

      const sortByDiscount = () => {
        setLoading(true);
        let sortedData = [...data];
        sortedData.sort((a, b) => getItemDiscount(b).discount - getItemDiscount(a).discount);
        setRestaurants(sortedData);
        setTimeout(() => {
          setLoading(false);
        }, 1)
      }
    
      const sortByDistanceSubmit = async () => {

        setLoading(true);
        let sortedData = [...data];
        sortedData.sort((a, b) => a.distance - b.distance);
        setRestaurants(sortedData);
        setTimeout(() => {
            setLoading(false);
          }, 1)
      }


    
//////////////////////    


      const getItemDiscount = (item : Restaurant)=>{
 
        let timeDiscountId = item.timeDiscount[0].id;
        let discount = 0;
        const currentTime = new Date();

        for (let timeDiscount of item.timeDiscount) {
            const day = getDayFromNumber(new Date().getDay());
            const timeSlot = new Date();
            const TimeParts = timeDiscount.timeSlot.time.split(":");

            timeSlot.setHours(parseInt(TimeParts[0], 10));
            timeSlot.setMinutes(parseInt(TimeParts[1], 10));

            const time30MinutesFromSlot = new Date(timeSlot.getTime() + 30 * 60000);

            if (timeDiscount.day.toUpperCase() === day.toUpperCase() && currentTime >= timeSlot && currentTime <= time30MinutesFromSlot) {
                discount = timeDiscount.discount;
                timeDiscountId = timeDiscount.id;
            }
        }

        return {discount ,timeDiscountId }
      }




    useEffect(() => {
        if (sortName === Sort.Distance) {
          sortByDistanceSubmit();
    
        } else if (sortName === Sort.Ratings) {
          sortByRating();
    
        } else if (sortName === Sort.Discount) {
          sortByDiscount();
        } 
        else if (sortName === Sort.AOV_Price) {
          sortByAvgPrice();
        }
        else {
            setLoading(true);
            setRestaurants(data)
            setTimeout(() => {
                setLoading(false);
              }, 1)
        }
      }, [sortName])

    
    return (
        <>

            <BottomSheet 
            animatedIndex={animatedPosition} 
            handleIndicatorStyle={{ display: 'none' }}
             ref={bottomSheetRef} 
             style={{ marginTop: StatusBar.currentHeight }} 
             backdropComponent={renderBackdrop}
              snapPoints={snapPoints}
              >


                <View style={{ alignItems: 'center' }}>  
                    {
                        sheetPosition !== 6 ?
                            <Entypo onPress={() => {
                                bottomSheetRef.current?.snapToIndex(6)
                            }} name='chevron-thin-up' size={hp('2.2%')} /> : <></>
                    }



                        
{/* 
                    <TouchableOpacity style={{ position: 'absolute', right: '8%', top: '5%' }} onPress={() => bottomSheetRef.current?.close()}>
                    <Ionicons name='close' size={30} />
                </TouchableOpacity> */}


                    <Text
                        style={{
                            fontSize: hp('2.7%'),
                            // marginLeft: 20,
                            fontFamily: 'Poppins-Regular',
                            color: '#000',
                            marginBottom: hp('1.5%'),
                            textAlign:'center'
                        }}
                    >
                        All Restaurants
                    </Text>
                </View>
            
                                    <View
                                        style={{
                                            marginHorizontal: wp('4.2%'),
                                            justifyContent: 'space-between',
                                            zIndex: 20,
                                            marginBottom : hp('8%')
                                        }}> 
            
            <SortBy 
            setIsSorting={setIsSorting} 
            isSorting={isSorting} 
            sortName={sortName}
            setSortName={setSortName}
             />

                                    <Filters
                                        unfilteredRestaurants={data}
                                        setRestaurants={setRestaurants}
                                        filter={filter}
                                        setFilter={setFilter}
                                        />
                                    </View>  

                                    <Search unfilteredRestaurants={data} setRestaurants={setRestaurants}/>


                <BottomSheetScrollView onTouchEnd={() => isSorting && setIsSorting(false)} >
                    {
                        loading ? <ActivityIndicator style={{ marginTop: hp('3%') }} size={hp('4%')} color={'#d20000'} /> :

                            restaurants && restaurants.length > 0 ?

                                <View style={{ backgroundColor: "#fff", width: '100%', height: '100%', paddingTop: hp('1.1%'), marginBottom: '20%' }}>

                                    {restaurants.map( (item ) => {

                                        const {discount , timeDiscountId} = getItemDiscount(item )
                                        
                                    
                                        let imgURL: string;

                                        if (!item.mainImageUrl) {
                                            imgURL = item.uploadedImages[0];
                                        }
                                        else {
                                            imgURL = item.mainImageUrl;
                                        }
                                    
                                        return (
                                            <RenderRestaurants
                                                id={item.id}
                                                name={item.name}
                                                hasPickup={item.hasPickup}
                                                image={imgURL}
                                                longitude={item.longitude}
                                                latitude={item.latitude}
                                                rating={item.rating}
                                                discount={discount}
                                                address={item.address}
                                                distance={item.distance}
                                                timeDiscountId={timeDiscountId}
                                                key={item.id}
                                            
                                            />
                                        )
                                    })
                                }


                                </View> 
                                
                                :
                                
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", width: '100%' }}>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: hp('2.2%') }}>
                                        Currently No Restaurant Available
                                    </Text>
                                </View>
                    }
                </BottomSheetScrollView>
            </BottomSheet>
            {
                sheetPosition >= 5.5 &&
                    <TouchableOpacity onPress={() => bottomSheetRef.current?.snapToIndex(0)} activeOpacity={0.7} style={{
                        backgroundColor: 'white',
                        height: hp('6%'),
                        width: wp('24%'),
                        // right: Dimensions.get('window').width / 2 - 50,
                        right: (wp('100%') -wp('24%') )/2,

                        bottom: hp('1.2%'),
                        position: 'absolute',
                        borderWidth: 0.6,
                        borderRadius: hp('1.1%'),
                        elevation: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        borderColor: 'lightgrey',
                        justifyContent: "center",
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <FontAwesome5 name='map-marked-alt' size={hp('2.4%')} />
                        <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'center', marginLeft: wp('1.8%') }}>
                            Map
                        </Text>
                    </TouchableOpacity> 
            }
        </>
    )
}

export default RestaurantLists;



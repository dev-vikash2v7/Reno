import React, { useState, useEffect, useRef, useContext } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { height, width } from '../../constants';
import RenderSlots from 'src/components/CreateOrder/RenderSlots';
import DateComponent from 'src/components/CreateOrder/DateComponent';
import BookingButton from 'src/components/CreateOrder/BookingButton';
import PeopleComponent from 'src/components/CreateOrder/PeopleComponent';
import PersonalDetails from 'src/components/CreateOrder/PersonalDetails';
import AMRTab from 'src/components/CreateOrder/AMRTab';
import TermsAndConditions from 'src/components/CreateOrder/TermsAndConditions';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import Image from 'react-native-fast-image';
import { getDayFromNumber } from '../../utils/dateTimeUtils';
import { Restaurant, TimeDiscount } from 'src/types/interfaces';
import { getRestaurantDetails } from 'src/services/restaurants.service';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from 'src/services/auth.service';
import { Amplify } from 'aws-amplify';
import * as Storage from 'aws-amplify/storage';
import awsconfig from 'src/aws-exports';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from 'src/components/Common/Header';
import { Modal as Modal1 } from 'react-native-paper'
import { Skeleton } from 'moti/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux_store/store';
import { setChangeRestaurant } from 'src/redux_store/reducers/restaurent.reducer';
import NoInternetScreen from 'src/components/Common/NoInternet';
import { hp, mixpanel, wp } from '../Login';
import crashlytics from '@react-native-firebase/crashlytics';

Amplify.configure(awsconfig);


const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let index = 0;

const CreateOrder = () => {

  const params = useLocalSearchParams();

  
  const [TermsAccepted, setTermsAccepted] = useState(false);
  const [timeStamp, setTimeStamp] = useState(new Date().getTime());
  const [visible, setVisible] = useState(false);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [imagesData, setImagesData] = useState<string[]>([]);
  
  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeek[new Date(parseInt(params.nextDay.toString())).getDay()]);
  const [timeDiscounts, setTimeDiscounts] = useState<TimeDiscount[]>([]);
  const [discount, setDiscount] = useState(0);
  const [time, setTime] = useState('');
  const [timeDiscountId, setTimeDiscountId] = useState('');
  
  const [isTodaySelected, setIsTodaySelected] = useState(params.noSlotsToday === 'true' ? false : true);
  const [loading, setLoading] = useState(true);
  
  
  const [timeDiscountLoading, setTimeDiscountLoading] = useState(true);
  
  const [userId, setUserId] = useState('');
  
  
  // const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [menuImgs, setMenuImgs] = useState<string[]>([]);
  const [showImgOverlay, setShowImgOverlay] = useState<boolean>(false);
  const [noSlotsModal, setNoSlotsModal] = useState<boolean>(params.noSlotsToday === 'true' ? true : false);
  
  const noOfDays = (parseInt(params.nextDay.toString()) - (new Date()).getTime()) / (24 * 60 * 60 * 1000);
  
  const instantEat = params.instantEat === 'true' ? true : false;
  
  const flatListRef = React.useRef<FlatList>(null);
  
  
  const dispatch = useDispatch()
  const {timeDiscount } = useSelector((state : RootState) => state.restaurent)
  
  const [selectedRestaurant , setSelectedRestaurant] = useState<Restaurant>()


  const [currentIndex, setCurrentIndex] = useState(0);

  const [isConnected, setConnected] = useState<boolean >(true);


  useEffect(()=>{
    mixpanel.track('opened CreateOrder');
    crashlytics().log('CreateOrder mounted.');

  

  },[])

  useEffect(()=>{
    if(timeDiscount && timeDiscount.length > 0 ){
      let n= { ...selectedRestaurant , timeDiscount}
      setSelectedRestaurant(n)
    }
  },[timeDiscount])
  
  
  let scrollInterval: any;

  const startAutoScroll = () => {
    scrollInterval = setInterval(() => {
      const nextIndex = (index + 1) % imagesData.length;
      const width = Dimensions.get('window').width;
      setImageIndex(nextIndex);
      index = nextIndex;
      // console.log(nextIndex,imageIndex);
      const offset = nextIndex * width;
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    }, 5000);
  };

  useEffect(() => {
    if (!loading ) {
      startAutoScroll();
      return () => {
        clearInterval(scrollInterval);
      }
    };

  }, [loading]);

  






  useEffect(() => {
    if (selectedRestaurant) {

      setTimeDiscountLoading(true);

      const t = selectedRestaurant?.timeDiscount?.filter(
        (item: TimeDiscount) => {
          // console.log(item.day, 113);

          return item.day === selectedDay
        }
      );

      const filteredTimeDiscount: TimeDiscount[] = [];
      t && t.forEach((item: TimeDiscount) => {
        let halfHour = Date.now();
        let hour = new Date(halfHour).getHours();
        let minute = new Date(halfHour).getMinutes();
        const time1 = `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`;
        if (
          item.timeSlot.time <= time1 &&
          isTodaySelected
        ) {
          return;
        }

        filteredTimeDiscount.push(item);
      });

      setTimeDiscounts(filteredTimeDiscount!);
      setTimeDiscountLoading(false);
    }
  }, [selectedDay, selectedRestaurant])









  useEffect(() => {
    if (instantEat) {
      setTimeDiscountId(params.timeDiscountId as string);
      setDiscount(Number(params.discount))
    }
    else {
      if (params.timeDiscountId) {
        setTimeDiscountId(params.timeDiscountId.toString());
        setTime(params.time.toString());
        setDiscount(parseInt(params.discount.toString() !== '' ? params.discount.toString() : '0'));
      }
    }
  }, [])




  const getRestaurantDetailsFunction = async () => {
    setLoading(true);
    try {
      const res = await getRestaurantDetails(params.id.toString());

     setConnected(true)


      dispatch(setChangeRestaurant(res.data.restaurant))

      const res1 = await getProfile();

      setUserId(res1.data.user.id);

      const name = await AsyncStorage.getItem("userName");
      const contact = await AsyncStorage.getItem("contact");

      setName(name!);

      if (contact) { setNumber(contact) };


      // setUploadedImages(res.data.restaurant.uploadedImages);
      // setMenuImgsName(res.data.restaurant.menuImages);

      setMenuImgs(res.data.restaurant.menuImages);

      setSelectedRestaurant(res.data.restaurant)

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      
      if(isConnected)
        setConnected(false)


      setTimeout(async()=>{
        await getRestaurantDetailsFunction()
      },1000)

    }
  }










  useEffect(() => {
    getRestaurantDetailsFunction();
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) {
      return;
    }

    if (selectedRestaurant.mainImageUrl) {
      const newImagesData = [
        selectedRestaurant.mainImageUrl,
        ...selectedRestaurant.images,
      ];

      setImagesData(newImagesData);
    }

  }, [selectedRestaurant]);















  const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
      type: 'timing',
      duration: 1500,
    },
    backgroundColor: '#D4D4D4',
  } as const;

  const openGoogleMaps = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error(err));
  };

  const onTimeSlotSelected = (discount: number, time: string, id: string, timeSlotId: string) => {
    setDiscount(discount);
    setTime(time);

    setTimeDiscountId(id);
  };

  const onPeopleSelected = (selectedPeople: number) => {
    setPeople(selectedPeople);
  };

  const onNameChange = (newName: string) => {
    setName(newName);
  };

  const onNumberChange = (newNumber: string) => {
    setNumber(newNumber);
  };

  function renderDatePicker() {
    return (
    <DateComponent
      noOfDays={noOfDays}
      noSlotsToday={params.noSlotsToday === 'true' ? true : false}
      nextDay={parseInt(params.nextDay.toString())}
      setIsTodaySelected={setIsTodaySelected}
      callbackFromMainCalendar={(timeStamp1) => {
        if (timeStamp !== timeStamp1) {
          const fullDay = getDayFromNumber(
            new Date(timeStamp1).getDay()
          );
          setSelectedDay(fullDay);
          setTimeStamp(timeStamp1);
        }
      }}
    />)
  }

  function renderTimePicker() {
    return <>
      <Text
        style={{
          marginTop: hp('1.8%'),
          fontFamily: 'Poppins-Regular',
          color: '#000000',

          fontSize: hp('2.2%'),
            marginLeft: wp('4.7%'),
        }}>
        What time ?
      </Text>
      {timeDiscountLoading ? (
        <View
          style={{
            width: width,
            height: hp('7%'),
            marginLeft: 10,
            marginTop: 20,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator animating={true} color="#d20000" size="small" />
        </View>
      ) : (
        timeDiscounts && timeDiscounts.length ? (
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
              fontSize: hp('2.2%'),
              flexWrap: 'wrap',
              textAlign: 'center',
            }}>
            No slots available for this day.
          </Text>
        )
      )}
    </>
  }












  function renderBookingButton() {
    return (
      <BookingButton
        userId={userId}
        name={name!}
        people={people}
        restaurantName={params.name && params.name.toString()}
        discount={discount}
        timeStamp={timeStamp}
        time={time}
        instantEat={instantEat ? true : false}
        phoneno={number}
        timeDiscountSlotId={timeDiscountId}
        aov = {selectedRestaurant?.aov}
        category = {selectedRestaurant?.category}
        restaurantId={selectedRestaurant?.id!}
        rating = {selectedRestaurant?.rating}
        distance = {selectedRestaurant?.distance}
        duration = {selectedRestaurant?.duration}
        callbackFromParent={(show, error) => {
          if (show) {
            setVisible(show);
            setError(error);
          }
        }}
        active={TermsAccepted}
      />
    )
  }





  if(!isConnected) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
       <Header
        text={params.name && params.name.toString()}
        onBack={async ()=>{
          await AsyncStorage.removeItem('selectedId')
          router.back()
        }}
      />
  <NoInternetScreen/>
  </SafeAreaView>
)
  



  
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header
        text={params.name && params.name.toString()}
        onBack={async ()=>{
          await AsyncStorage.removeItem('selectedId')
          router.back()
        }}
      />
      {
        loading ?
          <View style={{ flex: 1 }}>
            <Skeleton
              height={(width * 9) / 16}
              width={width}
              show {...SkeletonCommonProps} />
            <View
              style={{
                margin: 10,
                width: width,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{ width: '75%' }}>
                <Skeleton
                  height={30}
                  width={150}
                  show {...SkeletonCommonProps}
                />
                <View style={{ marginTop: 10 }}>
                  <Skeleton
                    height={20}
                    width={70}
                    show {...SkeletonCommonProps}
                  />
                </ View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '25%',
                }}>
                <Skeleton show {...SkeletonCommonProps} height={50} width={50} />
              </View>

              {/* <View style={{ margin: 10, marginTop: 15 }}>
                <Skeleton />
              </View> */}
            </View>
            <View style={{ margin: 15 }}>
              {
                !instantEat ? <>
                  <Skeleton height={25} width={80} show {...SkeletonCommonProps} />
                  <FlatList
                    style={{
                      marginTop: 10
                    }}
                    horizontal
                    data={[1, 2, 3, 4]}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginLeft: !index ? 0 : 10 }}>
                          <Skeleton
                            height={55}
                            width={80}
                            show
                            {...SkeletonCommonProps} />
                        </View>
                      )
                    }}
                  />
                </> : <></>
              }
              {
                !instantEat ? <View style={{ marginTop: 30 }}>
                  <Skeleton height={25} width={80} show {...SkeletonCommonProps} />
                  <FlatList
                    style={{
                      marginTop: 15
                    }}
                    horizontal
                    data={[1, 2, 3, 4]}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginLeft: !index ? 0 : 10 }}>
                          <Skeleton
                            height={55}
                            width={55}
                            show
                            {...SkeletonCommonProps} />
                        </View>
                      )
                    }}
                  />
                </View> : <></>
              }

              <View style={{ marginTop: 15, marginLeft: 0 }}>
                <Skeleton
                  height={25}
                  width={130}
                  show
                  {...SkeletonCommonProps} />
                <FlatList
                  style={{
                    marginTop: 15
                  }}
                  horizontal
                  data={[1, 2, 3, 4, 5, 6]}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ marginLeft: !index ? 0 : 10 }}>
                        <Skeleton
                          height={50}
                          width={50}
                          show
                          {...SkeletonCommonProps} />
                      </View>
                    )
                  }}
                />
              </View>
              <View style={{
                marginTop: 15,
                margin: 10
              }}>
                <Skeleton
                  height={25}
                  width={125}
                  show
                  {...SkeletonCommonProps} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 10,
                    width: '100%'
                  }}
                >
                  <View style={{ justifyContent: "center", marginRight: 10 }}>
                    <Skeleton show {...SkeletonCommonProps} width={70} height={20} />
                    <View style={{ marginTop: 5 }}>
                      <Skeleton
                        show {...SkeletonCommonProps}
                        width={width * 0.43}
                        height={40}
                      />
                    </View>
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <Skeleton show {...SkeletonCommonProps} width={100} height={20} />
                    <View style={{ marginTop: 5 }}>
                      <Skeleton
                        show {...SkeletonCommonProps}
                        width={width * 0.43}
                        height={40}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 40,
                borderRadius: 20,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                borderWidth: 0.2,
                borderColor: '#707070',
                marginBottom: 10,
                marginHorizontal: 10,
                marginTop: 20
              }}>
                <Skeleton show {...SkeletonCommonProps}
                  radius={20}
                  height={40}
                  width={width - 50}
                />
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: { height: -3, width: 0 },
                height: 80,
                elevation: 15,
                alignItems: 'center',
                justifyContent: 'center',
                width: width,
              }}
            >
              <Skeleton show {...SkeletonCommonProps} width={'90%'} height={55} />
            </View>
          </View>
          :




          <View style={{ flex: 1 }}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View>
                <FlatList
                  ref={flatListRef}
                  data={imagesData}
                  pagingEnabled
                  horizontal
                  snapToInterval={width}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {

                    const index1 = Math.round(
                      event.nativeEvent.contentOffset.x / width
                    );
                    setImageIndex(index1);
                    index = index1;
                  }}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={{
                        height: hp('25%'),
                        width,
                      }}
                      resizeMode="cover"
                    />
                  )}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        marginBottom: 3,
                        borderRadius: 50,
                        width: wp('14%'),
                        height: hp('3.1%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: hp('2%'),
                          color: 'grey',
                        }}>
                        {`${imageIndex + 1}/${imagesData && imagesData.length}`}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View
                      style={{
                        borderTopLeftRadius: 5,
                        flexDirection: 'row',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: wp('3%'),
                        paddingVertical: hp('0.5%'),
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontSize: hp('2.3%'),
                          color: '#000',
                          marginRight: 5,
                        }}>
                        { params.rating && parseFloat(params.rating.toString()).toFixed(1)}
                      </Text>
                      <Ionicons name="star" color="#000" size={hp('2.3%')} />
                    </View>
                  </View>
                </View>
              </View>


              <View
                style={{
                  margin: hp('1%'),
                  width: width,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>

                <View style={{ width: '75%' , paddingHorizontal:wp('2.2%')}}>

                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: hp('2.8%'),
                      color: '#000',
                    }}>
                    {params.name}
                  </Text>


                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp('2.2%'),
                      opacity: 0.7,
                      color: '#000',
                    }}>
                    {params.address}
                  </Text>
                </View>


                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp('25%'),
                    // width: '25%',
                    paddingRight:wp('7%')
                  }}
                  onPress={() => {
                    openGoogleMaps(
                      `https://www.google.co.in/maps/dir//${params.latitude},${params.longitude}`
                    )
                  }
                  }>
                  <Image
                    source={require('../../assets/compass.png')}
                    style={{ height: hp('4%'), width: hp('4%'), }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      marginTop: 5,
                      color: '#000',
                      fontSize: hp('1.7%'),
                    }}>
                    Direction
                  </Text>
                </TouchableOpacity>

              </View>
              {
                !instantEat && renderDatePicker()
              }
              {
                !instantEat && renderTimePicker()
              }

              <PeopleComponent callbackFromPeople={onPeopleSelected} />


              <PersonalDetails
                name={name!}
                number={number}
                callbackAsName={onNameChange}
                callbackAsNumber={onNumberChange}
              />



              <AMRTab
                setShowImgOverlay={setShowImgOverlay}
                discount={discount}
                about={selectedRestaurant?.about!}
                restaurantMenu={selectedRestaurant?.menu!}
                menuImages={menuImgs}
                userReviewses={selectedRestaurant?.UserReviews!}
              />


              
              <TermsAndConditions
                conditions={selectedRestaurant?.conditions!}
                callbackFromChild={(state) => {
                  setTermsAccepted(state);
                }}
              />

              
            </ScrollView>
            {
              renderBookingButton()
            }
            <Snackbar
              visible={visible}
              theme={{ colors: { accent: 'white' } }}
              style={{
                position: 'absolute',
                bottom: 0,
                elevation: 17,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                backgroundColor: '#FFA500',
                height: 55,
                width: '90%',
                alignSelf: 'center',
                borderRadius: 5,
              }}
              onDismiss={() => setVisible(false)}
              action={{
                label: 'Okay',
                onPress: () => {
                  // Do something when Okay is pressed
                },
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: 'Poppins-Medium',
                  color: '#fff',
                }}>
                {error || 'Accept Terms & Conditions'}
              </Text>
            </Snackbar>
          </View>
      }



      
      {/* <Modal onRequestClose={() => setShowImgOverlay(false)} visible={showImgOverlay} transparent={true} >
        <AntDesign onPress={() => setShowImgOverlay(false)} name='close' color={'white'} size={30} style={{ position: 'absolute', zIndex: 2, right: 10, top: 10 }} />
        <ImageViewer imageUrls={menuImgs.map((i) => { return { url: i } })} />
      </Modal>
       */}

      <Modal1
        dismissableBackButton
        dismissable
        style={{
          alignItems: 'center'
        }}
        onDismiss={() => {
          params.nextDay && setTimeStamp(parseInt(params.nextDay.toString()))
          setNoSlotsModal(false)}}
        visible={noSlotsModal}
      >
        <View style={{
          height: 250,
          width: 300,
          backgroundColor: 'white',
          borderRadius: 20,
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 15,
              width: 200,
              textAlign: 'center',
              marginBottom: 10
            }}>
              Sorry there is no available slots today
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 13,
              color: 'grey',
              textAlign: 'center',
              marginBottom: 10
            }}>
              The next available date is:
            </Text>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Poppins-SemiBold',
              color: 'grey',
              textAlign: 'center'
            }}>
              {params.nextDay && new Intl.DateTimeFormat('en-GB').format(new Date(parseInt(params.nextDay.toString())))}{`\n`}
              {
                timeDiscountLoading ? <ActivityIndicator size={20} color='#d20000' /> :
                  timeDiscounts && timeDiscounts.length ?
                    timeDiscounts.sort((a, b) => a.timeSlot.time < b.timeSlot.time ? -1 : 1)[0].timeSlot.time : 0
              }
            </Text>
          </View>
          <TouchableOpacity onPress={() => {
            
            setTimeStamp(parseInt(params.nextDay.toString()))
            setNoSlotsModal(false)
            }}>


            <Text style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 15,
              color: '#d20000'
            }}>
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </Modal1>













      <Modal animationType="slide"
      transparent={true}
      visible={showImgOverlay}
      onRequestClose={() => setShowImgOverlay(false)} 
      style={{justifyContent:'center' ,alignItems:'center'}}
      >
                <TouchableOpacity onPress={() => setShowImgOverlay(false)} style={{ position: 'absolute', zIndex: 2, right: 25, top: 60 }} >
                <AntDesign  name='close' color={'white'} size={30} />
                </TouchableOpacity>


                <ImageViewer 

                imageUrls={menuImgs.map((i) => { return { url: i } })}  

                index={currentIndex}

                renderImage={(props) => (
                  <View style={{ width: 300, height: 300,marginHorizontal:'auto' , alignSelf:'center' , justifyContent:'center' , marginVertical:'auto'  , flex:1 , flexDirection:'row' , alignItems:'center'}}>

{
  currentIndex !=0 &&
<Ionicons
                            name="chevron-back-outline"
                            color={'white'}
                            size={24}
                            onPress={()=>{
                              setCurrentIndex(currentIndex-1)
                            }}
                            />
                          }


                    <Image
                      {...props}
                      resizeMode="contain" // or any other appropriate resizeMode
                      style={{ width: 270, height: 450  , marginHorizontal:10 , alignSelf:'center'} }
                    />
                    
                    {
  currentIndex !=menuImgs.length - 1 &&            
<Ionicons
                            name="chevron-forward-outline"
                            color={'white'}
                            size={24}
                            onPress={()=>{
                              setCurrentIndex(currentIndex+1)
                            }}
                            
                        />
                    }

                  </View>
                )}
                renderIndicator={(currentIndex_, allSize) => {

                  if(currentIndex_){
                    setCurrentIndex(currentIndex_-1)
                  }
                 return (
                  <Text style={styles.indicator}>{`${currentIndex_ }/${allSize}`}</Text>

                )
              }
              }
                
                />
            </Modal>










    </SafeAreaView>
  );
};

export default CreateOrder

const styles = StyleSheet.create({
  container:{
    elevation:2,
    height:230,
    width:width*0.95,
    backgroundColor:'#efefef',
    borderRadius:20,
    overflow:'hidden',
  alignContent:'center',
  marginHorizontal:'auto',
  alignSelf:'center',
  marginVertical:10

},
uploadBtnContainer:{
    opacity:0.8,
    position:'absolute',
    right:0,
    bottom:0,
    backgroundColor:'lightgrey',
    width:'100%',
    height:'20%',
},
uploadBtn:{
    display:'flex',
    alignItems:"center",
    justifyContent:'center',

},
textInput : {
   marginVertical: 10 ,
   backgroundColor:'#fff'
},
indicator: {
  position: 'absolute',
  top: 60,
  color: 'white',
  fontSize: 18,
  textAlign:'center',
  left:width * 0.47
}
})
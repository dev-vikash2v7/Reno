import React from 'react'
import { View, Image } from 'react-native'
import { getDayFromNumber } from 'src/utils/dateTimeUtils';
import _ from 'lodash';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AnimatedPriceMarker from 'src/components/InstantEatOut/RestaurantMarker';
import { Restaurant } from 'src/types/interfaces';
import { hp } from 'src/app/Login';


interface Props {
    userLatitude : number ,
    userLongitude : number ,
    nearByData : Restaurant[],
    maxDistance : number,
    setData : React.Dispatch<React.SetStateAction<Restaurant | null | undefined>>,
    setCurrentDiscount:any ,
    setTimeDiscountId:any
    
  }

 const InstantMapView = (
  {  userLatitude ,
    userLongitude ,
    nearByData ,
    maxDistance ,
    setData ,
    setTimeDiscountId,
    setCurrentDiscount

} : Props
 ) => {

    
    const map = React.useRef<any>(null);

  return (


    <MapView
                    ref={map}

                    initialRegion={{
                        latitude: userLatitude!,
                        longitude: userLongitude!,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.4,
                    }}

                    provider={PROVIDER_GOOGLE}

                    mapType="standard"

                    style={{ flex: 1 }}>

                    <Marker
                        coordinate={{
                            latitude: userLatitude!,
                            longitude: userLongitude!,
                        }}
                        title={'Your Location'}
                    >
                        <Image style={{
                            width: hp('3.5%'),
                            height: hp('3.5%'),
                            position: 'absolute',
                            zIndex: 1000
                        }} source={require('../../assets/marker.png')} />
                    </Marker>


                    {nearByData.length > 0  && (
                        nearByData.map((marker: Restaurant) => {
                            const day = getDayFromNumber(new Date().getDay());
                            const dayDiscount = `${day.slice(0, 3)}Discount`;
                            let discount = 0;
                            const currentTime = new Date();
                            for (let timeDiscount of marker.timeDiscount) {
                                const day = getDayFromNumber(new Date().getDay());
                                const timeSlot = new Date();
                                const TimeParts = timeDiscount.timeSlot.time.split(":");
                                timeSlot.setHours(parseInt(TimeParts[0], 10));
                                timeSlot.setMinutes(parseInt(TimeParts[1], 10));
                                const time30MinutesFromSlot = new Date(timeSlot.getTime() + 30 * 60000);
                                if (timeDiscount.day.toUpperCase() === day.toUpperCase() && currentTime >= timeSlot && currentTime <= time30MinutesFromSlot) {
                                    discount = timeDiscount.discount;
                                }
                            }

                            if (marker.distance > maxDistance! || discount == 0) {
                                return null;
                            }
                            

                            return (
                                <Marker
                                    key={marker.id}
                                    coordinate={{
                                        latitude: parseFloat(marker.latitude),
                                        longitude: parseFloat(marker.longitude),
                                    }}
                                    title={marker.name}
                                    // description={city}
                                    onPress={() => {
                                        if (!discount) {
                                            return;
                                        }
                                      
                                        setCurrentDiscount(discount);
                                        setData(marker);
                                        // let discount = 0;
                                        let timeDiscountId = marker.timeDiscount[0].id;

                                        const currentTime = new Date();
                                        for (let timeDiscount of marker.timeDiscount) {
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
                                        setTimeDiscountId(timeDiscountId);
                                     
                                    }}>
                                    <AnimatedPriceMarker    discount={   discount   }/>
                                </Marker>
                            );
                        })
                    ) }
                </MapView>
  )
}

export default InstantMapView
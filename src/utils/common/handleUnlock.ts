
import { unlockBooking } from 'src/services/order.service';
import {  getPreciseDistance } from 'geolib';
import { Order } from 'src/types/order.interfaces';
import { getCurrentPosition } from '../location.urtils';

 export const handleUnlock = async ({
    item,
    setLoadingVisible ,
    setContent , 
    setAlertVisible  , 
     setItem ,
      setLocation ,
      handleSuccess
} : {
    item : Order,
    setLoadingVisible  : any,
    setContent : any, 
    setAlertVisible : any , 
     setItem : any,
      setLocation : any,
      handleSuccess: any
}) => {

    try {


        setLoadingVisible(true)

        const {success , coordinates} =    await  getCurrentPosition( )

        if(!success   ){
            setLoadingVisible(false)
            return
            }
            
            
            let distance =   getPreciseDistance(
                { latitude: item.Restaurant.latitude, longitude: item.Restaurant.longitude },
                { latitude: coordinates.latitude  ,  longitude:  coordinates.longitude },
            );

            console.log('success' , distance)

        
        if( !distance ) {
            setLoadingVisible(false)
            return
        }

        setLoadingVisible(false)

        if (distance  > 200) {

           let  distanceKm =  parseFloat((distance / 1000).toFixed(1))

                setItem(item)
                setLocation(coordinates)
                setContent(`You are ${ distanceKm > 1 ? distanceKm.toLocaleString() + ' Km' : distance.toLocaleString() + ' m'} away from the restaurant. Are you sure you want to unlock ?`)
                setAlertVisible(true)
                return
            }


            setLoadingVisible(true);
            const location1 = `${distance}m`;
            await unlockBooking(item.id, location1);
            setLoadingVisible(false);
            handleSuccess(location1);

        }


    catch (error) {
        setLoadingVisible(false);
        console.error( 'handleunlockeerro ', error);
    }
}










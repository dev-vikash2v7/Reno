import * as Location from 'expo-location';
import { setCoordinates } from 'src/redux_store/reducers/user.reducer';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-async-storage/async-storage';


// export const getCurrentPosition = async ( dispatch)  : Promise<boolean>=> {
//     try {
      
//         let { status } = await Location.requestForegroundPermissionsAsync();

//         console.log(status)

//         if (!status) {
//             dispatch(setAccessGranted(false))
//             return false;
//         }

        

       
//         if(status){
            
//           Geolocation.getCurrentPosition(res =>{
//             console.log(res.coords)
//           })
          
//             // let location = await Location.getCurrentPositionAsync( {accuracy : Location.Accuracy.Lowest});
            
//             const location_map_url = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

            
        
//             // console.log({ longitude :  location.coords.longitude,latitude : location.coords.latitude})
//             dispatch(setCoordinates({
//                 latitude :location.coords.latitude, 
//                 longitude : location.coords.longitude,
//                 location_map_url 
//               }))

//             dispatch(setAccessGranted(true))


//               return true 
    
//         }
        
//     } catch (error) {
//         console.error('(location.urilts.ts) current location error : ', error);
//     }

//     return false

   
// }
export const getCurrentPosition = async ( dispatch ?: any) : Promise<{success : boolean , coordinates?:any }> => {


    try {
      
        let { status } = await Location.requestForegroundPermissionsAsync();

        // console.log('STATUS' , status)

        if (!status) {
          
            return {success:false}
        }
       
        if(status == 'granted'){

          const getCurrentLocation = (): Promise<GeoPosition> => {
            return new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                (location) => {
                  resolve(location); // Resolve the Promise with the location data
                },
                (error) => {
                 
                  reject(error); // Reject the Promise if there's an error
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
              );
            });
          };

          const location = await getCurrentLocation();

          // The rest of your code that depends on the location data
          
          const location_map_url = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
          // Assuming `dispatch` and `setCoordinates` are properly defined elsewhere
          
          if(dispatch){

          dispatch(
            setCoordinates({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              location_map_url,
            })
          );
        }


              return  {success: true , coordinates :{latitude: location.coords.latitude,
                longitude: location.coords.longitude} } 
            
        }
        
    } catch (error) {
        console.error('current location error : ', error);
    }

    return {success :false}

   
}


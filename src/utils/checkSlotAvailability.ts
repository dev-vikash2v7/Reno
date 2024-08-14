import { Alert } from "react-native"




const checkSlotAvailability  = ({timeStamp  , time } : {timeStamp : number , time : string}) : boolean => {

    const current =  Date.now()
  
    // const currentDate = 7
    // const currentHour = 17
    // const currentMin = 40
  
    const currentDate = new Date(current).getDate()
    const currentHour = new Date(current).getHours()
    const currentMin = new Date(current).getMinutes()
  
    const slotDate = new Date(timeStamp).getDate()
    const slotHour = parseInt(time.split(':')[0])
    const slotMin = parseInt(time.split(':')[1])
  
  
    // console.log('current - ' ,  currentDate)
    // console.log('currentHour - ' , currentHour)
    // console.log('currentmin - ' , currentMin)
  
    // console.log('slotdate - ' , slotDate)
    // console.log('slotHour - ' , slotHour)
    // console.log('slotMin - ' , slotMin)


    if((currentDate > slotDate) || (currentDate  == slotDate && currentHour < slotHour) || (currentHour == slotHour && currentMin < slotMin)) return true

        return false;
    }

  export default checkSlotAvailability
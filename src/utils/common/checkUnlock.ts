// import { IST, currentDate } from "src/constants";
import moment from "moment";
import { Order } from "src/types/order.interfaces";



  export   const checkUnlock = ( { order    , slotDate , setContent  , setWarningVisible , ispress  , now  ,setLoadingVisible} : {order : Order, setContent:any  , setWarningVisible : any   , ispress ?: boolean , now : Date , setLoadingVisible?:any  ,slotDate:any })  : boolean=> {

    try{

    
            if(setLoadingVisible) setLoadingVisible(true)

          const currentDate = moment(new Date());

          // console.log(' slotDate' , slotDate , slotDate.hours() , slotDate.minutes() )
          // console.log(' order.TimeSlot.time' , order.TimeSlot.time)

          const rangeStartTime = moment(slotDate, 'HH:mm').subtract(10, 'minutes');
          const rangeEndTime = moment(slotDate, 'HH:mm').add(30, 'minutes');

          // console.log(rangeStartTime.date() , rangeEndTime.date() , currentDate.date())
          // console.log(rangeStartTime.hours() , rangeEndTime.hours() , currentDate.hours())
          // console.log(rangeStartTime.minutes() , rangeEndTime.minutes() , currentDate.minutes())

      if (currentDate.isBetween( rangeStartTime.format('HH:mm'), rangeEndTime.format('HH:mm'))) {
        if (setLoadingVisible) setLoadingVisible(false);
        return true;
      }
      
      else {
          const dateDiff = slotDate.diff(currentDate, 'days');
            if(ispress){
                    // console.log(`${currentTime} is NOT within the range ${rangeStartTime} - ${rangeEndTime}`);
                    if(dateDiff == 0){
                        setContent(`Booking can only be unlocked between ${rangeStartTime.format('HH:mm')} - ${rangeEndTime.format('HH:mm')}`)
                    }
                    else{
                        setContent(`Booking can only be unlocked between ${rangeStartTime.format('HH:mm')} - ${rangeEndTime.format('HH:mm')} on ${slotDate.format('DD/MM/YYYY')}`)
                    }
                  if(setLoadingVisible) setLoadingVisible(false)
                    setWarningVisible(true)
                }
          }
        }

        catch(err){
          console.error(err)
          if(setLoadingVisible) setLoadingVisible(false)

        }

        return false

      }
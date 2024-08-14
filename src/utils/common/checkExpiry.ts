import moment from "moment";
import { Order } from "src/types/order.interfaces";

function checkExpiry(item : Order ){
    if (item.instantEat) {

        const orderTime1 = new Date(item.createTime).getTime();
        let halfHour = orderTime1 + 15 * 60 * 1000;                    
        if (item.status !== 'Completed' && item.status !== 'Cancelled' && halfHour > (new Date()).getTime()) {
          return false
        }
      }
      else{
        const orderTime = item.TimeSlot.time;
        const hours = orderTime.split(':')[0];
        const minutes = orderTime.split(':')[1];
  
        const orderExpiry = moment(item.date).set('hours', Number(hours)).set('minutes', Number(minutes));
  
        // Setting the expiry time
        orderExpiry.add(30, 'minutes');
  
        if (item.status !== 'Completed' && item.status !== 'Cancelled' && orderExpiry.valueOf() > moment().valueOf()) {
          return false
        }
        }
        return true
}

export default checkExpiry
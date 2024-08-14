import { Order, otpScreenRouteData } from "src/types/order.interfaces";
import { BrandTile, PaymentStatusType, Restaurant, RestaurantCategory, TimeDiscount } from "src/types/interfaces";

export interface RestaurantState {
    allRestaurentsByCity : Restaurant[],
  allRestaurantsCategories : BrandTile[],
  restaurantsByCategory : RestaurantCategory | null,
  allOnGoingOrders : Order[],
  userOrders : Order[],

  // selectedRestaurant : {
  //   imageUri:  any,
  //   id:  any,
  //   longitude: any,
  //   latitude:  any,
  //   name: any,
  //   city:    any,
  //   rating: any,
  //   noSlotsToday: any,
  //   nextDay: any,
  //   address :any,
  //   instantEat : any,
  //   timeDiscountId:any ,
  //   time : any ,
  //   discount : any,
  //   timeSlotId:any
  // } 
  timeDiscount : TimeDiscount[] | null,
  changeRestaurant : Restaurant | null
  }






export interface UserState {
    name: string,
    email: string,
    phone: string,
    profileImg : string,
    city : null,
    coordinates : {
      latitude: number,
      longitude: number,
      location_map_url:string
    },
    jwtToken : string | null
  }


export interface OrderState {

    orderDetails : Order  ,
    confirmBookingData : Order  | null,
    otpRouteData : otpScreenRouteData | null

    merchantDetails : {
      virtualAccount : string , 
      name : string, 
      city: string,
    },
    transactionDetails : {
      status : PaymentStatusType | null, 
      timeOfPayment : string | null  ,
      dateOPayment: string | null  ,
      transactionId : string | null  ,
      bankReferenceNumber : string | null  ,
      npciTxnId : string | null ,
    },

  }
  
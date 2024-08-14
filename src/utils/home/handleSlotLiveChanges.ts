import { getRestaurantDetails } from "src/services/restaurants.service";
import { Restaurant } from "src/types/interfaces";



const handleTimeSlotChange =  (restaurantId : any,      slots:any , unfilteredRestaurants : Restaurant[]) : Restaurant[] => {


    if(!slots || slots.length == 0) return []

    // console.log('handleTimeSlotChange' , restaurantId , slots )

      const updatedRestaurants = unfilteredRestaurants.map((rest) => {

        if (rest.id === restaurantId) {
  
          const updatedTimeDiscount = rest.timeDiscount.map((td) => {
  
            const slotToUpdate = slots.find((slot: any) => slot.id === td.id);
            
            if (slotToUpdate) {
              // Update the discount if the slot is found in the slots array
              return { ...td, discount: slotToUpdate.discount };
            }
            return td; // Return the unchanged time discount if not found
          });
          // Update the time discounts array in the restaurant object
          return { ...rest, timeDiscount: updatedTimeDiscount };
        }
        return rest; // Return unchanged restaurant if IDs don't match
      });



      return updatedRestaurants 
      
  }



  
//////////////////////////
  const handleSingleTimeSlotExhaust =  (restaurantId :any,      slotId : any , exhausted : boolean , unfilteredRestaurants : Restaurant[]) :Restaurant[]=> {

    if(!restaurantId || !slotId) return []

    // console.log('handleTimeSlotExhaust : ' , restaurantId , slotId)

    const updatedRestaurants = unfilteredRestaurants.map((rest) => {
      if (rest.id === restaurantId) {
        const updatedTimeDiscount = rest.timeDiscount.map((td) => {
          if (slotId === td.id) {
            return { ...td, exhausted };
          }
          return td; // Return the unchanged time discount
        });
        return { ...rest, timeDiscount: updatedTimeDiscount };
      }
      return rest; // Return unchanged restaurant if IDs don't match
    });
  
return updatedRestaurants

  }



  const handleSingleTimeSlotChange =  (restaurantId :any,      slotId : any , discount : any ,unfilteredRestaurants : Restaurant[]):Restaurant[] => {

    if(!restaurantId || !slotId || !discount) return []

    console.log('handleTimeSlotExhaust : ' , restaurantId , slotId , discount)

    const updatedRestaurants = unfilteredRestaurants.map((rest) => {
      if (rest.id === restaurantId) {
        const updatedTimeDiscount = rest.timeDiscount.map((td) => {
          if (slotId === td.id) {
            return { ...td, discount };
          }
          return td; // Return the unchanged time discount
        });
        return { ...rest, timeDiscount: updatedTimeDiscount };
      }
      return rest; // Return unchanged restaurant if IDs don't match
    });
  


    return updatedRestaurants

  }





  const handleMultipleTimeSlotExhaust =  (restaurantId :any,      slots : any , unfilteredRestaurants : Restaurant[]):Restaurant[] => {

    if(!restaurantId || !slots) return []

    // console.log('handleMultipleTimeSlotExhaust : ' , restaurantId , slots)

    const updatedRestaurants = unfilteredRestaurants.map((rest) => {

        if (rest.id === restaurantId) {
  
          const updatedTimeDiscount = rest.timeDiscount.map((td) => {
  
            const slotToUpdate = slots.find((slot: any) => slot.id === td.id);
            
            if (slotToUpdate) {
              // Update the discount if the slot is found in the slots array
              return { ...td, exhausted: slotToUpdate.exhausted };
            }
            return td; // Return the unchanged time discount if not found
          });
          // Update the time discounts array in the restaurant object
          return { ...rest, timeDiscount: updatedTimeDiscount };
        }
        return rest; // Return unchanged restaurant if IDs don't match
      });
  

    return updatedRestaurants
  }


  

  const handleReviveRestaurant = async (restaurantId :any, unfilteredRestaurants : Restaurant[]): Promise<Restaurant[]> => {

    if(!restaurantId ) return []

    const updatedRestaurants = await Promise.all(
      unfilteredRestaurants.map(async (rest) => {
        if (rest.id === restaurantId) {
          // Replace the restaurant with newRestaurant
          const res= await getRestaurantDetails(restaurantId)
          return res.data.restaurant;
        } else {
          return rest;
        }
      })
    );

    return updatedRestaurants
  }



  const handleShutDownRestaurant = async (restaurantId :any , unfilteredRestaurants : Restaurant[]) : Promise<Restaurant[]>  => {

    if(!restaurantId )return []

    const updatedRestaurants = await Promise.all(
      unfilteredRestaurants.map(async (rest) => {
        if (rest.id === restaurantId) {
          // Replace the restaurant with newRestaurant
          const res= await getRestaurantDetails(restaurantId)
          return res.data.restaurant;
        } else {
          return rest;
        }
      })
    );
  
    return updatedRestaurants;

    
  }


  export {handleMultipleTimeSlotExhaust,handleSingleTimeSlotChange,handleTimeSlotChange,handleSingleTimeSlotExhaust , handleReviveRestaurant , handleShutDownRestaurant}
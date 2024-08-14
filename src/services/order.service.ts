import { OrderData } from "src/types/order.interfaces";
import { getRequest, postRequest } from "./index";

export const createBooking = async (data: OrderData) => {
    return await postRequest('/consumer/create-booking', { data: data });
}

export const cancelBooking = async (id: string) => {
    return await postRequest(`/consumer/cancelBooking/${id}`, {});
}

export const getUserOrders = async () => {
    return await getRequest(`/consumer/orders`);
}

export const createInstantBooking = async (data: object) => {
    return await postRequest('/consumer/create-instant-order', { data });
}



export const completeOrder = async (bookingId: string, amount: number, transactionId: string, paymentTime: string ,convenienceFee  : number, conveniencePercentage :number,saving :number, billAmount:number) => {
    return await postRequest('/consumer/order/completed', { bookingId, amount, transactionId, paymentTime ,  convenienceFee , 
        conveniencePercentage ,
        saving , 
        billAmount});
}




export const unlockBooking = async (bookingId: string, location: string) => {
    return await postRequest('/consumer/unlockBooking', { bookingId, location });
}

export const sendBookingInfoWhatsapp = async (name: string, restaurantName: string, peopleCount: number, timeSlot: string, discount: number, phone: string) => {
    return await postRequest(`/common/send-booking-details`, { name, restaurantName, peopleCount, timeSlot, discount, phone });
}
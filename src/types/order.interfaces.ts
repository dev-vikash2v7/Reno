import { Restaurant, TimeSlot } from "./interfaces";

export interface OrderData {
    instantEat: boolean;
    date: string;
    tableSize: number;
    timeDiscountSlotId: string;
}
export interface otpScreenRouteData {
    timeDiscountSlotId: string | null;
    phoneno: string;
    name: string;
    active: boolean;
    userId: string,
    people: number,
    timeSlotId: string,
    discount: number,
    restaurantId: string,
    timeStamp: number,
    instantEat: boolean,
}




export interface Order {
    id: string;
    status: string;
    bookingName: string;
    discount: number;
    tableSize: number;
    contact: string;
    instantEat: boolean;
    userId: string;
    restaurantId: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    timeSlotId: string;
    date: string;
    paymentTime: string;
    Restaurant: Restaurant;
    TimeSlot: TimeSlot;
    transactionId: String;
    bookingCode: string;
    unlockLocation: string;

    amount: number | null;
    convenienceFee: number | null;
    conveniencePercentage: number | null;
    billAmount: number | null;
    saving: number | null;
}

export interface InstantEatData {
    restaurantId: string;
    status: string;
    instantEat: boolean;
    date: string;
    tableSize: number;
    bookingName: string;
    timeDiscountSlotId: string;
    contact: string;
    userId: string;
}

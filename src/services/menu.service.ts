import { MenuOrder } from "src/app/InHouseOrdering/Checkout";
import { getRequest, postRequest } from "./index";

export const getMenuItems = async (restaurantId: string) => {
    return await postRequest(`/consumer/getMenu?id=${restaurantId}`, {});
}

export const placeMenuOrders = async (data: MenuOrder[]) => {
    return await postRequest(`/consumer/orderItems`, { orders: data });
}
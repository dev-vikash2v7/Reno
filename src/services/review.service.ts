import { getRequest, postRequest } from "./index";

export const createUserReivew = async (review: string, rating: number, restaurantId: string, bookingId: string) => {
    return await postRequest('/consumer/review/create', { restaurantId, review, rating, bookingId });
}
export const updateUserReview = async (review: string, rating: number, id: string) => {
    return await postRequest('/consumer/review/update', { id, review, rating });
}

export const getUserReview = async () => {
    return await getRequest('/consumer/reviews');
}
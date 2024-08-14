import { ReactNode } from "react";
import { Order } from "./order.interfaces";


export type PaymentStatusType = 'PENDING' | 'SUCCESS' | 'FAILURE' | 'EXPIRED';


export interface User {
    firstname?: string,
    lastname?: string,
    email: string,
    profileImage?: string,
    facebookId?: string
    googleId?: string
    contact?: string
    appleId?: string
    pushToken: string
}

export interface GuestUser {
    firstname?: string,
    lastname?: string,
    email: string,
    profileImage?: string,
    facebookId?: string
    googleId?: string
    contact?: string
    guestToken: string | null
}

export interface RenderRestaurantsProps {
    timeDiscounts: TimeDiscount[];
    image: string;
    id: string;
    longitude: string;
    latitude: string;
    name: string;
    rating: number;
    address: string;
    hasPickup: boolean;
    images: string[];
    aov: number;
    distance: number;
    uploadedImages: string[],
    guest: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    noSlotsToday: boolean
    nextDay: number
}

export interface RenderRestaurantsState {
    city: string | null;
    imageIndex: number;
    imagesData: string[],
    uploadedImages: string[]
    imgUrl: string
}

export interface SlotsProps {
    exhausted: boolean;
    discount: number;
    time: string;
    timeDiscountId: string;
    id: string;
    timeDiscounts: TimeDiscount[];
    image: string;
    name: string;
    index: number
    city: string | null;
    timeSlotId: string
    noSlotsToday: boolean
    nextDay: number
    rating: number
    address : string
}


export interface TimeSlot {
    id: string;
    time: string;
}

export interface TimeDiscount {
    id: string;
    timeSlotId: string;
    day: string;
    exhausted: boolean;
    discount: number;
    restaurantId: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    timeSlot: TimeSlot;
}



export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    latitude: string;
    longitude: string;
    locationId: string;
    mainImageUrl: string;
    about: string;
    address: string;
    conditions: string;
    email: string;
    phone: string[];
    category: RestaurantCategory;
    restaurantCategoryOnRestaurant: RestaurantCategoryOnRestaurant[]
    categoryId: string;
    hasPickup: boolean;
    brandName: string;
    images: string[];
    createTime: string;
    updateTime: string;
    deleted: boolean;
    timeDiscount: TimeDiscount[];
    city: city;
    menu: menu[];
    UserReviews: review[],
    distance: number,
    duration: number,
    aov: number,
    uploadedImages: string[]
    shutdown : any
}

export interface RestaurantCategoryOnRestaurant {
    id: string;
    restaurantCategoryId: string;
    restaurantCategory: RestaurantCategory;
    restaurantId: string;
    restaurant: Restaurant
}

export interface RestaurantCategory {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    imageUrl: string;
    restaurants : Restaurant[]
}

export interface BrandTile {
    id: string;
    name: string;
    imgUrl: string;
    city: city;
    restaurants: Restaurant[]
}

export interface HomeScreenProps {
    navigation: any;
    restaurants: {
        gotRestaurantData: boolean;
        gotBrandTiles: boolean;
        brandTiles: RestaurantCategory[];
        restaurants: Restaurant[];
    };
}

export interface city {
    id: string;
    name: string;
    state_id: string;
    imageUrl: string;
}

export interface state {
    id: string;
    name: string;
    country: string;
}

export interface menu {
    id: string;
    name: string;
    price: string;
    description: string;
    menuCategoryId: string | null;
    pictureUrl: string;
    restaurantId: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
}

export interface review {
    id: string;
    review: string;
    rating: number;
    userId: string;
    restaurantId: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    user: {
        profileImage: string;
        firstname: string;
        lastname: string;
    }
}

export interface ProfileData {
    profileImage: string;
    firstname: string;
    lastname: string;
    contact?: string;
    email: string;
    userName : string
    id: string,
    totalOrders?: number,
    createTime: string,
    updateTime: string,
    Bookings: Order[],
}

export interface MenuCategory {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
}

export interface MenuItem {
    id: string;
    name: string;
    price: string;
    nonveg: boolean;
    quantity: string;
    description: string;
    menuCategoryId: string;
    imageUrls: string[];
    restaurantId: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    MenuCategory: MenuCategory;
    MenuCustomization: MenuCustomization[];
}

export interface MenuCustomization {
    id: string;
    menuItemId: string;
    itemName: string;
    itemType: string;
    nonveg: boolean;
    price: string;
    imageUrl: string;
    createTime: string;
    deleted: boolean;
}


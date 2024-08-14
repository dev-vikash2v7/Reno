import { getRequest, postRequest } from "."

export const saveContact = async (contact: string, userId: string) => {
    return await postRequest(`/consumer/saveContact?userId=${userId}`, { contact })
}

export const verifyOtp = async (otp: number) => {
    return await postRequest('/consumer/verifyOtp', { otp })
}

export const savePhoneBook = async (contacts: any[]) => {
    const resp = await postRequest('/consumer/savePhoneBook', { contacts })
    return resp;
}

export const getConveniencePercentage = async () => {
    const resp = await getRequest('/consumer/getConveniencePercentage')
    return resp.data.conveniencePercentage;
}
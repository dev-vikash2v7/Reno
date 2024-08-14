import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: __DEV__

    // ? 'https://4615-106-77-135-46.ngrok-free.app/api/v1'
    ? 'https://renoapp.in/api/v1'

    // ? 'https://72ec-2402-8100-3862-b12d-785e-b00a-9125-632a.ngrok-free.app/api/v1'
    // ?'https://8e0e-2402-8100-29f4-69b5-1841-38cd-262b-70ce.ngrok-free.app/api/v1'
    // ? 'http://192.168.157.1:5000/api/v1'
    : 'https://renoapp.in/api/v1',
  // : 'https://renoapp-ed5af.el.r.appspot.com/api/v1',
  
  timeout: 10000,
});



export async function getRequest(url: string) {
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    return await axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } });
  } else {
    return await axiosInstance.get(url);
  }

}

export async function postRequest(url: string, body: any) {
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    return await axiosInstance.post(url, body, { headers: { Authorization: `Bearer ${token}` } });
  } else {
    return await axiosInstance.post(url, body);
  }
}

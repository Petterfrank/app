import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  /*   baseURL: "http://192.168.100.15:8000/api/", */
  baseURL: "http://192.168.133.39:8000/api/",  //direccion de tu pc
  timeout: 30000,
});

/* api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}); */

export default api;
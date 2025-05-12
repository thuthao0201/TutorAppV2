import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const YOUR_REFRESH_TOKEN_URL =
  "http://192.168.1.226:3000" + "/auth/refresh-tokens";
export const ApiClient = () => {
  const api = axios.create({
    baseURL: "http://192.168.1.226:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      if (config.url.includes("/auth")) {
        return config;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  createAxiosResponseInterceptor();

  function createAxiosResponseInterceptor() {
    const interceptor = api.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response.status !== 401) {
          return error.response;
          // return Promise.reject(error);
        }
        if (await AsyncStorage.getItem("refreshToken")) {
          try {
            api.interceptors.response.eject(interceptor);

            const storedRefreshToken = await AsyncStorage.getItem(
              "refreshToken"
            );
            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
            };
            const body = `refreshToken=${storedRefreshToken}`;

            const response = await axios.post(YOUR_REFRESH_TOKEN_URL, body, {
              headers,
            });

            await AsyncStorage.setItem(
              "token",
              "Bearer " + response.data.data.accessToken
            );
            await AsyncStorage.setItem(
              "refreshToken",
              response.data.data.refreshToken
            );

            error.response.config.headers["Authorization"] =
              "Bearer " + response.data.data.accessToken;
            return axios(error.response.config);
          } catch (err) {
            return Promise.reject(err);
          } finally {
            createAxiosResponseInterceptor();
          }
        }
      }
    );
  }

  const get = (path, params) => api.get(path, { params });
  const post = (path, body, params) => api.post(path, body, params);
  const put = (path, body, params) => api.put(path, body, params);
  const patch = (path, body, params) => api.patch(path, body, params);
  const del = (path) => api.delete(path);

  return { get, post, patch, put, del };
};

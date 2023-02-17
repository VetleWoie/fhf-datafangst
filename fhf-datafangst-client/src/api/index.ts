import defaultAxios from "axios";
import * as vessels from "./vesselsApi";

export const axios = defaultAxios.create({
  baseURL: process.env.REACT_APP_API_URL as string,
});

export const apiGet = <T>(url: string, params?: any): Promise<T> =>
  axios
    .get<T>(url, { params })
    .then((response) => response.data)
    .catch((e) => {
      console.log("api error", e);
      throw e;
    });

const API = {
  vessels,
};
export default API;

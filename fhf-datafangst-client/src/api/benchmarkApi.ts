import { V1benchmarkApi, Vessel } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

// export interface UserArgs {
// //   following: Vessel[];
//   accessToken?: string;
// }

const api = new V1benchmarkApi(apiConfiguration, undefined, axiosInstance);

export const getBenchmark = async () =>
  apiGet(async () => api.benchmark());


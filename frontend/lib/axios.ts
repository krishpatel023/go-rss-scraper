import axios from "axios";
import env from "./env";
import { getCookie } from "@/app/actions/cookies";

const AUTH_TOKEN_NAME = "ApiKey";

const api = {
  get: async (url: string) => {
    const cookie = await getCookie(`${AUTH_TOKEN_NAME}`);

    return await axios.get(env.NEXT_PUBLIC_BACKEND_URL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN_NAME + cookie,
      },
    });
  },
  post: async (url: string, data: Object) => {
    const cookie = await getCookie(`${AUTH_TOKEN_NAME}`);

    return await axios.post(env.NEXT_PUBLIC_BACKEND_URL + url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN_NAME + cookie,
      },
    });
  },
  put: async (url: string, data: Object) => {
    const cookie = await getCookie(`${AUTH_TOKEN_NAME}`);

    return await axios.put(env.NEXT_PUBLIC_BACKEND_URL + url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN_NAME + cookie,
      },
    });
  },
  delete: async (url: string) => {
    const cookie = await getCookie(`${AUTH_TOKEN_NAME}`);

    return await axios.delete(env.NEXT_PUBLIC_BACKEND_URL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN_NAME + cookie,
      },
    });
  },
};

export default api;

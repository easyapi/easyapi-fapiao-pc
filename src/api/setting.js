import axios from "axios";
import {baseUrl} from "./api";

/**
 *
 *
 * @see https://www.easyai.com
 */
export const getSettings = (params) => axios.get(`${baseUrl}/setting/find`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

import axios from 'axios'

import {baseUrl} from "./api";

/**
 * 获取我的客户信息
 *
 * @see https://www.easyapi.com
 */
export const getCustomer = (params) => axios.get(`${baseUrl}/customer`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

import axios from "axios";

import {baseUrl} from "./api";

/**
 * 获取外部订单列表
 *
 * @see https://www.easyai.com
 */
export const getOutOrderList = (params, page) => {
  params.size = page.size;
  params.page = page.page;
  params.sort = "orderTime,desc";
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${baseUrl}/out-orders`, {
    params: params
  });
};


/**
 * 获取外部订单详情
 *
 * @see https://www.easyai.com
 */
export const getOutOrder = no => axios.get(`${baseUrl}/out-order/${no}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

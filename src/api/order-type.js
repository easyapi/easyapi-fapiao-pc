import axios from "axios";

import {baseUrl} from "./api";

/**
 * 获取订单类型列表
 */
export const getOrderTypeList = () => axios.get(`${baseUrl}/order-types`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

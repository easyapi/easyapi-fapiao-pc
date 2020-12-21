import axios from "axios";

import {baseUrl} from "./api";

/**
 * 获取商店门户信息
 *
 * @see https://www.easyai.com
 */
export const getShopInfo = (params) => axios.get(`${baseUrl}/api/shop`, {
  params,
});

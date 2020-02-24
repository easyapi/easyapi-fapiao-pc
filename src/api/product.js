import axios from "axios";

export const baseUrl = "https://fapiao-api.easyapi.com";

/**
 * 获取商品列表
 *
 * @see https://www.easyai.com
 */
export const getProductList = (params) => axios.get(`${baseUrl}/products`, {
  params: {
    params,
    accessToken: localStorage.getItem("accessToken")
  }
});

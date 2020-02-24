import axios from "axios";

export const baseUrl = "https://fapiao-api.easyapi.com";

/**
 * 获取地址信息
 *
 * @see https://www.easyai.com
 */
export const getAddress = (id) => axios.post(`${baseUrl}/address/{$id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 添加地址信息
 **
 * @see https://www.easyai.com
 */
export const createAddress = (id, data) => axios.post(`${baseUrl}/address`, {
  data: {
    data,
    accessToken: localStorage.getItem("accessToken"),
    ifDefault: true
  }
});

/**
 * 修改地址信息
 *
 * @see https://www.easyai.com
 */
export const updateAddress = (id, data) => axios.put(`${baseUrl}/address/${id}`, {
  data: {
    data,
    accessToken: localStorage.getItem("accessToken"),
    ifDefault: true
  }
});

/**
 * 删除地址信息
 *
 * @see https://www.easyai.com
 */
export const deleteAddress = id => axios.delete(`${baseUrl}/address/${id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken"),
    username: localStorage.getItem("username")
  }
});

/**
 * 获取我的默认地址信息
 */
export const getDefaultCompany = username => axios.get(`${baseUrl}/address/${username}/default`, {
  data: {
    accessToken: localStorage.getItem("accessToken")
  }
});

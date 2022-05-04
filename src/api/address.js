import axios from "axios";

import {baseUrl} from "./api";


/**
 * 获取发票地址列表
 *
 * @see https://www.easyapi.com
 */
export const getAddressList = (params) => axios.get(`${baseUrl}/addresses`, {
  params,
  accessToken: localStorage.getItem("accessToken")
});

/**
 * 获取发票地址信息
 *
 * @see https://www.easyapi.com
 */
export const getAddress = id => axios.get(`${baseUrl}/address/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取我的默认地址信息
 */
export const getDefaultAddress = () => axios.get(`${baseUrl}/address/default`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 添加地址信息
 **
 * @see https://www.easyapi.com
 */
export const createAddress = (data) => axios.post(`${baseUrl}/address`, data);

/**
 * 修改地址信息
 **
 * @see https://www.easyapi.com
 */
export const putUpdateAddress = (id, data) => axios.put(`${baseUrl}/address/${id}`, data);

/**
 * 设置为默认地址
 *
 * @see https://www.easyapi.com
 */
export const updateAddress = id => {
  let data = {};
  data.accessToken = localStorage.getItem("accessToken");
  data.ifDefault = true;
  return axios.put(`${baseUrl}/address/${id}`, data)
}


/**
 * 删除地址
 *
 * @see https://www.easyapi.com
 */
export const deleteAddress = id => {
  let params = {}
  params.accessToken = localStorage.getItem("accessToken");
  return axios.delete(`${baseUrl}/address/${id}`, {params})
};

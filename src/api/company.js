import axios from "axios";

import {baseUrl} from "./api";

/**
 * 获取默认抬头信息
 *
 * @see https://www.easyai.com
 */
export const getCompanyList = (params) => axios.get(`${baseUrl}/companies`, {
  params,
  accessToken: localStorage.getItem("accessToken")
});

/**
 * 获取公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const getCompany = id => axios.get(`${baseUrl}/company/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 添加公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const createCompany = (data) => {
  data.accessToken = localStorage.getItem("accessToken");
  return axios.post(`${baseUrl}/company`, data);
}

/**
 * 修改公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const updateCompany = (id, data) => {
  data.accessToken = localStorage.getItem("accessToken");
  return axios.put(`${baseUrl}/company/${id}`, data);
}

/**
 * 删除公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const deleteCompany = id => {
  let params = {}
  params.accessToken = localStorage.getItem("accessToken");
  return axios.delete(`${baseUrl}/company/${id}`, {params})
};


/**
 * 获取默认抬头信息
 *
 * @see https://www.easyai.com
 */
export const getDefaultCompany = () => axios.get(`${baseUrl}/company/default`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 设置为默认抬头
 *
 * @see https://www.easyai.com
 */
export const updateDefaultCompany = id => {
  let data = {};
  data.accessToken = localStorage.getItem("accessToken");
  data.ifDefault = true;
  return axios.put(`${baseUrl}/company/${id}`, data)
}

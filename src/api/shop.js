import axios from "axios";

export const baseUrl = "https://fapiao-api.easyapi.com";

/**
 * 添加公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const createCompany = (id, data) => axios.post(`${baseUrl}/company`, {
  data: {
    data,
    accessToken: localStorage.getItem("accessToken"),
    ifDefault: true
  }
});

/**
 * 修改公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const updateCompany = (id, data) => axios.put(`${baseUrl}/company/${id}`, {
  data: {
    data,
    accessToken: localStorage.getItem("accessToken"),
    ifDefault: true
  }
});

/**
 * 删除公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const deleteCompany = id => axios.delete(`${baseUrl}/company/${id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken"),
    username: localStorage.getItem("username")
  }
});


/**
 * 设置为默认抬头
 *
 * @see https://www.easyai.com
 */
export const defaultCompany = id => axios.put(`${baseUrl}/company/${id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken"),
    ifDefault: true
  }
});

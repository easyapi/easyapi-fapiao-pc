import axios from "axios";

export const baseUrl = "https://fapiao-api.easyapi.com";

/**
 * 获取发票列表
 *
 * @see https://www.easyai.com
 */
export const getInvoiceList = (params) => axios.get(`${baseUrl}/api/invoice/records`, {
  params: {
    params,
    accessToken: localStorage.getItem("accessToken"),
    username: this.$store.state.username
  }
});

/**
 * 获取发票详情信息
 *
 * @see https://www.easyai.com
 */
export const getInvoice = (id) => axios.get(`${baseUrl}/api/invoice/record/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken"),
    username: this.$store.state.username
  }
});

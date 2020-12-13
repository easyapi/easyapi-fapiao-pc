import axios from "axios";

import {baseUrl} from "./api";

/**
 * 获取发票列表
 *
 * @see https://www.easyai.com
 */
export const getInvoiceList = (params) => axios.get(`${baseUrl}/invoices`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 获取发票详情信息
 *
 * @see https://www.easyai.com
 */
export const getInvoice = (id) => axios.get(`${baseUrl}/invoice/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取发票状态列表
 *
 * @see https://www.easyai.com
 */
export const getInvoiceStatementsList = () => axios.get(`${baseUrl}/api/invoice/record/statements`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

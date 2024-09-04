import request from '@/utils/request'
import { localStorage } from '@/utils/local-storage'

/**
 * 获取发票列表
 *
 * @see https://www.easyapi.com
 */
export async function getInvoiceListApi(params: any): Promise<any> {
  return request.get('/invoices', {
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    },
  })
}

/**
 * 获取发票详情信息
 */
export async function getInvoiceApi(id): Promise<any> {
  return request.get(`/api/invoice/record/${id}`, {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 获取发票状态列表
 *
 * @see https://www.easyapi.com
 */
export async function getInvoiceStatementsListApi(): Promise<any> {
  return request.get('/invoice/statements', {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 发票开具
 *
 * @see https://www.easyapi.com
 */
export async function mergeMakeApi(data: any): Promise<any> {
  data.accessToken = localStorage.get('accessToken')
  return request.post('/merge-make', data)
}

/**
 * 导出发票列表
 *
 * @see https://www.easyapi.com
 */
export async function invoiceExportApi(params: any): Promise<any> {
  return request.get('/invoice-export', {
    responseType: "blob",
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    }
  })
}

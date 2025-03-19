import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

/**
 * 获取外部订单列表
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderListApi(params: any): Promise<any> {
  return request.get('/out-orders', {
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    },
  })
}

/**
 * 获取外部订单详情
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderApi(no: string): Promise<any> {
  return request.get(`/out-order/${no}`, {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 获取未开票外部订单ID数组
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderIdsApi(params: any): Promise<any> {
  return request.get('/out-order/ids', {
    params: {
      ...params,
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 获取外部订单数量与总金额
 *
 * @see https://www.easyapi.com
 */
export async function amountApi(params: any): Promise<any> {
  return request.get('/out-order/amount', {
    params: {
      ...params,
      accessToken: localStorage.get('accessToken'),
    },
  })
}

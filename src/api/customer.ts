import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

/**
 * 获取我的客户信息
 *
 * @see https://www.easyapi.com
 */
export async function getCustomerApi(): Promise<any> {
  return request.get('/customer', {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 修改我的客户信息
 */
export async function updateCustomerApi(id: number, data: any): Promise<any> {
  data.accessToken = localStorage.get('accessToken')
  return request.put(`/customer/${id}`, data)
}

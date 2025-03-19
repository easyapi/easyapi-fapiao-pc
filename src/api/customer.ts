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

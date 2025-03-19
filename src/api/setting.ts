import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

/**
 * 获取发票列表
 *
 * @see https://www.easyapi.com
 */
export async function findSettingApi(params: any): Promise<any> {
  return request.get('/setting/find', {
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    },
  })
}

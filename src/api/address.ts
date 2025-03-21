import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

/**
 * 获取发票地址列表
 *
 * @see https://www.easyapi.com
 */

export async function getAddressListApi(params: any): Promise<any> {
  return request.get('/addresses', {
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    },
  })
}

/**
 * 获取发票地址信息
 *
 * @see https://www.easyapi.com
 */
export async function getAddressApi(id: number): Promise<any> {
  return request.get(`/address/${id}`, {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 获取我的默认地址信息
 */
export async function getDefaultAddressApi(): Promise<any> {
  return request.get('/address/default', {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 添加地址信息
 *
 * @see https://www.easyapi.com
 */

export async function createAddressApi(data: any): Promise<any> {
  data.accessToken = localStorage.get('accessToken')
  return request.post('/address', data)
}

/**
 * 修改地址信息
 *
 * @see https://www.easyapi.com
 */

export async function updateAddressApi(id: number, data: any): Promise<any> {
  data.accessToken = localStorage.get('accessToken')
  return request.put(`/address/${id}`, data)
}

/**
 * 设置为默认地址
 *
 * @see https://www.easyapi.com
 */
export async function defaultAddressApi(id: number): Promise<any> {
  return request.put(`/address/${id}`, {
    accessToken: localStorage.get('accessToken'),
    ifDefault: true,
  })
}

/**
 * 删除地址信息
 *
 * @see https://www.easyapi.com
 */
export async function deleteAddressApi(id: number): Promise<any> {
  return request.delete(`/address/${id}`, {
    params: {
      accessToken: localStorage.get('accessToken'),
    },
  })
}

/**
 * 获取省市区
 *
 * @see https://www.easyapi.com
 */
export async function getAreaListApi(): Promise<any> {
  return request.get('https://qiniu.easyapi.com/area.json')
}

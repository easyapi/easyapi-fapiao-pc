import request from '@/utils/request'
import { localStorage } from '@/utils/local-storage'

/**
 * 获取外部订单列表
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderListApi(params): Promise<any> {
    return request.get('/out-orders', {
        params: {
            accessToken: localStorage.get('accessToken'),
            ...params
        },
    })
}


/**
 * 获取外部订单详情
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderApi(no): Promise<any> {
    return request.get(`/out-order/${no}`, {
        params: {
            accessToken: localStorage.get('accessToken'),

        },
    })
}



export const baseUrl = 'https://fapiao-api.easyapi.com';//发票API接口根地址

//获取我的开票账户信息
export const invoiceMoneyUrl = `${baseUrl}/api/user/`;
//获取我的默认邮寄地址
export const invoiceAddressUrl = `${baseUrl}/address/`;

//获取订单价格
export const orderPriceUrl = `${baseUrl}/out-order/`;

//发票地址管理-----------------
//发票地址列表
export const addressesUrl = `${baseUrl}/addresses`;
//创建发票收货地址信息
export const addrUrl = `${baseUrl}/address`;

// 获取发票业务类型列表
export const orderTypesUrl = `${baseUrl}/order-types`;
// 根据类型获取相应列表
export const outOrderListUrl = `${baseUrl}/out-orders`;

//抬头信息查询（企业开票信息查询服务）
export const  queryServiceURl= `${baseUrl}/company/codes`;
//获取发票申请记录查询选项
export const applicationRecordUrl = `${baseUrl}/api/invoice/record/statements`;

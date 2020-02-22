export const fapiaoServiceUrl = 'https://fapiao-api.easyapi.com';//发票API接口根地址

//获取我的开票账户信息
export const invoiceMoneyUrl = `${fapiaoServiceUrl}/api/user/`;
//获取我的默认抬头
export const invoiceTitleUrl = `${fapiaoServiceUrl}/company/`;
//获取我的默认邮寄地址
export const invoiceAddressUrl = `${fapiaoServiceUrl}/address/`;
//获取发票申请记录列表
export const invoiceRecordsUrl = `${fapiaoServiceUrl}/api/invoice/records`;
//作废开票信息、详情
export const invoiceRecordUrl = `${fapiaoServiceUrl}/api/invoice/record/`;
//发票抬头管理-----------------
//发票抬头列表
export const companiesUrl = `${fapiaoServiceUrl}/companies`;
//创建发票抬头
export const companyUrl = `${fapiaoServiceUrl}/company`;
//获取订单价格
export const orderPriceUrl = `${fapiaoServiceUrl}/out-order/`;
//发票地址管理-----------------
//发票地址列表
export const addressesUrl = `${fapiaoServiceUrl}/addresses`;
//创建发票收货地址信息
export const addrUrl = `${fapiaoServiceUrl}/address`;
//获取发票订单列表-----------------
export const invoiceOrdersUrl = `${fapiaoServiceUrl}/api/invoice/items`;
// 获取发票业务类型列表
export const orderTypesUrl = `${fapiaoServiceUrl}/order-types`;
// 根据类型获取相应列表
export const outOrderListUrl = `${fapiaoServiceUrl}/out-orders`;
//申请开票 -----------------
export const applyInvoiceUrl = `${fapiaoServiceUrl}/api/invoice/apply`;
//抬头信息查询（企业开票信息查询服务）
export const  queryServiceURl= `${fapiaoServiceUrl}/company/codes`;
//获取发票申请记录查询选项
export const applicationRecordUrl = `${fapiaoServiceUrl}/api/invoice/record/statements`;

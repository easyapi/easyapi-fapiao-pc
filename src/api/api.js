export const baseUrl = 'https://fapiao-api.easyapi.com';//发票API接口根地址

//获取我的开票账户信息
export const invoiceMoneyUrl = `${baseUrl}/api/user/`;
//获取我的默认抬头
export const invoiceTitleUrl = `${baseUrl}/company/`;
//获取我的默认邮寄地址
export const invoiceAddressUrl = `${baseUrl}/address/`;
//获取发票申请记录列表
export const invoiceRecordsUrl = `${baseUrl}/api/invoice/records`;
//作废开票信息、详情
export const invoiceRecordUrl = `${baseUrl}/api/invoice/record/`;

//发票抬头管理-----------------
//发票抬头列表
export const companiesUrl = `${baseUrl}/companies`;
//创建发票抬头
export const companyUrl = `${baseUrl}/company`;
//获取订单价格
export const orderPriceUrl = `${baseUrl}/out-order/`;

//发票地址管理-----------------
//发票地址列表
export const addressesUrl = `${baseUrl}/addresses`;
//创建发票收货地址信息
export const addrUrl = `${baseUrl}/address`;

//获取发票订单列表-----------------
export const invoiceOrdersUrl = `${baseUrl}/api/invoice/items`;
// 获取发票业务类型列表
export const orderTypesUrl = `${baseUrl}/order-types`;
// 根据类型获取相应列表
export const outOrderListUrl = `${baseUrl}/out-orders`;

//申请开票 -----------------
export const applyInvoiceUrl = `${baseUrl}/api/invoice/apply`;
//抬头信息查询（企业开票信息查询服务）
export const  queryServiceURl= `${baseUrl}/company/codes`;
//获取发票申请记录查询选项
export const applicationRecordUrl = `${baseUrl}/api/invoice/record/statements`;

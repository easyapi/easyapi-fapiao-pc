/**
 * 获取复制文案
 */
export function copyText(invoice: any) {
  const textArr = `发票类型：${invoice.category}
  购方名称：${invoice.purchaserName}
  开票日期：${invoice.printTime ? invoice.printTime.substring(0, 10) : ''}
  ${invoice.code ? `发票代码：${invoice.code}，` : ''}
  ${invoice.number ? `发票号码：${invoice.number}，` : ''}
  ${invoice.allElectronicInvoiceNumber ? `全电号码：${invoice.allElectronicInvoiceNumber}` : ''}
  金额合计：${invoice.price}元
  ${invoice.downloadUrl ? `下载地址：${invoice.downloadUrl}` : `下载地址：${invoice.electronicInvoiceUrl}`}
  销方名称：${invoice.sellerName}`.split('\n').map(item => item.trimStart())
  return textArr.filter(item => item.trim() !== '').join('\n')
}

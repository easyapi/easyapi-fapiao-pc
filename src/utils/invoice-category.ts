/**
 * 发票分类
 */
export const invoiceCategoryList = [
  { value: '增值税电子普通发票', label: '增值税电子普通发票' },
  { value: '增值税普通发票', label: '增值税普通发票' },
  { value: '增值税专用发票', label: '增值税专用发票' },
  { value: '增值税电子专用发票', label: '增值税电子专用发票' },
  { value: '全电电子普通发票', label: '全电电子普通发票' },
  { value: '全电电子专用发票', label: '全电电子专用发票' },
]

export function invoiceTag(invoice: any) {
  if (invoice.category === '增值税电子普通发票') {
    return { name: '电普', color: '#00b2c8', bgColor: '#f2fbff' }
  }
  if (invoice.category === '增值税普通发票') {
    return { name: '普票', color: '#1950a5', bgColor: '#fff3f3' }
  }
  if (invoice.category === '增值税电子专用发票') {
    return { name: '电专', color: '#266253', bgColor: '#f2fbff' }
  }
  if (invoice.category === '增值税专用发票') {
    return { name: '专票', color: '#266253', bgColor: '#fff3f3' }
  }
  if (invoice.category === '全电电子普通发票') {
    return { name: '全电普', color: '#00b2c8', bgColor: '#f2fbff' }
  }
  if (invoice.category === '全电电子专用发票') {
    return { name: '全电专', color: '#665823', bgColor: '#f2fbff' }
  }
}

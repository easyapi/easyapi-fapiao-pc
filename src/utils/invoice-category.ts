/**
 * 发票分类
 */
export const invoiceCategoryList = [
  { value: '增值税电子普通发票', label: '增值税电子普通发票', type: '金税盘、税控盘、UKey开票' },
  { value: '增值税普通发票', label: '增值税普通发票', type: '金税盘、税控盘、UKey开票' },
  { value: '增值税专用发票', label: '增值税专用发票', type: '金税盘、税控盘、UKey开票' },
  { value: '增值税电子专用发票', label: '增值税电子专用发票', type: '金税盘、税控盘、UKey开票' },
  { value: '全电电子普通发票', label: '全电电子普通发票', type: '数电发票' },
  { value: '全电电子专用发票', label: '全电电子专用发票', type: '数电发票' },
  { value: '二手车销售统一发票', label: '二手车销售统一发票', type: '数电发票' },
  { value: '数电纸质发票（二手车销售统一发票）', label: '数电纸质发票（二手车销售统一发票）', type: '数电发票' },
  { value: '电子发票（二手车销售统一发票）', label: '电子发票（二手车销售统一发票）', type: '数电发票' },
]

export function invoiceTag(invoice: any) {
  if (!invoice.category) {
    return { name: '', color: '', bgColor: '', rgbaColor: '' }
  }
  if (invoice.category === '增值税电子普通发票') {
    return {
      name: '电普',
      color: '#00b2c8',
      bgColor: '#f2fbff',
      rgbaColor: '0,178,200',
    }
  }
  else if (invoice.category === '增值税普通发票') {
    return {
      name: '普票',
      color: '#1950a5',
      bgColor: '#edf1fa',
      rgbaColor: '25,80,165',
    }
  }
  else if (invoice.category === '增值税电子专用发票') {
    return {
      name: '电专',
      color: '#266253',
      bgColor: '#dbf5eb',
      rgbaColor: '38,98,83',
    }
  }
  else if (invoice.category === '增值税专用发票') {
    return {
      name: '专票',
      color: '#266253',
      bgColor: '#dbf5eb',
      rgbaColor: '38,98,83',
    }
  }
  else if (invoice.category === '全电电子普通发票' || invoice.category === '数电普通发票') {
    return {
      name: '数电普',
      color: '#00b2c8',
      bgColor: '#f2fbff',
      rgbaColor: '0,178,200',
    }
  }
  else if (invoice.category === '全电电子专用发票' || invoice.category === '数电专用发票') {
    return {
      name: '数电专',
      color: '#665823',
      bgColor: '#f8f4e5',
      rgbaColor: '102,88,35',
    }
  }
  else if (invoice.category === '二手车销售统一发票' || invoice.category === '数电纸质发票（二手车销售统一发票）') {
    return {
      name: '二手车纸票',
      color: '#1950a5',
      bgColor: '#edf1fa',
      rgbaColor: '25,80,165',
    }
  }
  else if (invoice.category === '电子发票（二手车销售统一发票）') {
    return {
      name: '二手车',
      color: '#a15f3b',
      bgColor: '#f8f4e5',
      rgbaColor: '102,88,35',
    }
  }
}

export function invoiceState(state: any) {
  if (state === '待审核' || state === '作废审核中' || state === '红冲审核中' || state === '待抓取') {
    return { color: '#ffffff', bgColor: '#2a9efb' }
  }
  if (state === '已开票') {
    return { color: '#15ad31', bgColor: '#f0f9eb' }
  }
  if (state === '审核未通过' || state === '已作废' || state === '已红冲' || state === '未开票' || state === '放弃开票') {
    return { color: '#666666', bgColor: '#f0f0f2' }
  }
  if (state === '开票失败') {
    return { color: '#ff3b30', bgColor: '#fff3f3' }
  }
  if (state === '开票中' || state === '红冲中' || state === '作废中') {
    return { color: '#e6a23c', bgColor: '#fdf6ec' }
  }
}

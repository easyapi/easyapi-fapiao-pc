import main from '@/views/index.vue'
import outOrder from '@/views/out-order/index.vue'
import invoiceDetail from '@/views/invoice/detail.vue'
import address from '@/views/address/index.vue'
import company from '@/views/company/index.vue'
import mergeMake from '@/views/make/merge-make.vue'
import singleOrder from '@/views/make/single-order.vue'
import singleQueryOrder from '@/views/make/single-query-order.vue'

const routes = [
    {
        path: '/',
        name: 'main',
        component: main,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            }
        ]
    },
    {
        path: '/out-order',
        name: 'outOrder',
        component: outOrder,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '索取发票',
                path: '/out-order'
            }
        ]
    },
    {
        path: '/invoice/detail',
        name: 'invoiceDetail',
        component: invoiceDetail,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '发票详情',
                path: '/invoice/detail'
            }
        ]
    },
    {
        path: '/address',
        name: 'address',
        component: address,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '邮寄地址管理',
                path: '/address'
            }
        ]
    },
    {
        path: '/company',
        name: 'company',
        component: company,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '发票抬头管理',
                path: '/company'
            }
        ]
    },
    {
        path: '/make/merge-make',
        name: 'mergeMake',
        component: mergeMake,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '索取发票',
                path: '/out-order'
            },
            {
                title: '开具发票',
                path: '/make/merge-make'
            }
        ]
    },
    {
        path: '/make/single-order',
        name: 'singleOrder',
        component: singleOrder,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '订单开票',
                path: '/make/single-order'
            }
        ]
    },
    {
        path: '/make/single-query-order',
        name: 'singleQueryOrder',
        component: singleQueryOrder,
        breadcrumb: [
            {
                title: '发票管理',
                path: '/'
            },
            {
                title: '订单开票',
                path: '/make/single-query-order'
            }
        ]
    },
]

export default routes
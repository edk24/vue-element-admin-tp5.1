import request from '@/utils/request'

// 查询所有快递公司
export function getAllExpressCompany() {
    return request({
        url: '/v1/express'
    })
}

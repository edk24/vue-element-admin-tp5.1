import request from '@/utils/request'
import qs from 'qs'

// 查询订单列表
export function getOrderList(page, limit, keyword, type, status) {
    return request({
        url: '/v1/order?' + qs.stringify({ page, limit, keyword, type, status, admin: 1 })
    })
}

// 取订单信息
export function getOrderInfo(id) {
    return request({
        url: '/v1/order/' + id
    })
}

// 删除订单
export function delOrder(id) {
    return request({
        url: '/v1/order/' + id,
        methods: 'delete'
    })
}

// 发货
export function shipOrder(id, data) {
    return request({
        url: '/v1/order/' + id,
        data
    })
}

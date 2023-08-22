import request from "@/utils/request";

export function getQRcode() {
    return request({
        url: '/getQRcode',
        method: 'get'
    })
}
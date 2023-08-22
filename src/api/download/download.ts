import request from "@/utils/request";

export function getContract(psw: string) {
    return request({
        url: '/getContract',
        method: 'post',
        headers: {
            'Content-Type': 'text/html'
        },
        data: psw
    })
}
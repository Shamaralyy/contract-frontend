import request from "@/utils/request";

export function uploadFile(psw: string, file: any) {
    return request({
        url: '/uploadFile?password='+psw,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: file,
    })
}
import request from "@/utils/request";

export function uploadFile(psw: string, file: any) {
    return request({
        url: '/uploadFile',
        method: 'post',
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        data: {
            file,
            psw
        }
    })
}
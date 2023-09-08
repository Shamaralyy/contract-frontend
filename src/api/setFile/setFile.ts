import request from "@/utils/request";

// export function uploadFile(psw: string, file: any) {
//     return request({
//         url: '/uploadFile?password='+psw,
//         method: 'post',
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         },
//         data: file,
//     })
// }

export function uploadFile(file: any,name:string,chunks:number,chunk:any) {
    return request({
        url: '/uploadFile',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: {
            file,
            name,
            chunks,
            chunk
        }
    })
}
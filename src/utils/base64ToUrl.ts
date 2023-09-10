export function getBase64URL(pic) {
    const blob = base64ImgtoFile(pic)
    const blobUrl = window.URL.createObjectURL(blob);
    return blobUrl
}

export function base64ImgtoFile (dataurl, filename = 'file') {
    //将base64格式分割：['data:image/png;base64','XXXX']
    // const arr = dataurl.split(',')
    
    // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    // const mime = arr[0].match(/:(.*?);/)[1]  //image/png
    const mime = 'image/png';
    //[image,png] 获取图片类型后缀
    // const suffix = mime.split('/')[1] //png
    const suffix = 'png';
    // const bstr = atob(arr[1])   //atob() 方法用于解码使用 base-64 编码的字符串
    const bstr = atob(dataurl)   //atob() 方法用于解码使用 base-64 编码的字符串
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

import { useRef } from 'react'
import SparkMD5 from "spark-md5";

export default function useFileSlicing(uploadFile, paramObj) {
    const chunkRefs: any = useRef([]); // 保存分片引用的引用
    const md5Ref: any = useRef(""); // 保存 MD5 值的引用
    const { fileArr } = paramObj;

    // 计算文件的 MD5 值
    function calculateMD5(file: any) {
        return new Promise((resolve) => {
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            const chunkSize = 5 * 1024 * 1024 * 1024;
            let currentChunk = 0;

            fileReader.onload = function (e: any) {
                spark.append(e.target.result);
                currentChunk++;
                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    const result = spark.end();
                    resolve(result);
                }
            };

            // 加载下一个分片
            function loadNext() {
                const start = currentChunk * chunkSize;
                const end = Math.min(file.size, start + chunkSize);
                const buffer = file.slice ? file.slice(start, end) : file.webkitSlice(start, end); // 使用 slice 方法
                fileReader.readAsArrayBuffer(buffer);
            }

            const chunks = Math.ceil(file.size / chunkSize); // 文件划分成的分片数量
            loadNext(); // 开始加载第一个分片
        });
    }

    // 将文件划分成多个分片
    function chunkFile(file: any, chunkSize: any) {
        const chunks = Math.ceil(file.size / chunkSize); // 文件划分成的分片数量
        const chunksList = [];
        let currentChunk = 0;

        while (currentChunk < chunks) {
            const start = currentChunk * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunk = file.slice ? file.slice(start, end) : file.webkitSlice(start, end); // 使用 slice 方法
            chunksList.push(chunk); // 将分片添加到列表中
            currentChunk++;
        }

        return chunksList; // 返回分片列表
    }

    const formDataArr: any = [];
    const handleFileChange = () => {
        // 返回promise，否则不能拿到最新formDataArr.length，会导致index >= formDataArr.length判断有误
        return new Promise((resolve, _reject) => {
            fileArr.forEach(async (file: any) => {
                const md5 = await calculateMD5(file); // 计算文件的 MD5 值
                md5Ref.current = md5; // 保存 MD5 值到引用
                // 将文件划分成多个分片并保存到引用对象中
                const chunksList: any = chunkFile(file, 5 * 1024 * 1024 * 1024);
                const formData = new FormData();
                //chunkRefs:将多个chunk转为formData
                chunkRefs.current = chunksList.map((chunk: any, index: any) => {
                    formData.append("file", chunk);
                    formData.append("name", file.name);  //文件名
                    formData.append("chunks", chunksList.length);  //总切片数
                    formData.append("chunk", index.toString());  //切片索引
                    formData.append("md5", md5Ref.current); // MD5
                    return formData;
                });
                formDataArr.push(chunkRefs.current);
                resolve(formDataArr);
            })
        })
    };

    async function uploadChunk() {
        return new Promise(async (resolve, reject) => {
            await handleFileChange();
            let len = 0;
            let index = 0;
            for (index; index < formDataArr.length; index++) {
                formDataArr[index].forEach(async (item: any) => {
                    len++;
                    try {
                        const res = await uploadFile(item.get("file"), item.get("name"), item.get("chunks"), item.get("chunk")); // 调用上传函数上传当前分片，此处为调用上传的接口
                        console.log('uploadFile-res', res);
                        if (index === len) resolve(res);
                    } catch (error) {
                        reject(error);
                        return;
                    }
                })
            }

        })
    }
    return { uploadChunk }
}

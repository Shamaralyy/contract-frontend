import { useRef } from 'react'
import SparkMD5 from "spark-md5";
import { message } from 'antd';

export default function useFileSlicing(uploadFile, paramObj) {
    const chunkRefs: any = useRef([]); // 保存分片引用的引用
    const md5Ref: any = useRef(""); // 保存 MD5 值的引用
    const { password, fileArr, setFileList, setIsGenerate } = paramObj;

    // 计算文件的 MD5 值
    function calculateMD5(file: any) {
        return new Promise((resolve) => {
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            const chunkSize = 5 * 1024 * 1024;
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
        return new Promise((resolve,_reject) => {
            console.log('fileArr', fileArr);
            fileArr.forEach(async (file: any) => {
                const md5 = await calculateMD5(file); // 计算文件的 MD5 值
                md5Ref.current = md5; // 保存 MD5 值到引用
                // 将文件划分成多个分片并保存到引用对象中
                const chunksList: any = chunkFile(file, 5 * 1024 * 1024);
                console.log('chunksList', chunksList);
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
                console.log('formDataArr', formDataArr);
            })
        })
    };

    async function uploadChunk() {
        setIsGenerate(false);
        await handleFileChange();
        // 定义递归函数用于逐个上传分片
        const uploadChunk = async (index: any) => {
            console.log(`index`, index);
            console.log(`formDataArr.length`, formDataArr.length);
            if (index >= formDataArr.length) {
                // 所有分片上传完成
                message.success("文件上传成功！");
                console.log("文件上传成功！");
                return;
            }
            try {
                // const res = await uploadFile(password, formDataArr[index]); // 调用上传函数上传当前分片，此处为调用上传的接口
                const res = await uploadFile(formDataArr[index]); // 调用上传函数上传当前分片，此处为调用上传的接口
                console.log('uploadFile-res', res);
                console.log(`分片 ${index + 1} 上传成功`);
                setIsGenerate(true);
                message.success('上传成功');
                // props.setUrl(res.data)   //二维码url
                setFileList([]);
                // 递归调用上传下一个分片
                await uploadChunk(index + 1);
                return;
            } catch (error) {
                console.error(`分片 ${index + 1} 上传失败`, error);
                message.error("文件上传失败！");
                return;
            }
        };

        // 开始递归上传第一个分片
        await uploadChunk(0);
    }

    return { uploadChunk }
}

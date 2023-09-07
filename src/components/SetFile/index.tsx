import { useState, useRef } from 'react';
import { Button, message, Upload, Modal, Input, Spin, Space } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import SparkMD5 from "spark-md5";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import useValidate from '../../hooks/useValidate';
import { uploadFile } from '@/api/setFile/setFile';
import './index.css'

interface Props {
  len: number;
  setUrl: Function;
}

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

function SetFile(props: Props) {
  const { open, setOpen, password, iptStatus, changeIpt, ok } = useValidate(commit, () => { });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isGenerate, setIsGenerate] = useState<boolean>(false);
  const { Dragger } = Upload;

  const draggerProps: UploadProps = {
    name: 'file',
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
  };

  async function uploadChunk() {
    // 定义递归函数用于逐个上传分片
    const uploadChunk = async (index: any) => {
      if (index >= chunkRefs.current.length) {
        // 所有分片上传完成
        message.success("文件上传成功！");
        return;
      }
      try {
        console.log('chunkRefs.current[index]', chunkRefs.current[index]);
        const res = await uploadFile(password, chunkRefs.current[index]); // 调用上传函数上传当前分片，此处为调用上传的接口
        console.log('uploadFile-res', res);
        console.log(`分片 ${index + 1} 上传成功`);
        message.success('上传成功');
        props.setUrl(res.data)   //二维码url
        setFileList([]);
        setIsGenerate(false);
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

  function complete() {
    if (!props.len) {
      message.error('合同内容不能为空');
    }
    else if (!fileList.length) {
      message.error('请先上传文件');
    }
    else {
      setOpen(true)
    }
  }

  //输入密码后点击确认按钮
  function commit() {
    const formData = new FormData();
    fileList.forEach((file) => {
      console.log('file', file);
      formData.append('files[]', file as RcFile);
      console.log('formData', formData);
    });
    setIsGenerate(true);
    console.log(formData.getAll('files[]'));
    // uploadChunk();
    uploadFile(password, formData)
      .then((res) => {
        console.log('uploadFile-res', res);
        message.success('上传成功');
        props.setUrl(res.data)   //二维码url
        setFileList([]);
        setIsGenerate(false);
      })
      .catch(() => {
        message.error('上传失败');
        setIsGenerate(false);
      })
  }

  const chunkRefs: any = useRef([]); // 保存分片引用的引用
  const md5Ref: any = useRef(""); // 保存 MD5 值的引用
  const formData = new FormData();

  const handleFileChange = async ({ file }: any) => {
    const md5 = await calculateMD5(file); // 计算文件的 MD5 值
    md5Ref.current = md5; // 保存 MD5 值到引用
    console.log('fileeee', file);

    // 将文件划分成多个分片并保存到引用对象中
    const chunksList: any = chunkFile(file, 5 * 1024 * 1024);
    console.log('chunksList',chunksList);
    
    //chunkRefs:将多个chunk转为formData
    chunkRefs.current = chunksList.map((chunk: any, index: any) => {
      formData.append("file", chunk);
      formData.append("fileName", file.name);
      formData.append("totalPieces", chunksList.length);
      formData.append("sliceIndex", index.toString());
      formData.append("md5", md5Ref.current); // 添加 MD5 参数

      console.log('formData.getAll("fileName")',formData.getAll("fileName"));
      return formData;
    });

    console.log('chunkRefs.current',chunkRefs.current);

  };

  const handleRemove = () => {
    // 清空保存的分片引用、MD5 引用和重置进度条
    chunkRefs.current = [];
    md5Ref.current = "";
  };

  const loading = (<Space className='loading-space' direction="vertical" style={{ width: '100%' }}>
    <Spin tip="正在生成二维码中……" size="large">
      <div className="content" />
    </Spin></Space>)

  const setFileSpace = (
    <div>
      {/* <Upload
        name="file"
        multiple={false}
        beforeUpload={() => false}
        onChange={handleFileChange}
        onRemove={handleRemove} // 添加自定义的删除操作
      >
        <Button icon={<UploadOutlined />}>
          "选择文件"
        </Button>
      </Upload> */}
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
      <Button className='complete-btn' onClick={complete}>完成</Button>
      <Modal
        title="设置密码"
        open={open}
        onOk={() => ok()}
        onCancel={() => setOpen(false)}
        width={600}
        style={{ top: 160 }}
        okText="确认"
        cancelText="取消"
      >
        <Input className='ipt' status={iptStatus} placeholder="请输入密码……" value={password} onChange={e => changeIpt(e.target.value)} />
        <span className='tip'>{iptStatus && '密码不能为空'}</span>
      </Modal>
    </div>
  )

  return (
    <>
      {
        isGenerate ?
          loading :
          setFileSpace
      }
    </>
  )
}

export default SetFile
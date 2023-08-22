import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, message, Upload, Modal, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import useValidate from '../../hooks/useValidate';
import { uploadFile } from '@/api/setFile/setFile';
import './index.css'

function App() {
  const navigate = useNavigate();
  const { open, setOpen, password, iptStatus, changeIpt, ok } = useValidate(commit, () => { });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { Dragger } = Upload;

  function toPage(url: string): void {
    navigate(`/${url}`)
  }

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    uploadFile(password, formData)
      .then((res) => {
        console.log('uploadFile-res', res);
        message.success('上传成功');
        setFileList([]);
        toPage('');
      })
      .catch(() => {
        message.error('上传失败');
      })
  }

  function commit() {
    if (!fileList.length) {
      message.error('请先上传文件');
    } else {
      console.log('文件', fileList);
      handleUpload();
    }
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    }
  };

  return (
    <div className="container">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
      <Button className='complete-btn' onClick={() => setOpen(true)}>完成</Button>
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
}

export default App

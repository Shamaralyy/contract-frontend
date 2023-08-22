import { useNavigate } from 'react-router-dom'
import { Button, message, Upload, Modal, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import useValidate from '../../hooks/useValidate';
import './index.css'

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function App() {
  const navigate = useNavigate();
  const { open, setOpen, password,iptStatus, changeIpt, ok } = useValidate(() => toPage(''), () => {});

  function toPage(url: string): void {
    console.log(url);
    navigate(`/${url}`)
  }

  return (
    <div className="container">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
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

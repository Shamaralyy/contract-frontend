import { useState } from 'react';
import { Button, message, Upload, Modal, Input, Spin, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import useValidate from '@/hooks/useValidate';
import useFileSlicing from '@/hooks/useFileSlicing';
import { uploadFile } from '@/api/setFile/setFile';
import './index.css'

interface Props {
  len: number;
  setUrl: Function;
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

  const fileArr: any = [];
  //输入密码后点击确认按钮
  function commit() {
    fileList.forEach((file) => {
      fileArr.push(file);
    });
    uploadChunk();
  }

  const paramObj = { password, fileArr, setFileList, setIsGenerate };
  const { uploadChunk } = useFileSlicing(uploadFile, paramObj);

  const loading = (<Space className='loading-space' direction="vertical" style={{ width: '100%' }}>
    <Spin tip="正在生成二维码中……" size="large">
      <div className="content" />
    </Spin></Space>)

  const setFileSpace = (
    <div>
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
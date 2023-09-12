import { useState} from "react";
import { Button, Input, Spin, Space } from 'antd';
import useSignature from "@/hooks/useSignature";
import useQRcode from "@/hooks/useQRcode";
import './index.css'

export default function upLoad() {
  // const { TextArea } = Input;
  const [url] = useState<string>('');
  // const [value, setValue] = useState<string>('');
  const { Signature, getCanvasImage } = useSignature();
  const { setFileSpace, isGenerate, commit } = useQRcode({signatureUrl:'123'});

  // const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setValue(e.target.value)
  // };

  //输入密码后点击确认按钮
  const generateQRcode = () => {
    const signatureUrl = getCanvasImage();
    commit(signatureUrl);
  }

  const loading = (<Space className='loading-space' direction="vertical" style={{ width: '100%' }}>
    <Spin tip="正在生成二维码中……" size="large">
      <div className="content" />
    </Spin></Space>)

  const space = (
    <>
      {
        isGenerate ?
          loading :
          <>
            {setFileSpace}
            {Signature}
            <Button className='upload-btn' type='primary' onClick={generateQRcode}>生成二维码</Button>
          </>
      }
    </>
  )

  return (
    <div className="container upload-box">
      {/* <TextArea
        showCount
        className="ipt-area"
        onChange={onChange}
        placeholder="请输入合同内容……"
        value={value}
        autoSize={{ minRows: 10 }}
      /> */}
      {url ? null : space}
    </div>
  )
}

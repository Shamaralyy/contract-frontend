import { Input } from "antd";
import { useState } from "react";
import SetFile from "@/components/SetFile";
import './index.css'

export default function upLoad() {
  const { TextArea } = Input;
  const [url, setUrl] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  };

  return (
    <div className="container upload-box">
      <TextArea
        showCount
        className="ipt-area"
        onChange={onChange}
        placeholder="请输入合同内容……"
        value={value}
        autoSize={{ minRows: 10 }}
      />
      {url ? <img className="QRcode" src={url} alt="" /> : <SetFile len={value.length} setUrl={setUrl}/>}
    </div>
  )
}

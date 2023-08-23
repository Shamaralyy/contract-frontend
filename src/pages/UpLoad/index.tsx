import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getQRcode } from "@/api/upload/upload";
import SetFile from "@/components/SetFile";
import './index.css'

export default function upLoad() {
  const navigate = useNavigate();
  const { TextArea } = Input;
  const [urls, setUrls] = useState<Array<string>>([]);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    getQRcode()
      .then(res => {
        console.log('getQRcode-res', res);
        const newUrl = URL.createObjectURL(res.data);
        setUrls([...urls, newUrl])
      })
  }, [])

  function toPage(url: string) {
    navigate(`/${url}`)
  }

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
      <SetFile len={value.length}/>
      <div>
        {
          urls.map(url => <img src={url} alt="" />)
        }
      </div>
    </div>
  )
}

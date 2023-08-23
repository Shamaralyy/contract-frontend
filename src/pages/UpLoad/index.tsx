import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getQRcode } from "@/api/upload/upload";
import './index.css'

export default function upLoad() {
  const navigate = useNavigate();
  const { TextArea } = Input;
  const [urls, setUrls] = useState<Array<string>>([]);

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
    console.log('Change:', e.target.value);
  };

  return (
    <div className="container">
      <TextArea
        showCount
        className="ipt-area"
        onChange={onChange}
        placeholder="请输入合同内容……"
        autoSize={{ minRows: 10 }}
      />
      <Button className="upload-btn" type="primary" onClick={() => toPage('setFile')}>上传文件</Button>
      <div>
        {
          urls.map(url => <img src={url} alt="" />)
        }
      </div>
    </div>
  )
}

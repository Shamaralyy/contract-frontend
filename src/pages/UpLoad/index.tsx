import { QRCode, Space, Button } from "antd";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getQRcode } from "@/api/upload/upload";
import './index.css'

export default function upLoad() {
  const navigate = useNavigate();
  const [text,] = useState('https://ant.design/');
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

  return (
    <div className="container">
      <Button className="upload-btn" type="primary" onClick={() => toPage('setFile')}>上传文件</Button>
      <div>
        {
          urls.map(url => <img src={url} alt="" />)
        }
        <Space className="space" direction="vertical" align="center">
          <QRCode value={text || '-'} />
        </Space>
      </div>
    </div>
  )
}

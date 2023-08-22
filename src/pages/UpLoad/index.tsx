import { Input, QRCode, Space, Button } from "antd";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import './index.css'

export default function upLoad() {
  const navigate = useNavigate();
  const [text, setText] = useState('https://ant.design/');

  function toPage(url: string) {
    navigate(`/${url}`)
  }

  return (
    <div className="container">
      <Button className="upload-btn" type="primary" onClick={() => toPage('setFile')}>上传文件</Button>
      <br/>
      <Space direction="vertical" align="center">
        <QRCode value={text || '-'} />
      </Space>
    </div>
  )
}

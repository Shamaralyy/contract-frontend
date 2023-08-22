import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import useValidate from '../../hooks/useValidate';
import './index.css'

const App: React.FC = () => {
    const { password, iptStatus, changeIpt, ok } = useValidate(successCallback, () => { });
    const navigate = useNavigate();

    function successCallback() {
        navigate('/file')
    }

    return (
        <>
            <p className='title'>提取文件：</p>
            <Input status={iptStatus} placeholder="请输入密码……" value={password} onChange={e => changeIpt(e.target.value)}/>
            <p className='tip'>{iptStatus && '密码不能为空'}</p>
            <Button type="primary" onClick={ok}>确定</Button>
        </>
    )
};

export default App;
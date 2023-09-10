import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import useValidate from '../../hooks/useValidate';
import { getContract } from '@/api/download/download';
import './index.css'

const App: React.FC = () => {
    const { password, iptStatus, changeIpt, ok } = useValidate(successCallback, () => { });
    const navigate = useNavigate();

    function successCallback() {
        getContract(password)
            .then((res) => {
                console.log('postPsw-res', res);
                navigate('/file', {
                    state: {
                        html: res.data
                    }
                })
            })
            .catch(() => {
                message.error('密码错误');
            })
    }

    return (
        <div className='container'>
            <div>
                <p className='title'>提取文件：</p>
                {/* @ts-ignore */}
                <Input status={iptStatus} placeholder="请输入密码……" value={password} onChange={e => changeIpt(e.target.value)} />
                <p className='tip'>{iptStatus && '密码不能为空'}</p>
                <Button className='btn-download' type="primary" onClick={ok}>确定</Button>
            </div>
        </div>
    )
};

export default App;
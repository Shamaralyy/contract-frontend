import { useState } from 'react';
import { message, Upload, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import useValidate from '@/hooks/useValidate';
import useFileSlicing from '@/hooks/useFileSlicing';
import { uploadFile } from '@/api/setFile/setFile';
import { getBase64URL } from '@/utils/base64ToUrl';

// interface Props {
//     len: number;
//     setUrl: Function;
// }

export default function useQRcode() {
    const navigate = useNavigate();
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
            if (file.size > 10 * 1024 * 1024 * 1024) message.error('文件大小必须在10GB以下');
            else setFileList([...fileList, file]);
            return false;
        },
    };

    const fileArr: any = [];
    //输入密码后点击确认按钮
    function commit(signatureUrl: string) {
        if (!fileList.length) {
            message.error('请先上传文件');
            return;
        }
        fileList.forEach((file) => {
            fileArr.push(file);
        });
        // let QRcodeUrls = ['https://img2.baidu.com/it/u=2930034061,3539379760&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        //     'https://img2.baidu.com/it/u=2930034061,3539379760&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        //     'https://img2.baidu.com/it/u=2930034061,3539379760&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500']
        // navigate('/file', {
        //     state: {
        //         QRcodeUrls,
        //         signatureUrl
        //     }
        // });
        setIsGenerate(true);
        uploadChunk()
            .then((res: any) => {
                message.success("文件上传成功！");
                setFileList([])
                navigate('/file', {
                    state: {
                        QRcodeUrls: [res.data],
                        signatureUrl
                    }
                });
            })
            .catch((error) => {
                console.error(`分片上传失败`, error);
                message.error("文件上传失败！");
            })
            .finally(() => {
                setIsGenerate(false);
            })
    }

    const paramObj = { password, fileArr, setFileList };
    const { uploadChunk } = useFileSlicing(uploadFile, paramObj);

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
            {/* <Button className='complete-btn' onClick={complete}>完成</Button> */}
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
                {/* @ts-ignore */}
                <Input className='ipt' status={iptStatus} placeholder="请输入密码……" value={password} onChange={e => changeIpt(e.target.value)} />
                <span className='tip'>{iptStatus && '密码不能为空'}</span>
            </Modal>
        </div>
    )

    return {
        setFileSpace,
        isGenerate,
        commit
    }
}

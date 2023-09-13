import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "antd";
import { exportPDF } from '@/utils/exportPDF';
import { convertChineseDate } from '@/utils/convertChineseDate';
import './index.css'

export default function index() {
    const location = useLocation();
    const { QRcodeUrls, signatureUrl } = location.state ? location.state : { QRcodeUrls: [], signatureUrl: '' };
    // const html = location.state?.html;
    // const [htmlContent, setHtmlContent] = useState('');
    const pdfRef = useRef<any>();

    useEffect(() => {
        // setHtmlContent(html);
        // return () => {
        //     setHtmlContent('');
        // };
        console.log('QRcodeUrls', QRcodeUrls);
        // console.log('signatureUrl', signatureUrl);
        console.log('data:image/png;base64,' + QRcodeUrls[0]);
    }, []);

    const onExportPDF = () => {
        exportPDF('测试导出PDF', pdfRef.current)
    }

    return (
        <div className='flex file-container'>
            <div ref={pdfRef} className='pdf-box flex'>
                {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div> */}
                <h2 className='contract-title'>证&nbsp;&nbsp;明</h2>
                <p className='contract-text'> &nbsp;&nbsp;兹证明我本人提供的相关资料内容和如下所有视频（或音频）<br />
                    附属文件均真实有效。如有虚假本人愿为其造成的后果负全部责任。</p>
                <div className='QRcode-box'>
                    {
                        QRcodeUrls.map((url: string) => {
                            return (
                                <img className="QRcode" src={'data:image/png;base64,' + url} alt="" />
                            )
                        })
                    }
                </div>
                <img className="signature" src={signatureUrl} alt="" />
                <p className="date">{convertChineseDate()}</p>
            </div>
            <Button className='btn-file' type='primary' onClick={onExportPDF}>导出pdf</Button>
        </div>
    )
}

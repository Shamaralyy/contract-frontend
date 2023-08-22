import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "antd";
import { exportPDF } from '@/utils/exportPDF';
import './index.css'

export default function index() {
    const location = useLocation();
    const html = location.state?.html;
    const [htmlContent, setHtmlContent] = useState('');
    const pdfRef = useRef<any>();

    useEffect(() => {
        setHtmlContent(html);
        return () => {
            setHtmlContent('');
        };
    }, []);

    const onExportPDF = () => {
        exportPDF('测试导出PDF', pdfRef.current)
    }

    return (
        <>
            <Button className='btn-file' type='primary' onClick={onExportPDF}>导出pdf</Button>
            <div ref={pdfRef}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            </div>
        </>
    )
}

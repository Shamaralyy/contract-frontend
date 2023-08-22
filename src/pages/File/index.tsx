import React, { useRef } from 'react';
import { Button } from "antd";
import { exportPDF } from '../../common/exportPDF';
import './index.css'

export default function index() {
    const pdfRef = useRef<any>();
    const onExportPDF = () => {
        exportPDF('测试导出PDF', pdfRef.current)
    }
    return (
        <div className='container'>
            <Button className='btn' type='primary' onClick={onExportPDF}>导出pdf</Button>
            <div ref={pdfRef}>
                <h1>合同</h1>
                <div className="contract-section">
                    <h2>合同信息</h2>
                    <table>
                        <tr>
                            <th>合同编号：</th>
                            <td>[合同编号]</td>
                        </tr>
                        <tr>
                            <th>签约日期：</th>
                            <td>[签约日期]</td>
                        </tr>
                        <tr>
                            <th>甲方：</th>
                            <td>[甲方名称]</td>
                        </tr>
                        <tr>
                            <th>乙方：</th>
                            <td>[乙方名称]</td>
                        </tr>
                    </table>
                </div>
                <div className="contract-section">
                    <h2>合同条款</h2>
                    <table>
                        <tr>
                            <th>条款一：</th>
                            <td>[条款一内容]</td>
                        </tr>
                        <tr>
                            <th>条款二：</th>
                            <td>[条款二内容]</td>
                        </tr>
                        <tr>
                            <th>条款三：</th>
                            <td>[条款三内容]</td>
                        </tr>
                    </table>
                </div>
                <div className="footer">
                    <p>此合同在双方签字或盖章后生效</p>
                </div>
            </div>
        </div>
    )
}

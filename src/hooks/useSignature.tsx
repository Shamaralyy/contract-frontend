/**
 * 签名
 **/
import React, { useRef } from 'react';
import { Button } from 'antd';
import SignatureCanvas from 'react-signature-canvas'

export default function useSignature() {
    const sigCanvas = useRef({});

    const getCanvasImage = () => {
        const base64Img = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        return base64Img;
    };

    const clear = () => {
        sigCanvas.current.clear();
    }

    const Signature = (
        <div className='signature-container'>
            <SignatureCanvas
                penColor='black'
                ref={sigCanvas}
                canvasProps={{
                    width: '600px', height: '200px', style: { position: 'absolute', top: 0, left: 0, },
                    className: 'sigCanvas'
                }} />
            <Button className='clear-btn' onClick={clear}>清除</Button>
        </div>
    )

    return { Signature, getCanvasImage }
}

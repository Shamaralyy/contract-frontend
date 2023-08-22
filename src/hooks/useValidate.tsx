import { useState } from 'react';
/**
 * 用于输入框校验的。
 * @param successCallback - 成功回调函数
 * @param failCallback - 失败回调函数
 * @returns {} - 返回open：控制弹窗打开，password：输入框密码，iptStatus：输入框状态，changeIpt：输入框改变函数，ok：点击确认函数
 */

type voidFn = (args?:any) => void

function useValidate(successCallback: voidFn, failCallback: voidFn) {
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPsw] = useState<string>('');
    const [iptStatus, setIptStatus] = useState<string>('');
    function changeIpt(val: string) {
        setPsw(val)
        if (password && iptStatus) {
            setIptStatus('')
        }
    }

    function ok() {
        if (!password) { //失败
            console.log('error');
            setIptStatus('error')
            failCallback();
        } else {  //成功
            setOpen(false)
            console.log(password);
            // navigate('/')
            successCallback();
        }
    }

    return {
        open, setOpen, password, iptStatus, changeIpt, ok
    }
}

export default useValidate;
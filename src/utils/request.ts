import axios from 'axios'
import type { AxiosRequestConfig } from 'axios';

export default function request(config:AxiosRequestConfig) {
    const instance = axios.create({
        baseURL: 'http://localhost:8080',
        timeout: 5000,
    })

    instance.interceptors.request.use(function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    instance.interceptors.response.use(function(response) {
        return response
    },function(error) {
        console.error('error',error);
        if(error.response) {
            if(error.response.status == 500) {
                console.error('服务器发生错误 500')
            }
        }
        return Promise.reject(error)
    })

    return instance(config);
}
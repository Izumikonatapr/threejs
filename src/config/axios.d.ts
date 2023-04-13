// 定义axios请求返回结果的类型
import axios from 'axios'

declare module 'axios' {
    type code = number | string
    interface IAxios<D = null> {
        code: code
        message: string
        extra: D
    }
    export interface AxiosResponse<T = any> extends IAxios<D> { }
}


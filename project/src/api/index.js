import axios from 'axios';
//设置默认参数
axios.defaults.baseURL = '/tk'
axios.defaults.timeout = 5000

//请求拦截
axios.interceptors.request.use((config) => {
    // console.log('加载中');
    return config
})
//响应拦截
axios.interceptors.response.use(res=>{
    return res.data
})

//数据请求
export const getData = (url) => {
    return axios.get(url)
}
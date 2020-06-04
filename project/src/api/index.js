import axios from 'axios';
//设置默认参数
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 5000

//请求拦截
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config.headers.Authorization);
    return config
})
//响应拦截
axios.interceptors.response.use(res=>{
    return res.data
})
export default axios
// //数据请求
// export const getData = (url) => {
//     return axios.get(url)
// }
import axios from 'axios';
// import dotenv from 'dotenv';


const instance = axios.create({
    baseURL: "http://127.0.0.1:8088/v2",
    timeout:1000,
})

// 获取token
function getToken(){
    let cookieValue = null;
    document.cookie.split(';').forEach(item => {
        let [n,v] = item.trim().split('=');
        if (n === "jwt"){
            cookieValue = v
        }
    });
    return cookieValue
}


// 请求拦截器
instance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},error => {
    return Promise.reject(error);
})

// 响应拦截器
instance.interceptors.response.use(response => {
    return response;
},error => {
    return Promise.reject(error);
})

export default instance;

// if (process.env.NODE_ENV === 'production') {
//     require('dotenv').config({path:'.env.production'});
// }else {
//     require('dotenv').config();
// }
//
// const instance = axios.create({
//     baseURL: process.env.VUE_APP_BASE_URL,
// })
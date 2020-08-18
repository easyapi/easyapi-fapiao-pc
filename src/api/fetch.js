import axios from 'axios'

//拦截器
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('accessToken');
  if (config.params) {
    config.params.accessToken = token;
  }
  if (config.data) {
    let data = config.data;
    data.accessToken = token;
    config.data = data;
  }
  return config;
}, function (error) {
  console.log(error);
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default axios

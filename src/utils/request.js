import axios from 'axios';

/**
 * @author William Cui
 * @description 自定义配置请求axios实例
 * @return Promise 对象
 * @date 2018-05-23
 **/


const request = axios.create({
	withCredentials: true,
	timeout: 1000 * 30,
	// headers: { 'Content-Type': 'application/json' }
});

request.interceptors.response.use(
	function (response) {
		if (response.status === 200) {
			return response.data;
		} else {

		}
	},
	function (error) {
		// Do something with response error
		return Promise.reject(error);
	}
);

export default request;


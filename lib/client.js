const axios = require('axios');

module.exports = function (token) {
	axios.interceptors.request.use(function (config) {
		config.headers['Authorization'] = 'Bearer ' + token;
		return config;
	}, function (error) {
		// Do something with request error
		return Promise.reject(error);
	});
	return axios;
};


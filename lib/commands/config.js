/*
* Config
* 配置命令
* 特点：
* */
class Config {
	constructor(key, value, options = {}) {
		console.log('Config');
		console.log(key, value, options);
	}
}

module.exports = function (...arg) {
	return new Config(...arg);
};

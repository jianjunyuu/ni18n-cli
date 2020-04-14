const path = require('path');
const homedir = require('os').homedir();
const fs = require('fs');

exports.fileName = '.ni18nrc';
// 配置文件在电脑上的位置
// exports.path = path.resolve(homedir, fileName);
// const config = await fs.readJson(file);
// 增删改查

//
//
// class Rc {
// 	static path = path;
//
// 	constructor() {
// 	}
//
// 	// 获取配置信息
// 	get(key) {
// 	}
//
// 	// 设置配置信息
// 	set(key, value) {
// 	}
//
// 	// 删除配置信息
// 	delete(key) {
//
// 	}
//
// 	deleteAll() {
//
// 	}
//
// 	_getRc() {
//
// 	}
//
// 	_setRc(value) {
//
// 	}
// }

// 创建配置文件
exports.create = function create(data = {}) {
	require('./fsUtils').generateFile(exports.fileName, '.', data, null, 2);
};

// 判断执行目录下是否有配置文件，返回布尔
exports.isExists = function isExists() {
	return fs.existsSync(exports.fileName);
};

exports.get = function getRc() {
	if (exports.isExists()) {
		let config = fs.readFileSync(exports.fileName);
		try {
			return JSON.parse(config);
		} catch (e) {
			return null;
		}
	} else {
		return null;
	}
}

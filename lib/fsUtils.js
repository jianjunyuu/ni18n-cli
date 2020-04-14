const fs = require('fs');
const Path = require('path');

// 同步生成文件
exports.generateFile = function (name = '', dest = '', ...arg) {
	return fs.writeFileSync(`${dest}/${name}`, JSON.stringify(...arg));
};

// 递归删除文件
exports.deleteFolderRecursive = function(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file, index) => {
			const curPath = Path.join(path, file);
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

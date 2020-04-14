/*
* Major
* 主命令
* 特点：匹配不到command或者argument
* */
const fs = require('fs');
const chalk = require('chalk');

class Major {
	constructor(options = {}) {
		// 查找本地是否有默认的文件
		// 可以配置 .ni18nrc
		let isHasRc = require('../rc').isExists();
		let isHasLocalFile = fs.existsSync(require('../config').fileName);
		if (isHasRc) {
			require('./download')(options);
		} else if (isHasLocalFile) {
			require('./cpath')(require('../config').fileName, options);
		} else {
			console.log();
			console.log(chalk.red('没有可执行的命令，您可以检查一下情况：'));
			console.log(chalk.cyan('a) 如果您想使用第三方接口方式下载：'));
			console.log(chalk.cyan('   请运行命令：'));
			console.log(chalk.gray('   > ni18n init'));
			console.log(chalk.gray('   > ni18n'));
			console.log();
			let df = chalk.gray(require('../config').fileName);
			console.log(chalk.cyan(`b) 如果您想使用本地文件，比如：\`${df}\``));
			console.log(chalk.cyan(`   请先新建文件 ${df} 到当前执行目录`));
			console.log(chalk.gray('   > ni18n'));
			console.log();
			console.log(chalk.cyan(`c) 如果已存在其他本地文件，请尝试执行：`));
			console.log(chalk.gray('   > ni18n <你的文件>'));
			console.log();
		}
	}
}

module.exports = function (...arg) {
	return new Major(...arg);
};

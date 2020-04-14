/*
* Cpath
* 下载命令
* 特点：
* */
const xlsx = require('xlsx');
const ora = require('ora');
const chalk = require('chalk');
class Cpath {
	constructor(path, options = {}) {
		let spinner = ora();
		spinner.start(chalk.grey('generating...'));
		try {
			const workbook = xlsx.readFile(path, {type: 'array'});
			require('../utils').generate(workbook, options);
			spinner.succeed(chalk.green('generated successfully.'));
		} catch (e) {
			console.log(e);
			spinner.fail(chalk.red('generate failed!'));
			spinner.clear();
			process.exit(1);
		}
	}
}

module.exports = function (...arg) {
	return new Cpath(...arg);
};

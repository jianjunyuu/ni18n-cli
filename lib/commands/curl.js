/*
* Curl
* 直接读取远程链接文件命令
* 特点：
* */
const xlsx = require('xlsx');
const ora = require('ora');
const chalk = require('chalk');

class Curl {
	constructor(url, options = {}) {
		let spinner = ora();

		const client = require('../client')();
		spinner.start(chalk.grey('generating...'));
		client.get(url, {responseType: 'arraybuffer'})
			.then(response => xlsx.read(new Uint8Array(response.data), {type: "array"}))
			.then(workbook => {
				require('../utils').generate(workbook, options);
				spinner.succeed(chalk.green('generated successfully.'));
			})
			.catch(e => {
				console.log(e);
				spinner.fail(chalk.red('generate failed!'));
				process.exitCode = 1;
			})
			.finally(() => {
				spinner.clear();
			});
	}
}

module.exports = function (...arg) {
	return new Curl(...arg);
};

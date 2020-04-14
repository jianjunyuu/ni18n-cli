/*
* Download
* 下载命令
* 特点：
* */
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const {generateFile, deleteFolderRecursive} = require('../fsUtils');

class Download {
	constructor(options = {}) {
		let {dest, clear = false} = options;
		let rc = require('../rc').get();
		if (rc) {
			const spinner = ora();
			spinner.start(chalk.grey('downloading...'));
			let configs = rc.lang;
			const client = require('../client')(rc.token);
			let langArray =  Object.keys(configs);
			let urls = Object.values(configs);
			urls = Array.isArray(urls) ? urls : [urls];

			Promise.all(urls.map(url => client.get(url))).then(async function (values) {
				spinner.succeed(chalk.green('download successful.'));
				if (clear && fs.existsSync(dest)) {
					deleteFolderRecursive(dest);
				}
				if (!fs.existsSync(dest)) {
					fs.mkdirpSync(dest)
				}

				spinner.start(chalk.grey('exporting...'));
				for (let i = 0; i < values.length; i++) {
					let lang = langArray[i];
					let response = values[i];

					// 直接生成文件并导出
					await generateFile(`${lang}.${options.type}`, dest, response.data);
				}
				spinner.succeed(chalk.green('export successful.'));
			}).catch(err => {
				spinner.fail(chalk.red('download or export failed'))
				console.log();
				console.log(err);
				process.exitCode = 1;
			});
		}
	}
}

module.exports = function (...arg) {
	return new Download(...arg);
};

/*
* Init
* 配置命令
* 特点：
* */

const inquirer = require('inquirer');
const chalk = require('chalk');

async function init() {
	let isExists = false;
	// 如果已经存在配置文件了，提示是否覆盖
	if (require('../rc').isExists()) {
		isExists = true;
		let {isOverwrite} = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'isOverwrite',
				message: '已经存在配置文件了，是否覆盖？',
				default: true,
			},
		]);

		if (!isOverwrite) process.exit(2);
	}

	let result = await inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: '请输入项目名：',
			default: 'demo',
		},
		{
			type: 'input',
			name: 'token',
			message: '请输入您的Token：',
			validate: noSpace
		},
		{
			type: 'input',
			name: 'lang',
			message: '请输入要导出的语言类型：',
			default: 'zh-CN,en',
		}
	]);
	let langArr = result.lang.split(',');
	let prompts = [];
	for (let i = 0; i < langArr.length; i++) {
		let l = langArr[i];
		prompts.push({
			type: 'input',
			name: l,
			message: `请输入导出语言包(${l})的Url：`,
			validate: noSpace
		});
	}
	result.lang = await inquirer.prompt(prompts);
	console.log(`${isExists ? 'Updated' : 'Created'} config file: \`${require('../rc').fileName}\``);
	console.log();
	console.log(JSON.stringify(result, null, 2));
	console.log();

	require('../rc').create(result);
}

module.exports = function () {
	return init().catch(err => {
		console.log(chalk.stderr(err));
		process.exit(1);
	});
};

function noSpace(value) {
	if (value.length === 0) return chalk.stderr('输入值不能为空');
	let val = value.trim();
	if (value.length > 0 && value === val) {
		return true;
	} else {
		return chalk.stderr('输入值前后不能包含空格');
	}
}

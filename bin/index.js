#!/usr/bin/env node

const {program} = require('commander');
const pck = require('../package');

program
	.name('ni18n')
	.version(pck.version, '-v, --version', 'output the current version')
	.option('-t, --type <type>', 'specify the file output type.', 'json')
	.option('-l, --lang <languages>', 'list of languages.', 'zh-CN,en')
	.option('-d, --dest <directory>', 'output directory.', 'lang')
	.option('--no-clear', 'don\'t clear directory.')
	.usage('[command] [options]');

// 配置(.ni18nrc)
// program
// 	.command('config [key] [value]')
// 	.option('-D, --delete', 'delete a prop')
// 	.action((key, value, cmd) => {
// 		require('../lib/commands/config')(key, value, cleanArgs(cmd));
// 	});

program
	.command('init')
	.action(() => {
		require('../lib/commands/init')();
	});

// 第三方提供接口配置下载方式
// program
// 	.command('download')
// 	.action((url, cmd) => {
// 		require('../lib/commands/download')(cleanArgs(cmd.parent));
// 	});

// 读取远程链接（直接的Excel文件流）方式
program
	.command('curl <url>')
	.action((url, cmd) => {
		require('../lib/commands/curl')(url, cleanArgs(cmd.parent));
	});

// unknown commands
program
	.arguments('[path]')
	.action((path, cmd) => {
		if (path) {
			require('../lib/commands/cpath')(path, cleanArgs(cmd));
		} else {
			require('../lib/commands/major')(cleanArgs(cmd));
		}
	});

// add some useful info on help
program.on('--help', () => {
	console.log();
	console.log(`Commands of arguments:`);
	console.log(`  Major: ni18n`);
	console.log(`  Cpath: ni18n language.xlsx or ni18n ./**/<Excel filename>.xlsx`);
	console.log();
});

program.parse(process.argv);

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
	const args = {};
	cmd.options.forEach(o => {
		const key = camelize(o.long.replace(/^--(:?no-)?/, ''));
		// if an option is not present and Command has a method with the same name
		// it should not be copied
		if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
			args[key] = cmd[key];
		}
	});
	return args;
}

function camelize(str) {
	return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

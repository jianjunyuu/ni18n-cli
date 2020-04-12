#!/usr/bin/env node
const {program} = require('commander');

program
	.version('0.0.1', '-v, --version', 'output the current version')
	// .usage('<command> [options]');

program
	.command('pack <url|path>')
	.description('packing')
	// .option('-t, --type <type>', 'specify the file output type. default: json')
	.option('-l, --lang <languages>', 'list of languages. default: zh-CN,en')
	.option('-d, --dest <languages>', 'output directory. default: lang')
	.option('--no-clear', 'don\'t clear directory.')
	.action((url, cmd) => {
		require('../lib/build')(url, cleanArgs(cmd))
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

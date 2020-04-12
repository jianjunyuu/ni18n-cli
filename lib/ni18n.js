const xlsx = require('xlsx');
const fs = require('fs');
const axios = require('axios');
const Path = require('path');
const ora = require('ora');
const chalk = require('chalk');

module.exports = function ni18n(config) {
	let {isUri, url, clear = false, dest = '', languages = []} = config;
	let p;

	const spinner = ora();
	spinner.start(chalk.cyan('Reading file...'));
	if (isUri) {
		p = axios.get(url, {responseType: 'arraybuffer'})
			.then(response => xlsx.read(new Uint8Array(response.data), {type: "array"}));
	} else {
		const workbook = xlsx.readFile(url, {type: 'array'});
		p = Promise.resolve(workbook);
	}
	p.then((workbook) => {
		spinner.succeed(chalk.green('File read success.'));

		spinner.start(chalk.cyan('Writing file...'));
		let cols = sheetsToCols(workbook['Sheets']);
		if (cols.length > 0) {
			let filesConfigs = getFilesConfig(languages, cols.shift().data, cols, spinner);
			if (clear && fs.existsSync(dest)) {
				deleteFolderRecursive(dest);
			}
			createFiles(filesConfigs, dest);
		}

		spinner.succeed(chalk.green('File writing succeeded.'));
	}).catch((error) => {
		spinner.fail(chalk.stderr('File read error!!!'));
		console.log(error);
	});
};

function sheetsToCols(sheets = [], ignore = []) {
	const pattern = /^([A-Z]+)(\d+)$/;
	let columns = [];
	Object.entries(sheets).forEach(([name, data = {}]) => {
		if (!ignore.includes(name)) {
			Object.entries(data).forEach(([name, value]) => {
				let result = name.match(pattern);
				if (result) {
					let columnName = RegExp.$1;
					let col = columns.find(c => c.name === columnName);
					if (!col) {
						col = {
							name: columnName,
							data: {}
						};
						columns.push(col);
					}
					let key = RegExp.$2;
					col.data[key] = value.v;
				}
			});
		}
	});
	return columns;
}

function getFilesConfig(filesName = [], keys = {}, columns = [], spinner) {
	return filesName.map((name, index) => {
		let data = {};
		let column = columns[index];
		if (!column) {
			spinner.fail(chalk.stderr(`Column "${name}" does not exist, please check if the column corresponds.`));
			process.exit(1);
		}

		Object.entries(keys).forEach(([key, value]) => {
			data[value] = column.data[key];
		});
		return {
			fileName: `${name}.json`,
			data: data,
		};
	});
}

function createFiles(filesConfig = [], dest) {
	filesConfig.forEach(({fileName, data}) => {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		fs.writeFileSync(`${dest}/${fileName}`, JSON.stringify(data), {
			cwd: '/',
			encoding: 'utf8',
			stdio: [process.stdin, process.stdout, process.stderr]
		});
	});
}

const deleteFolderRecursive = function(path) {
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

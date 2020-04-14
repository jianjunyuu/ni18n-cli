const url = require('url');
const fs = require('fs-extra');
const {deleteFolderRecursive, generateFile} = require('./fsUtils');

const isHttpPattern = /http(:?s)?:?/;
exports.isUri = function (str = '') {
	const protocol = url.parse(str).protocol;
	return isHttpPattern.test(protocol);
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

function getFilesConfig(filesName = [], keys = {}, columns = []) {
	return filesName.map((name, index) => {
		let data = {};
		let column = columns[index];
		if (!column) {
			console.log(chalk.stderr(`Column "${name}" does not exist, please check if the column corresponds.`));
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
			fs.mkdirpSync(dest)
		}
		generateFile(fileName, dest, data);
	});
}

exports.generate = function (workbook, options = {}) {
	let {clear = false, dest = '', lang = ''} = options;
	let languages = lang.split(',');
	let cols = sheetsToCols(workbook['Sheets']);
	if (cols.length > 0) {
		let filesConfigs = getFilesConfig(languages, cols.shift().data, cols);
		if (clear && fs.existsSync(dest)) {
			deleteFolderRecursive(dest);
		}
		createFiles(filesConfigs, dest);
	}
};

const ni18n = require('./ni18n');
const Url = require('url');
module.exports = (url, options = {}) => {
	const config = {
		url,
		type: 'json',
		lang: 'zh-CN,en',
		dest: 'lang',
		clear: true,
		...options,
	};

	const isHttp = /http(:?s)?:?/;
	const protocol = Url.parse(url).protocol;
	config.isUri = isHttp.test(protocol);
	config.languages = config.lang.split(',').map(str => str.trim());
	ni18n(config);
};

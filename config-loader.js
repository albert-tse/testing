var fs = require('fs');

module.exports = function(content) {
	var startTag = '/* config object start */';
	var endTag = '/* config object end */';

	var base_config = JSON.parse(fs.readFileSync('./app/js/config/base.json', { encoding: 'UTF-8' }));

	var env_config = {};

	if (process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'dist') {
	    env_config = JSON.parse(fs.readFileSync('./app/js/config/production.json'));
	} else if (process.env.NODE_ENV == 'staging' || process.env.NODE_ENV == 'stage') {
	    env_config = JSON.parse(fs.readFileSync('./app/js/config/staging.json'));
	} else if (process.env.NODE_ENV == 'testing' || process.env.NODE_ENV == 'test') {
	    env_config = JSON.parse(fs.readFileSync('./app/js/config/test.json'));
	} else if (process.env.NODE_ENV == 'dev') {
	    env_config = JSON.parse(fs.readFileSync('./app/js/config/dev.json'));
	} else {
	    env_config = JSON.parse(fs.readFileSync('./app/js/config/local.json'));
	}

	var config = Object.assign(base_config, env_config);

	if (process.env.GIT_COMMIT) {
	    config.buildId = process.env.GIT_COMMIT;
	} else {
	    config.buildId = 'development';
	}

	if (process.env.APP_VERSION) {
	    config.appVersion = process.env.APP_VERSION;
	} else {
	    config.appVersion = '0.0.0';
	}

	var pre = content.substring(0, content.indexOf(startTag) + startTag.length);
	var post = content.substring(content.indexOf(endTag), content.length);
	var body = '\n' + JSON.stringify(config, undefined, 4) + '    \n';
	
    return pre + body + post;
};
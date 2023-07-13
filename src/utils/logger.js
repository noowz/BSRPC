const chalk = require('chalk');

const date = chalk.gray('[' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + ']');

const logger = {
	debug: chalk.greenBright(date + ' [DEBUG] '),
	info: chalk.cyan(date + ' [INFO] '),
	warn: chalk.yellow(date + ' [WARN] '),
	error: chalk.redBright(date + ' [ERROR] '),
	fatal: chalk.red(date + ' [FATAL] ')
};

module.exports = logger;
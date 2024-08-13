const { logger } = require("../utils/logger.js");

function logErrorAndExit(message) {
	logger.error(message);

	process.exit(0);
};

function getNumberInString(string) {
	return /\d/.test(string);
};

module.exports = { logErrorAndExit, getNumberInString };
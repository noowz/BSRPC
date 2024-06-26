const { auth, settings } = require("../config.json");
const logger = require("../utils/logger.js");
const { getNumberInString } = require("./utils.js");

const configVerificator = () => {
	if (!auth.discord.client_id) {
		logger.error("No client ID provided. Please provide a client ID.");

		process.exit(1);
	};

	if (auth.discord.client_id && !getNumberInString(auth.discord.client_id)) {
		logger.error("The client ID provided is not valid. Please provide a valid client ID.");

		process.exit(1);
	};

	if (auth.discord.client_id !== "839894528953810944") {
		logger.error("The client ID provided is not the BSRPC one. Please provide the BSRPC client ID by going to the config file and changing the 'client_id' value to 839894528953810944");

		process.exit(1);
	};

	if (!auth.brawlstars.token || auth.brawlstars.token === "YOUR API KEY") {
		logger.error("No Brawl Stars API key provided. Please provide a Brawl Stars API key.");

		process.exit(1);
	};

	if (!settings.user.player_tag || settings.user.player_tag === "YOUR PLAYER TAG") {
		logger.error("No Brawl Stars player tag provided. Please provide a Brawl Stars player tag.");

		process.exit(1);
	};
};

module.exports = configVerificator;
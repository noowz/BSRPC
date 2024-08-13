const { auth, settings } = require("../config.json");
const { logErrorAndExit, getNumberInString } = require("./utils.js");

const BSRPC_CLIENT_ID = "839894528953810944";

async function verifyConfig() {
	if (!auth.discord.client_id) {
		logErrorAndExit("No Discord client ID provided. Please update the 'client_id' field in the config file with your Discord client ID.");
	} else if (!getNumberInString(auth.discord.client_id)) {
		logErrorAndExit("The provided Discord client ID is invalid. Ensure the 'client_id' field in the config file contains a valid numeric ID.");
	} else if (auth.discord.client_id !== BSRPC_CLIENT_ID) {
		logErrorAndExit(`The provided Discord client ID does not match the required BSRPC client ID. Update the 'client_id' field in the config file to ${BSRPC_CLIENT_ID}.`);
	};

	if (!auth.brawlstars.token || auth.brawlstars.token === "YOUR API KEY") {
		logErrorAndExit("No Brawl Stars API key provided. Please update the 'token' field in the config file with your Brawl Stars API key.");
	};

	if (!settings.user.player_tag || settings.user.player_tag === "YOUR PLAYER TAG") {
		logErrorAndExit("No Brawl Stars player tag provided. Please update the 'player_tag' field in the config file with your Brawl Stars player tag.");
	};
};

module.exports = { verifyConfig };
const { auth } = require("./config.json");
const logger = require("./utils/logger.js");
const configVerificator = require("./utils/configVerificator.js");
const { eventsHandler } = require("./utils/handlers.js");
const { Client } = require("discord-rpc");

const client = new Client({
	transport: "ipc"
});

configVerificator();
eventsHandler(client);

process.on("uncaughtException", (error) => {
	logger.error(error);

	process.exit(1);
});

process.on("unhandledRejection", (error) => {
	logger.error(error);

	process.exit(1);
});

client.login({
	clientId: auth.discord.client_id
}).catch(error => {
	logger.error(error);
});
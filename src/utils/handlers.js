const { logger } = require("../utils/logger.js");
const { join } = require("node:path");
const { readdirSync } = require("node:fs");
const chalk = require("chalk");

async function eventsHandler(client) {
	const eventsPath = join(__dirname, "../events");
	const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));

	let index = 0;

	for (const file of eventFiles) {
		index++;

		const filePath = join(eventsPath, file);
		const event = require(filePath);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		};

		logger.info(`Loaded ${chalk.yellowBright(file.slice(0, -3))} event ${chalk.bold.white(`(${index}/${eventFiles.length})`)}!`);
	};
};

module.exports = { eventsHandler };
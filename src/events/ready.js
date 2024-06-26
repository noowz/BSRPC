const logger = require("../utils/logger.js");
const rpc = require("../rpc/rpc.js");

const ready = {
	name: "ready",
	once: true,

	async execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 60000);

		logger.info("RPC connected to Discord!");
	}
};

module.exports = ready;
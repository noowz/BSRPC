const { rpc } = require("../rpc/rpc.js");

const ready = {
	name: "ready",

	async execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 60000);
	}
};

module.exports = ready;
const { rpc } = require('../rpc/rpc.js');
const logger = require('../utils/logger.js');

module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 60000);

		console.log(logger.info + 'RPC connected to Discord!');
	}
};
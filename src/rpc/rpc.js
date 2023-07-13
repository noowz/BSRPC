const repository = require('../../package.json').repository.url;
const name = require('../../package.json').name;
const version = require('../../package.json').version;
const issues = require('../../package.json').bugs.url;
const config = require('../../config.json');
const logger = require('../utils/logger.js');
const chalk = require('chalk');
const axios = require('axios');

let firstTimeRunningRPC = true;
let startDate;

if (firstTimeRunningRPC) {
	startDate = Date.now();
} else {
	startDate = startDate;
};

const rpc = async function setActivity(client) {
	const playerResponse = await axios({
		method: 'GET',
		url: `https://api.brawlstars.com/v1/players/%23${config.settings.user.playerTag.replace('#', '')}`,
		headers: {
			'Authorization': `Bearer ${config.auth.brawlstars.token}`,
			'Content-Type': 'application/json',
			'User-Agent': `${name.toUpperCase()}/${version}`
		}
	}).catch(function (error) {
		if (error.response.status === 400) {
			console.error(logger.error + `The Client is providing incorrect parameters for the request. Report this at ${issues} ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 403 && error.response.data.reason === 'accessDenied') {
			console.error(logger.error + `You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.brawlstars.com/#/new-key to create a new one. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 403 && error.response.data.reason === 'accessDenied.invalidIp') {
			console.error(logger.error + `The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.brawlstars.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 404) {
			console.error(logger.error + `You provided an invalid player tag or club tag. Check if it is correct. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 429) {
			console.error(logger.error + `The API is at its maximum capacity. Please, try again later! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 500) {
			console.error(logger.error + `An unknown error happened when handling the request. Please, try again! If the error persists, please try again later! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 503) {
			console.error(logger.error + `Brawl Stars is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else {
			console.error(logger.error + `An error has occurred. Report this at ${issues} ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		};
	})

	const player = await playerResponse.data;

	client.request('SET_ACTIVITY', {
		pid: process.pid,
		activity: {
			details: `🏆 Trophies: ${player.trophies}/${player.highestTrophies}`,
			state: `🥊 3v3 Wins: ${player['3vs3Victories']} • 👤 Solo Wins: ${player.soloVictories} • 👥 Duo Wins: ${player.duoVictories}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: 'logo',
				large_text: `${name.toUpperCase()} v${version}`,
				small_image: `https://cdn.brawlify.com/profile/${player.icon.id}.png`,
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: '🚀 Download',
					url: repository
				}
			]
		}
	}).catch(error => {
		if (error.message === 'RPC_CONNECTION_TIMEOUT') {
			console.error(logger.error + error);
	
			process.exit(1);
		};
	});
};

firstTimeRunningRPC = false;

module.exports = {
	rpc
};
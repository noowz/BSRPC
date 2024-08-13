const { name, version, bugs, repository } = require("../../package.json");
const { auth, settings } = require("../config.json");
const { logger } = require("../utils/logger.js");
const axios = require("axios");
const gplay = require("google-play-scraper");

let firstTimeRunningRPC = true;
let startDate;

if (firstTimeRunningRPC) {
	startDate = Date.now();
} else {
	startDate = startDate;
};

const rpc = async function setActivity(client) {
	const response = await axios({
		method: "GET",
		url: `https://api.brawlstars.com/v1/players/%23${settings.user.player_tag.replace("#", "")}`,
		headers: {
			"Authorization": `Bearer ${auth.brawlstars.token}`,
			"Content-Type": "application/json",
			"User-Agent": `${name.toUpperCase()}/${version}`
		}
	}).catch(error => {
		if (error.response.status === 400) {
			logger.error(`The Client is providing incorrect parameters for the request. Report this at ${bugs.url} !`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 403 && error.response.data.reason === "accessDenied") {
			logger.error(`You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.brawlstars.com/#/new-key to create a new one.`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 403 && error.response.data.reason === "accessDenied.invalidIp") {
			logger.error(`The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.brawlstars.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip !`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 404) {
			logger.error(`You provided an invalid player tag. Check if it is correct in the config file.`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 429) {
			logger.error(`The API is at its maximum capacity. Please, try again later!`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 500) {
			logger.error(`An unknown error happened when handling the request. Please, try again! If the error persists, please try again later!`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 503) {
			logger.error(`Brawl Stars is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API.`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);
			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		};

		process.exit(0);
	});

	const player = await response.data;

	const app = await gplay.app({
		appId: "com.supercell.brawlstars"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `🏆 Trophies: ${player.trophies}/${player.highestTrophies}`,
			state: `🥊 3v3 Wins: ${player["3vs3Victories"]} • 👤 Solo Wins: ${player.soloVictories} • 👥 Duo Wins: ${player.duoVictories}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: app.icon,
				large_text: `${name.toUpperCase()} v${version}`,
				small_image: `https://cdn-old.brawlify.com/profile/${player.icon.id}.png`,
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: "🚀 Download",
					url: repository.url
				}
			]
		}
	}).catch(error => {
		logger.error(error);

		process.exit(0);
	});
};

firstTimeRunningRPC = false;

module.exports = { rpc };
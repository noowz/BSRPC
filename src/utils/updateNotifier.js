const { name, version, author, bugs } = require("../../package.json");
const { logger } = require("../utils/logger.js");
const chalk = require("chalk");
const axios = require("axios");

async function updateNotifier() {
	const response = await axios({
		method: "GET",
		url: `https://api.github.com/repos/${author.name}/${name.toUpperCase()}/releases/latest`,
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `${name.toUpperCase()}/${version}`
		}
	}).catch(error => {
		logger.error(`An error has occurred. Report this at ${bugs.url} !`);
		logger.error(`ERROR: ${error.response.status} - ${error.response.statusText}`);

		process.exit(0);
	});

	const release = await response.data;

	const currentVersion = version;
	const latestVersion = release.tag_name.replace("v", "");

	if (currentVersion !== latestVersion) {
		console.log(chalk.white("┌────────────────────────────────────────────────────┐"));
		console.log(chalk.white("│ ") + chalk.green(`🚀 A new version of ${name.toUpperCase()} is available!`) + "            " + chalk.white("│"));
		console.log(chalk.white("│") + "                                                    " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.redBright(`• Current version: ${currentVersion}`) + "                           " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.greenBright(`• Latest version: ${latestVersion.replace("v", "")}`) + "                            " + chalk.white("│"));
		console.log(chalk.white("│") + "                                                    " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.blueBright(release.html_url) + " " + chalk.white("│"));
		console.log(chalk.white("└────────────────────────────────────────────────────┘"));
		console.log("\n");
	};
};

module.exports = { updateNotifier };
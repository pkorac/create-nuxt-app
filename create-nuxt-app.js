#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import chalk from "chalk";
import { fileURLToPath } from "url";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error(`Failed to execute command: ${command}`);
		process.exit(1);
	}
}

function copyDefaults(source, destination) {
	console.log(
		`Copying default template files from ${source} to ${destination}`,
	);

	if (!fs.existsSync(source)) {
		console.error(`Defaults folder ${source} does not exist.`);
		return;
	}

	const copyRecursive = (src, dest) => {
		const exists = fs.existsSync(src);
		const stats = exists && fs.statSync(src);
		const isDirectory = exists && stats.isDirectory();

		if (isDirectory) {
			if (!fs.existsSync(dest)) {
				fs.mkdirSync(dest);
			}
			fs.readdirSync(src).forEach((childItemName) => {
				copyRecursive(
					path.join(src, childItemName),
					path.join(dest, childItemName),
				);
			});
		} else {
			fs.copyFileSync(src, dest);
			console.log(`Copied: ${src} to ${dest}`);
		}
	};

	try {
		copyRecursive(source, destination);
		console.log(
			`Copied default template files from ${source} to ${destination}`,
		);
	} catch (error) {
		console.error(`Error copying default files: ${error}`);
	}
}

function setupNuxtProject() {
	rl.question("Enter the name of your Nuxt.js project: ", (projectName) => {
		console.log(`Creating Nuxt.js project: ${projectName}`);

		// Initialize Nuxt project
		runCommand(`npx nuxi@latest init ${projectName}`);

		// Change to project directory
		process.chdir(projectName);

		// Add UI module
		console.log("Adding UI module...");
		runCommand("npx nuxi@latest module add ui");

		// Install Prettier
		console.log("Installing Prettier...");
		runCommand("npm install --save-dev --save-exact prettier");

		// Create .prettierrc file
		console.log("Creating .prettierrc file...");
		fs.writeFileSync(".prettierrc", JSON.stringify({ useTabs: true }, null, 2));

		// Create .env file
		console.log("Creating .env file...");
		fs.writeFileSync(".env", "");

		// Install Tailwind Typography plugin
		console.log("Installing Tailwind Typography plugin...");
		runCommand("npm install -D @tailwindcss/typography");

		// Initialize Tailwind CSS
		console.log("Initializing Tailwind CSS...");
		runCommand("npx tailwindcss init");

		// Copy default files
		console.log("Copying default files...");
		const scriptDir = path.dirname(fileURLToPath(import.meta.url));
		const defaultsSource = path.join(scriptDir, "defaults");
		console.log(
			`Attempting to copy from ${defaultsSource} to ${process.cwd()}`,
		);

		if (!fs.existsSync(defaultsSource)) {
			console.error(`Defaults folder not found at ${defaultsSource}`);
			console.error(
				"Make sure the defaults folder is included in your package and installed correctly.",
			);
			process.exit(1);
		}

		copyDefaults(defaultsSource, process.cwd());

		console.log("-");
		console.log(chalk.cyan("✨ ") + chalk.bold("Project setup complete!"));
		console.log(
			chalk.dim("→") +
				` Run ${chalk.cyan(`cd ${projectName}`)} to enter the project directory.`,
		);
		console.log(
			chalk.dim("→") +
				` Run ${chalk.cyan("npm run dev")} to start the development server.`,
		);

		console.log("-");

		rl.close();
	});
}

setupNuxtProject();

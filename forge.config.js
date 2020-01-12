require('dotenv').config();
const path = require('path');

const pluginConfig = {
	electronPackagerConfig: {
		packageManager: "yarn",
		//iconURL : "https://storage.googleapis.com/flakerappfiles/images/icon.ico",
		icon:  path.resolve(__dirname, 'src', 'assets', 'icons', 'icon.ico'),
		ignore : ['.eslintcache', '.eslintrc', '.gitignore', '.vscode'],
		asar : true,
	},
	publish_targets : {
		win32: [
			"github"
		]
	},
	github_repository: {
		owner: "danielkv",
		name: "Flaker.me",
		authToken : process.env.GH_TOKEN,
		private:true,
	},
	make_targets: {
        win32: [
          "squirrel"
        ]
	},
	electronWinstallerConfig : {
		iconURL : "https://storage.googleapis.com/flakerappfiles/images/icon.ico",
		loadingGif : "D:/Google Drive/Projetos/Flaker/install.gif",
		setupIcon : path.resolve(__dirname, 'src', 'assets', 'icons', 'icon.ico'),
		setupExe : "Flaker.me.exe",
	},
	electronInstallerDebian : {},
	electronInstallerRedhat: {},
	
	windowsStoreConfig: {
		"packageName": "",
		"name": "flaker.me",
	}
}

module.exports = pluginConfig;
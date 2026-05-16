const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...defaultConfig,
	externals: {
		...defaultConfig.externals,
		// Add any external scripts you want to exclude from the bundle here
		// Example: 'jquery': 'jQuery'
	},
	// This tells Webpack how to handle node_modules resolution
	resolve: {
		...defaultConfig.resolve,
	},
};

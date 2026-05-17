const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils/config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	externals: {
		...defaultConfig.externals,
	},
	resolve: {
		...defaultConfig.resolve,
	}
};

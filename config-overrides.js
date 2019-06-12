const path = require('path');

const resolvePaths = (...args) => {
	return path.resolve(__dirname, './src', ...args);
};

const publicPath = (...args) => {
	return path.resolve(__dirname, './public', ...args);
};

module.exports = function override(config, env) {
	config.resolve = {
		alias: {
			'my-actions': resolvePaths('actions'),
			'my-components': resolvePaths('components'),
			'my-constants': resolvePaths('constants'),
			'my-containers': resolvePaths('containers'),
			'my-reducers': resolvePaths('reducers'),
			'my-routes': resolvePaths('routes'),
			'my-services': resolvePaths('services'),
			'my-styles': resolvePaths('styles'),
			'my-utils': resolvePaths('utils'),
			'my-pages': resolvePaths('pages'),
			'my-public': publicPath('')
		}
	};
	return config;
}

const keys = require('./keys.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
	contracts_build_directory: './public/contracts',
	networks: {
		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 7545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider(keys.PRIVATE_KEY, keys.INFURA_ROPSTEN_URL),
			network_id: 3,
			gas: 5500000,
			gasPrice: 20000000000,
			confirmations: 2,
			timeoutBlocks: 200,
		},
	},

	compilers: {
		solc: {
			version: '0.8.15', // Fetch exact version from solc-bin (default: truffle's version)
		},
	},
};

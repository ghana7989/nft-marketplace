import {MetaMaskInpageProvider} from '@metamask/providers';
import {Contract, providers} from 'ethers';

export type Web3Params = {
	ethereum?: MetaMaskInpageProvider;
	provider?: providers.Web3Provider;
	contract?: Contract;
};

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
}

export type Web3State = {
	isLoading: boolean;
} & Web3Params;

export const createDefaultState = (): Web3State => ({
	isLoading: true,
	ethereum: undefined,
	provider: undefined,
	contract: undefined,
});

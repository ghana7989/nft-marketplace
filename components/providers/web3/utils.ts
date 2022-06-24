import {setupHooks, Web3Hooks} from '@hooks/web3/setupHooks';
import {MetaMaskInpageProvider} from '@metamask/providers';
import {Web3Dependencies} from '@_types/hooks';
import {Contract, ethers, providers} from 'ethers';

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
}

export type Web3State = {
	isLoading: boolean;
	hooks: Web3Hooks;
} & Partial<Web3Dependencies>;

export const createDefaultState = (): Web3State => ({
	isLoading: true,
	ethereum: undefined,
	provider: undefined,
	contract: undefined,
	hooks: setupHooks({isLoading: true} as any),
});
export const createWeb3State = ({
	ethereum,
	provider,
	contract,
	isLoading,
}: Web3Dependencies) => ({
	isLoading,
	ethereum,
	provider,
	contract,
	hooks: setupHooks({
		contract,
		ethereum,
		provider,
		isLoading,
	}),
});

export const loadContract = async (
	name: string,
	provider: providers.Web3Provider,
): Promise<Contract> => {
	const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;
	if (!NETWORK_ID) {
		return Promise.reject(new Error('Network ID not defined'));
	}
	const res = await fetch(`/contracts/${name}.json`);
	const Artifact = await res.json();
	if (Artifact.networks[NETWORK_ID]) {
		return new ethers.Contract(
			Artifact.networks[NETWORK_ID].address,
			Artifact.abi,
			provider,
		);
	}
	return Promise.reject(new Error(`Contract(${name}) not found`));
};

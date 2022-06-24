import {CryptoHookFactory} from '@_types/hooks';
import useSWR from 'swr';

const NETWORKS: {[k: string]: string} = {
	1: 'Ethereum Main Network',
	3: 'Ropsten Test Network',
	4: 'Rinkeby Test Network',
	5: 'Goerli Test Network',
	42: 'Kovan Test Network',
	56: 'Binance Smart Chain',
	1337: 'Ganache',
};
const targetID = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetID];
type UseNetworkResponse = {
	isLoading: boolean;
	isSupported: boolean;
	targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
	({provider, isLoading}) =>
	() => {
		const {data, isValidating, ...swr} = useSWR(
			provider ? 'web3/useNetwork' : null,
			async () => {
				const chainId = (await provider?.getNetwork())?.chainId;
				if (!chainId) throw new Error('No network with the given chainID');
				return NETWORKS[chainId];
			},
			{
				revalidateOnFocus: false,
			},
		);

		return {
			...swr,
			data,
			isValidating,
			targetNetwork,
			isSupported: data === targetNetwork,
			isLoading: isLoading as boolean,
		};
	};

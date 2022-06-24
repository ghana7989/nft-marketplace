import {CryptoHookFactory} from '@_types/hooks';
import {useEffect} from 'react';
import useSWR from 'swr';

type UseAccountResponse = {
	connect: () => void;
	isLoading: boolean;
	isInstalled: boolean;
};
type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;
export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
	({provider, ethereum, isLoading}) =>
	() => {
		const {data, mutate, isValidating, ...rest} = useSWR(
			provider ? 'web3/useAccount' : null,
			async () => {
				const accounts = await provider!.listAccounts();
				if (!accounts || !accounts.length) throw 'Connect to web3 wallet';
				return accounts[0];
			},
			{
				revalidateOnFocus: false,
				shouldRetryOnError: false,
			},
		);

		const handleAccountsChanged = (...args: unknown[]) => {
			const accounts = args[0] as string;
			if (!accounts.length)
				return console.error(`Please connect to web3 wallet`);
			else if (accounts[0] !== data) {
				mutate(accounts[0]);
				window.location.reload();
			}
		};

		useEffect(() => {
			ethereum?.on('accountsChanged', handleAccountsChanged);
			return () => {
				ethereum?.removeListener('accountsChanged', handleAccountsChanged);
			};
		}, []);
		const connect = async () => {
			try {
				await ethereum?.request({method: 'eth_requestAccounts'});
			} catch (error) {
				console.error(error);
			}
		};
		return {
			data,
			mutate,
			connect,
			isValidating,
			isLoading: isLoading as boolean,
			isInstalled: ethereum?.isMetaMask || false,
			...rest,
		};
	};

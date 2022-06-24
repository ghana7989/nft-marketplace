import {setupHooks} from '@hooks/web3/setupHooks';
import {ethers} from 'ethers';
import {createContext, FC, useContext, useEffect, useState} from 'react';
import {
	createDefaultState,
	createWeb3State,
	loadContract,
	Web3State,
} from './utils';

const Web3Context = createContext<Web3State>(createDefaultState());

interface IWeb3ProviderProps {
	children: React.ReactNode;
}

export const Web3Provider: FC<IWeb3ProviderProps> = ({children}) => {
	const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

	useEffect(() => {
		async function initWeb3() {
			try {
				const {ethereum} = window;
				const provider = new ethers.providers.Web3Provider(ethereum as any);
				const contract = await loadContract('NftMarket', provider);
				if (ethereum) {
					setWeb3Api(
						createWeb3State({
							isLoading: false,
							ethereum,
							provider,
							contract,
						}),
					);
				} else {
					alert('Please install MetaMask');
				}
			} catch (error) {
				console.error(error);
				setWeb3Api(() => {
					return {
						...createDefaultState(),
						isLoading: false,
					};
				});
			}
		}
		initWeb3();
	}, []);
	return (
		<Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
	);
};

export function useWeb3() {
	return useContext(Web3Context);
}

export function useHooks() {
	const {hooks} = useWeb3();
	return hooks;
}
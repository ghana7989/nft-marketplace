import {MetaMaskInpageProvider} from '@metamask/providers';
import {NftMarketContract} from '@_types/nftMarketContract';
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

const pageReload = () => window.location.reload();
const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
	pageReload();
	const isLocked = !(await ethereum._metamask.isUnlocked());
	if (isLocked) {
	}
};
const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
	ethereum.on('chainChanged', pageReload);
	ethereum.on('accountsChanged', handleAccount(ethereum));
};
const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
	ethereum?.removeListener('chainChanged', pageReload);
	ethereum?.removeListener('accountsChanged', handleAccount);
};
export const Web3Provider: FC<IWeb3ProviderProps> = ({children}) => {
	const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

	useEffect(() => {
		async function initWeb3() {
			try {
				const {ethereum} = window;
				const provider = new ethers.providers.Web3Provider(ethereum as any);
				const contract = await loadContract('NftMarket', provider);
				const signer = provider.getSigner(); // this is for provider to know which account to use for transactions
				const signedContract = contract.connect(signer);
				setTimeout(() => {
					setGlobalListeners(ethereum);
				}, 400);
				if (ethereum) {
					setWeb3Api(
						createWeb3State({
							isLoading: false,
							ethereum,
							provider,
							contract: signedContract as unknown as NftMarketContract,
						}),
					);
				} else {
					alert('Please install MetaMask');
				}
			} catch (error) {
				setWeb3Api(() => {
					return {
						...createDefaultState(),
						isLoading: false,
					};
				});
			}
		}
		initWeb3();
		return () => {
			removeGlobalListeners(window.ethereum);
		};
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

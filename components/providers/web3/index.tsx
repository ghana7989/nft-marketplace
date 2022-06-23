import {ethers} from 'ethers';
import {createContext, FC, useContext, useEffect, useState} from 'react';
import {createDefaultState, Web3State} from './utils';

const Web3Context = createContext<Web3State>(createDefaultState());

interface IWeb3ProviderProps {
	children: React.ReactNode;
}

export const Web3Provider: FC<IWeb3ProviderProps> = ({children}) => {
	const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

	useEffect(() => {
		function initWeb3() {
			const {ethereum} = window;
			const provider = new ethers.providers.Web3Provider(ethereum as any);
			if (ethereum) {
				setWeb3Api(p => ({...p, ethereum, isLoading: false, provider}));
			} else {
				alert('Please install MetaMask');
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

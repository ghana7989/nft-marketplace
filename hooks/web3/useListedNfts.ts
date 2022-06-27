import {CryptoHookFactory} from '@_types/hooks';
import {Nft} from '@_types/NFT';
import axios from 'axios';
import {ethers} from 'ethers';
import {useCallback} from 'react';
import useSWR from 'swr';

type UseListedNftsResponse = {
	buyNft: (tokenId: number, value: number) => Promise<void>;
};

type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>;
export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
	({contract}) =>
	() => {
		const {data, ...rest} = useSWR(
			contract ? 'web3/useListedNfts' : null,
			async () => {
				const nfts: Nft[] = [];
				const coreNfts = await contract!.getAllNftsOnSale();
				console.log('📢[useListedNfts.ts:21]: ', coreNfts);
				for (let i = 0; i < coreNfts.length; i++) {
					const item = coreNfts[i];

					const tokenURI = await contract!.tokenURI(item.tokenId);
					const metaRes = await (await axios.get(tokenURI)).data;
					console.log('📢[useListedNfts.ts:28]: ', item.price);
					const tempNft: Nft = {
						price: parseFloat(ethers.utils.formatEther(item.price)),
						creator: item.creator,
						isListed: item.isListed,
						meta: {...metaRes},
						tokenId: parseFloat(ethers.utils.formatEther(item.tokenId)),
					};
					nfts.push(tempNft);
				}

				return nfts;
			},
		);

		const _contract = contract;
		const buyNft = useCallback(
			async (tokenId: number, value: number) => {
				try {
					const result = await _contract!.buyNft(tokenId, {
						value: ethers.utils.parseEther(value.toString()),
					});
					await result?.wait();
					alert('You have bought Nft. See profile page.');
				} catch (e: any) {
					console.error(e.message);
				}
			},
			[_contract],
		);

		return {
			data: data || [],
			buyNft,
			...rest,
		};
	};

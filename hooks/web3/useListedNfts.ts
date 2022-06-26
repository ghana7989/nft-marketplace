import {CryptoHookFactory} from '@_types/hooks';
import {Nft} from '@_types/NFT';
import axios from 'axios';
import {ethers} from 'ethers';
import useSWR from 'swr';

type UseListedNftsResponse = {};

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
				for (let i = 0; i < coreNfts.length; i++) {
					const item = coreNfts[i];

					const tokenURI = await contract!.tokenURI(item.tokenId);
					const metaRes = await (await axios.get(tokenURI)).data;
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

		return {
			data: data || [],
			...rest,
		};
	};

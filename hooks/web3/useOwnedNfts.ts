import {CryptoHookFactory} from '@_types/hooks';
import {Nft} from '@_types/NFT';
import axios from 'axios';
import {ethers} from 'ethers';
import {useCallback} from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

type UseOwnedNftsResponse = {
	listNft: (tokenId: number, price: number) => Promise<void>;
};

type OwnedNftsHookFactory = CryptoHookFactory<any, UseOwnedNftsResponse>;
export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
	({contract}) =>
	() => {
		const {data, ...rest} = useSWR(
			contract ? 'web3/useOwnedNfts' : null,
			async () => {
				const nfts: Nft[] = [];
				const coreNfts = await contract!.getOwnedNfts();
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
		const _contract = contract;
		const listNft = useCallback(
			async (tokenId: number, price: number) => {
				try {
					const result = await _contract!.placeNftOnSale(
						tokenId,
						ethers.utils.parseEther(price.toString()),
						{
							value: ethers.utils.parseEther((0.025).toString()),
						},
					);

          await toast.promise(
            result!.wait(), {
            pending: "Processing transaction",
            success: "Item has been listed",
            error: "Processing error"
          }
          );
				} catch (e: any) {
					console.error(e.message);
				}
			},
			[_contract],
		);

		return {
			data: data || [],
			listNft,
			...rest,
		};
	};

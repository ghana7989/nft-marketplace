import {Nft} from '@_types/NFT';
import {FC} from 'react';
import {NFTItem} from '../Item';

type NftListProps = {
	nfts: Nft[];
};
export const NFTList: FC<NftListProps> = ({nfts}) => {
	return (
		<div className='grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none'>
			{nfts.map(nft => {
				return (
					<div
						key={nft.meta.image}
						className='flex flex-col overflow-hidden rounded-lg shadow-lg'>
						<NFTItem item={nft} />
					</div>
				);
			})}
		</div>
	);
};

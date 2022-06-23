import {FC} from 'react';
import {NftMeta} from '../../../../types/NFT';
import {NFTItem} from '../Item';

type NftListProps = {
	nfts: NftMeta[];
};
export const NFTList: FC<NftListProps> = ({nfts}) => {
	return (
		<div className='grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none'>
			{nfts.map(nft => (
				<div
					key={nft.image}
					className='flex flex-col overflow-hidden rounded-lg shadow-lg'>
					<NFTItem item={nft} />
				</div>
			))}
		</div>
	);
};

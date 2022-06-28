import {useNetwork} from '@hooks';
import {NftMeta, PinataResponse} from '@_types/NFT';
import axios from 'axios';
import {ethers} from 'ethers';
import {NextPage} from 'next';
import Link from 'next/link';
import {ChangeEvent, useCallback, useState} from 'react';
import {toast} from 'react-toastify';
import {BaseLayout, useWeb3} from '../../components';
const ALLOWED_NFT_FIELDS = ['name', 'description', 'image', 'attributes'];
const NFTCreate: NextPage = ({}) => {
	const {ethereum, contract} = useWeb3();
	const [nftURI, setNftURI] = useState('');
	const [price, setPrice] = useState(0);
	const [hasURI, setHasURI] = useState(false);
	const {network} = useNetwork();
	const [nftMeta, setNftMeta] = useState<NftMeta>({
		attributes: [
			{
				trait_type: 'attack',
				value: '0',
			},
			{
				trait_type: 'health',
				value: '0',
			},
			{
				trait_type: 'speed',
				value: '0',
			},
		],
		description: '',
		image: '',
		name: '',
	});
	const getSignedData = async () => {
		const messageToSign = await axios.get('/api/verify');
		const [account, ...r] = await ethereum.request({
			method: 'eth_requestAccounts',
		});
		const signedData = await ethereum.request({
			method: 'personal_sign',
			params: [
				JSON.stringify(messageToSign.data),
				account,
				messageToSign.data.nonce,
			],
		});
		return {signedData, account};
	};
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const {name, value} = e.target;
			setNftMeta({...nftMeta, [name]: value});
		},
		[nftMeta],
	);
	const handleAttributeChange = useCallback(
		(attribute: {trait_type: string}) => (e: ChangeEvent<HTMLInputElement>) => {
			setNftMeta(p => ({
				...p,
				attributes: p.attributes.map(attr => {
					if (attr.trait_type === attribute.trait_type) {
						return {
							...attr,
							value: e.target.value,
						};
					}
					return attr;
				}),
			}));
		},
		[nftMeta],
	);
	const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files.length) return;
		const file = e.target.files[0];
		const buffer = await file.arrayBuffer();
		const bytes = new Uint8Array(buffer);
		try {
			const {signedData, account} = await getSignedData();
			const promise = axios.post('/api/verify-image', {
				address: account,
				signature: signedData,
				bytes,
				contentType: file.type,
				fileName: file.name.split('.')[0],
			});
			const res = await toast.promise(
				promise,
				{
					pending: 'Uploading image...',
					success: 'Image uploaded successfully',
					error: 'Error uploading image',
				},
				{
					theme: 'dark',
				},
			);
			const data = (await res.data) as PinataResponse;
			setNftMeta({
				...nftMeta,
				image: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`,
			});
		} catch (error) {
			console.log('📢[create.tsx:78]: ', error);
		}
	};

	const uploadMetaData = async () => {
		try {
			const {signedData, account} = await getSignedData();
			const promise = axios.post('/api/verify', {
				address: account,
				signature: signedData,
				nft: nftMeta,
			});
			const res = await toast.promise(
				promise,
				{
					pending: 'Uploading Metadata...',
					success: 'Metadata uploaded successfully',
					error: 'Error uploading Metadata',
				},
				{
					theme: 'dark',
				},
			);
			const data = (await res.data) as PinataResponse;

			setNftURI(
				`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`,
			);
		} catch (error) {}
	};
	const createNft = async () => {
		try {
			const {data} = await axios.get(nftURI);
			Object.keys(data).forEach(key => {
				if (!ALLOWED_NFT_FIELDS.includes(key)) {
					throw new Error('Invalid JSON Structure');
				}
			});
			const tx = await contract.mintToken(
				nftURI,
				ethers.utils.parseEther(price.toString()),
				{
					value: ethers.utils.parseEther((0.025).toString()),
				},
			);

			await toast.promise(
				tx.wait(),
				{
					pending: 'Trying to List your NFT',
					success: 'NFT listed successfully 🎉',
					error: 'Error Creating NFT',
				},
				{
					theme: 'dark',
				},
			);
			setTimeout(() => {
				window.location.href = '/';
			}, 3000);
		} catch (error) {
			const e = error.data.message.split('revert')[1];
			toast.error(e, {
				theme: 'dark',
			});
		}
	};
	if (!network.isConnectedToNetwork) {
		return (
			<BaseLayout>
				<div className='p-4 mt-10 rounded-md bg-yellow-50'>
					<div className='flex'>
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-yellow-800'>
								Attention needed
							</h3>
							<div className='mt-2 text-sm text-yellow-700'>
								<p>
									{network.isLoading
										? 'Loading...'
										: `Connect to ${network.targetNetwork}`}
								</p>
							</div>
						</div>
					</div>
				</div>
			</BaseLayout>
		);
	}
	return (
		<BaseLayout>
			<div>
				<div className='py-4'>
					{!nftURI && (
						<div className='flex items-center'>
							<div className='mr-2 font-bold underline'>
								Do you have meta data already?
							</div>
							<label className='cursor-pointer label '>
								<input
									type='checkbox'
									onChange={() => setHasURI(!hasURI)}
									className='toggle toggle-primary'
									checked={hasURI}
								/>
							</label>
						</div>
					)}
				</div>
				{nftURI || hasURI ? (
					<div className='md:grid md:grid-cols-3 md:gap-6'>
						<div className='md:col-span-1'>
							<div className='px-4 sm:px-0'>
								<h3 className='text-lg font-medium leading-6 text-gray-900'>
									List NFT
								</h3>
								<p className='mt-1 text-sm text-gray-600'>
									This information will be displayed publicly so be careful what
									you share.
								</p>
							</div>
						</div>
						<div className='mt-5 md:mt-0 md:col-span-2'>
							<form>
								<div className='shadow sm:rounded-md sm:overflow-hidden'>
									{hasURI && (
										<div className='px-4 py-5 space-y-6 bg-white sm:p-6'>
											<div>
												<label
													htmlFor='uri'
													className='block text-sm font-medium text-gray-700'>
													URI Link
												</label>
												<div className='flex mt-1 rounded-md shadow-sm'>
													<input
														onChange={e => setNftURI(e.target.value)}
														type='text'
														name='uri'
														id='uri'
														className='w-full max-w-xs bg-white input input-bordered'
														placeholder='http://link.com/data.json'
													/>
												</div>
											</div>
										</div>
									)}
									{nftURI && (
										<div className='p-4 mb-4'>
											<div className='font-bold'>Your metadata: </div>
											<div>
												<Link href={nftURI}>
													<a className='text-indigo-600 underline'>{nftURI}</a>
												</Link>
											</div>
										</div>
									)}
									<div className='px-4 py-5 space-y-6 bg-white sm:p-6'>
										<div>
											<label
												htmlFor='price'
												className='block text-sm font-medium text-gray-700'>
												Price (ETH)
											</label>
											<div className='flex mt-1 rounded-md shadow-sm'>
												<input
													value={price}
													onChange={e => setPrice(+e.target.value)}
													type='number'
													name='price'
													id='price'
													className='w-full max-w-xs bg-white input input-bordered'
													placeholder='0.8'
												/>
											</div>
										</div>
									</div>
									<div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
										<button
											type='button'
											className='btn btn-primary'
											onClick={createNft}>
											List
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				) : (
					<div className='md:grid md:grid-cols-3 md:gap-6'>
						<div className='md:col-span-1'>
							<div className='px-4 sm:px-0'>
								<h3 className='text-lg font-medium leading-6 text-gray-900'>
									Create NFT Metadata
								</h3>
								<p className='mt-1 text-sm text-gray-600'>
									This information will be displayed publicly so be careful what
									you share.
								</p>
							</div>
						</div>
						<div className='mt-5 md:mt-0 md:col-span-2'>
							<form>
								<div className='shadow sm:rounded-md sm:overflow-hidden'>
									<div className='px-4 py-5 space-y-6 bg-white sm:p-6'>
										<div>
											<label
												htmlFor='name'
												className='block text-sm font-medium text-gray-700'>
												Name
											</label>
											<div className='flex mt-1 rounded-md shadow-sm'>
												<input
													onChange={handleChange}
													value={nftMeta.name}
													type='text'
													name='name'
													id='name'
													className='w-full max-w-xs bg-white input input-bordered'
													placeholder='My Nice NFT'
												/>
											</div>
										</div>
										<div>
											<label
												htmlFor='description'
												className='block text-sm font-medium text-gray-700'>
												Description
											</label>
											<div className='mt-1'>
												<textarea
													onChange={handleChange}
													value={nftMeta.description}
													id='description'
													name='description'
													rows={3}
													className='w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm'
													placeholder='Some nft description...'
												/>
											</div>
											<p className='mt-2 text-sm text-gray-500'>
												Brief description of NFT
											</p>
										</div>
										{/* Has Image? */}
										{nftMeta.image.length ? (
											<>
												<img src={nftMeta.image} alt='' className='h-64' />
												<button
													className='btn btn-warning'
													onClick={() => {
														setNftMeta({
															...nftMeta,
															image: '',
														});
														axios
															.post(`/api/delete-image/`, {
																cid: nftMeta.image.split('/').pop(),
															})
															.then(() => {
																toast.success('Image deleted successfully', {
																	pauseOnHover: false,
																	pauseOnFocusLoss: false,
																});
															});
													}}>
													Clear Image
												</button>
											</>
										) : (
											<div>
												<label className='block text-sm font-medium text-gray-700'>
													Image
												</label>
												<div className='flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md'>
													<div className='space-y-1 text-center'>
														<svg
															className='w-12 h-12 mx-auto text-gray-400'
															stroke='currentColor'
															fill='none'
															viewBox='0 0 48 48'
															aria-hidden='true'>
															<path
																d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
																strokeWidth={2}
																strokeLinecap='round'
																strokeLinejoin='round'
															/>
														</svg>
														<div className='flex text-sm text-gray-600'>
															<label
																htmlFor='file-upload'
																className='underline cursor-pointer text-info'>
																<span>Upload a file</span>
																<input
																	onChange={handleImageUpload}
																	id='file-upload'
																	name='file-upload'
																	type='file'
																	className='sr-only'
																/>
															</label>
															<p className='pl-1'>or drag and drop</p>
														</div>
														<p className='text-xs text-gray-500'>
															PNG, JPG, GIF up to 10MB
														</p>
													</div>
												</div>
											</div>
										)}
										<div className='grid grid-cols-6 gap-6'>
											{nftMeta.attributes.map(attribute => (
												<div
													key={attribute.trait_type}
													className='col-span-6 sm:col-span-6 lg:col-span-2'>
													<label
														htmlFor={attribute.trait_type}
														className='block text-sm font-medium text-gray-700'>
														{attribute.trait_type}
													</label>
													<input
														onChange={handleAttributeChange(attribute)}
														value={attribute.value}
														type='text'
														name={attribute.trait_type}
														id={attribute.trait_type}
														className='w-full max-w-xs bg-white input input-bordered'
													/>
												</div>
											))}
										</div>
										<p className='text-sm !mt-2 text-gray-500'>
											Choose value from 0 to 100
										</p>
									</div>
									<div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
										<button
											onClick={uploadMetaData}
											type='button'
											className='btn btn-primary'>
											Upload Meta Data
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</BaseLayout>
	);
};
export default NFTCreate;

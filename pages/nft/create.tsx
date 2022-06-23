import {NextPage} from 'next';
import Link from 'next/link';
import {useState} from 'react';
import {BaseLayout} from '../../components';
const ATTRIBUTES = ['health', 'attack', 'speed'];

const NFTCreate: NextPage = ({}) => {
	const [nftURI, setNftURI] = useState('');
	const [hasURI, setHasURI] = useState(false);
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
										<button type='button' className='btn btn-primary'>
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
													id='description'
													name='description'
													rows={3}
													className='w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm'
													placeholder='Some nft description...'
													defaultValue={''}
												/>
											</div>
											<p className='mt-2 text-sm text-gray-500'>
												Brief description of NFT
											</p>
										</div>
										{/* Has Image? */}
										{false ? (
											<img
												src='https://eincode.mypinata.cloud/ipfs/QmaQYCrX9Fg2kGijqapTYgpMXV7QPPzMwGrSRfV9TvTsfM/Creature_1.png'
												alt=''
												className='h-40'
											/>
										) : (
											<div>
												<label className='block text-sm font-medium text-gray-700'>
													Cover photo
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
											{ATTRIBUTES.map(attribute => (
												<div
													key={attribute}
													className='col-span-6 sm:col-span-6 lg:col-span-2'>
													<label
														htmlFor={attribute}
														className='block text-sm font-medium text-gray-700'>
														{attribute}
													</label>
													<input
														type='text'
														name={attribute}
														id={attribute}
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
										<button type='button' className='btn btn-primary'>
											Save
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

import {XIcon} from '@heroicons/react/solid';
import {FC, useEffect, useState} from 'react';
import {Navbar} from '../Navbar';
interface Props {
	children: React.ReactNode;
}

const BaseLayout: FC<Props> = ({children}) => {
	const [removeWarningBanner, setRemoveWarningBanner] = useState(false);
	useEffect(() => {
		const timerForRemovingBanner = setTimeout(() => {
			setRemoveWarningBanner(true);
		}, 5000);
		return () => {
			clearTimeout(timerForRemovingBanner);
		};
	});
	return (
		<>
			<header>
				<title>Daisy NFT Marketplace</title>
			</header>
			<Navbar />
			{!removeWarningBanner && (
				<div className='bg-warning'>
					<div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
						<div className='flex flex-wrap items-center justify-between'>
							<div className='flex items-center flex-1 w-0'>
								<p className='ml-3 font-medium text-white truncate'>
									<span className='hidden md:inline'>
										This project is using free tier of pinata, down times are
										expected and NFTS might not load
									</span>
								</p>
							</div>
							<div className='flex-shrink-0 order-2 sm:order-3 sm:ml-3'>
								<button
									onClick={() => setRemoveWarningBanner(true)}
									type='button'
									className='flex p-2 -mr-1 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'>
									<span className='sr-only'>Dismiss</span>
									<XIcon className='w-6 h-6 text-white' aria-hidden='true' />
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className='min-h-screen py-16 overflow-hidden bg-gray-50'>
				<div className='px-4 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8'>
					{children}
				</div>
			</div>
			<footer className='items-center p-4 footer bg-stone-900 text-neutral-content'>
				<div className='items-center grid-flow-col'>
					<svg
						width={36}
						height={36}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
						fillRule='evenodd'
						clipRule='evenodd'
						className='fill-current'>
						<path d='M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z' />
					</svg>
					<p>Owner - Pavan Chindukuri</p>
				</div>
				<div className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
					<a href='https://www.linkedin.com/in/chindukuri-pavan7989/'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='mercado-match'
							width={24}
							height={24}
							focusable='false'>
							<path d='M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z' />
						</svg>
					</a>
					<a href='https://github.com/ghana7989'>
						<svg
							width={24}
							height={24}
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
							className='fill-current'>
							<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
						</svg>
					</a>
				</div>
			</footer>
		</>
	);
};

export {BaseLayout};

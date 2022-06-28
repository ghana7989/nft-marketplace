import {useAccount, useNetwork} from '@hooks';
import Link from 'next/link';
import {WalletBar} from './WalletBar';

export function Navbar() {
	const {
		account: {data, connect, isInstalled, isLoading},
	} = useAccount();
	const {network} = useNetwork();

	return (
    <div className='self-center navbar bg-base-100 max-w-7xl'>
			<div className='navbar-start'>
				<div className='dropdown'>
					<label tabIndex={0} className='btn btn-ghost lg:hidden'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M4 6h16M4 12h8m-8 6h16'
							/>
						</svg>
					</label>
					<ul
						tabIndex={0}
						className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'>
						<li>
							<Link href='/'>
								<a>Marketplace</a>
							</Link>
						</li>

						<li>
							<Link href='/nft/create'>
								<a>Create</a>
							</Link>
						</li>
					</ul>
				</div>

				<Link href='/'>
					<a className='text-xl normal-case btn btn-ghost'>Daisy Marketplace</a>
				</Link>
			</div>
			<div className='hidden navbar-center lg:flex'>
				<ul className='p-0 menu menu-horizontal'>
					<li>
						<Link href='/'>
							<a>Marketplace</a>
						</Link>
					</li>

					<li>
						<Link href='/nft/create'>
							<a>Create</a>
						</Link>
					</li>
				</ul>
			</div>
			<div className='navbar-end'>
				<div className='self-center mr-2 text-gray-300'>
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800'>
						<svg
							className='-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400'
							fill='currentColor'
							viewBox='0 0 8 8'>
							<circle cx={4} cy={4} r={3} />
						</svg>
						{isInstalled
							? network.data
							: network.isLoading
							? 'Loading...'
							: 'Install Web3 Wallet'}
					</span>
				</div>
				<WalletBar
					connect={connect}
					isInstalled={isInstalled}
					account={data}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}

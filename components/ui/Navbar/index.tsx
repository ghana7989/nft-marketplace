import {useAccount} from '@hooks';
import Link from 'next/link';
import {useState} from 'react';

export function Navbar() {
	const {
		account: {data, connect, isInstalled, isLoading},
	} = useAccount();
	return (
		<div className='self-center navbar bg-base-100 max-w-7xl'>
			{data}
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
				{!isLoading ? (
					<div className='dropdown dropdown-end'>
						<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
							<div className='w-10 rounded-full'>
								<img src='https://api.lorem.space/image/face?hash=33791' />
							</div>
						</label>
						<ul
							tabIndex={0}
							className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'>
							<li>
								<Link href='/profile'>
									<a className='justify-between'>
										Profile
										<span className='badge'>New</span>
									</a>
								</Link>
							</li>

							<li>
								<a>Logout</a>
							</li>
						</ul>
					</div>
				) : (
					<button className='text-white btn btn-info' onClick={connect}>
						Connect Wallet
					</button>
				)}
			</div>
		</div>
	);
}

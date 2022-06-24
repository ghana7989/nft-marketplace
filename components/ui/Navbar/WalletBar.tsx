import Link from 'next/link';
import {FC} from 'react';

interface IWalletBarProps {
	connect: () => void;
	isLoading: boolean;
	isInstalled: boolean;
	account: string | undefined;
}
export const WalletBar: FC<IWalletBarProps> = ({
	connect,
	account,
	isInstalled,
	isLoading,
}) => {
	if (isLoading) {
		return <button className='text-white btn btn-info'>Loading...</button>;
	}

	if (account) {
		return (
			<div className='dropdown dropdown-end'>
				<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
					<div className='w-12 rounded-full'>
						<img src='/avataaars.png' />
					</div>
				</label>

				<ul
					tabIndex={0}
					className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'>
					<li>
						<Link href='/profile'>
							<a className='justify-between'>
								Profile (
								{account.substring(0, 6) +
									'...' +
									account.substring(account.length - 4, account.length)}
								)<span className='badge'>New</span>
							</a>
						</Link>
					</li>

					<li>
						<a
							onClick={() => {
								alert(
									'I do not know how to log out, go and do it manually, -> https://metamask.zendesk.com/hc/en-us/articles/360059535551-Disconnect-wallet-from-a-dapp',
								);
							}}>
							Logout
						</a>
					</li>
				</ul>
			</div>
		);
	}
	if (isInstalled) {
		return (
			<button className='text-white btn btn-info' onClick={connect}>
				Connect Wallet
			</button>
		);
	} else {
		return (
			<button
				className='text-white btn btn-danger'
				onClick={() => {
					window.open('https://metamask.io', '_blank');
				}}>
				No Wallet
			</button>
		);
	}
};

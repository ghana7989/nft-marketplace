import {Web3Provider} from '@providers';
import type {AppProps} from 'next/app';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
function MyApp({Component, pageProps}: AppProps) {
	return (
		<div className='flex flex-col'>
			<Web3Provider>
				<ToastContainer />
				<Component {...pageProps} />
			</Web3Provider>
		</div>
	);
}

export default MyApp;

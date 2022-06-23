import {FC} from 'react';
import {Navbar} from '../Navbar';
interface Props {
	children: React.ReactNode;
}

const BaseLayout: FC<Props> = ({children}) => {
	return (
		<>
			<Navbar />
			<div className='min-h-screen py-16 overflow-hidden bg-gray-50'>
				<div className='px-4 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8'>
					{children}
				</div>
			</div>
		</>
	);
};

export {BaseLayout};

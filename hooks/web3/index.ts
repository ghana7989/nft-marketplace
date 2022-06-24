import {useHooks} from '@providers';

export const useAccount = () => {
	const hooks = useHooks();
	const swrRes = hooks.useAccount();
	return {
		account: swrRes,
	};
};

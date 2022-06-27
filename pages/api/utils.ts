import { withIronSession } from 'next-iron-session';
import contract from '../../public/contracts/NftMarket.json';



const NETWORKS = {
  '5777': 'Ganache',
};

export const targetNetwork = process.env
  .NEXT_PUBLIC_NETWORK_ID as keyof typeof NETWORKS;

export const contractAddress = contract.networks[ targetNetwork ].address;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: 'nft-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  });
}
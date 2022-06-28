import { NftMarketContract } from '@_types/nftMarketContract';
import * as utils from 'ethereumjs-util';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';
import contract from '../../public/contracts/NftMarket.json';

import pinataClient from '@pinata/sdk';
export const pinataApiKey = process.env.PINATA_API_KEY;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
export const pinata = pinataClient(pinataApiKey, pinataSecretApiKey);
const abi = contract.abi;

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
const url = process.env.NODE_ENV === "production" ?
  process.env.INFURA_ROPSTEN_URL :
  "http://127.0.0.1:7545";
export const addressCheckMiddleware = async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get("message-session");
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    let nonce: string | Buffer =
      "\x19Ethereum Signed Message:\n" +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = utils.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s } = utils.fromRpcSig(req.body.signature);
    const pubKey = utils.ecrecover(utils.toBuffer(nonce), v, r, s);
    const addrBuffer = utils.pubToAddress(pubKey);
    const address = utils.bufferToHex(addrBuffer);

    if (address === req.body.address) {
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  });
};

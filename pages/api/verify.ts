import { randomUUID } from 'crypto';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';

import { NftMeta } from '@_types/NFT';
import { NftMarketContract } from '@_types/nftMarketContract';

import contract from '../../public/contracts/NftMarket.json';
import { contractAddress, withSession } from './utils';
import * as utils from "ethereumjs-util";
const abi = contract.abi;

export default withSession(async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const message = { contractAddress, id: randomUUID() };
      req.session.set("message-session", message);
      await req.session.save();

      res.status(200).json(message);
    } catch (error) {

      res.status(422).json({ error: error.message, message: "Can not generate the message" });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;
      const nft = body.nft as NftMeta;
      if (!nft.name || !nft.description || !nft.attributes.length) {
        return res.status(422).json({ error: "Missing fields", message: "Missing fields" });
      }
      const message = await req.session.get("message-session");
      if (!message) return res.status(422).json({ error: "Missing message", message: "Missing message" });

      const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
      const contract = new ethers.Contract(contractAddress, abi, provider) as unknown as NftMarketContract;
      let nonce: string | Buffer = `\x19Ethereum Signed Message:\n${ JSON.stringify(message).length }${ JSON.stringify(message) }`;
      nonce = utils.keccak(Buffer.from(nonce, 'utf8'));
      const { v, r, s } = utils.fromRpcSig(req.body.signature);
      const pubKey = utils.ecrecover(utils.toBuffer(nonce), v, r, s);
      const addressBuffer = utils.pubToAddress(pubKey);
      const address = utils.bufferToHex(addressBuffer);

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      res.status(422).json({ error: error.message, message: "Can not verify the message" });
    }
  }
  res.status(405).end();

});

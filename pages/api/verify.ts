import { NftMeta } from '@_types/NFT';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import { addressCheckMiddleware, contractAddress, pinataApiKey, pinataSecretApiKey, withSession } from './utils';




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

      const address = await addressCheckMiddleware(req, res);
      if (!address) return res.status(422).json({ message: "Invalid address" });

      const jsonRes = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        data: {
          pinataMetadata: {
            name: nft.name + "-" + randomUUID(),
          },
          pinataContent: {
            ...nft
          }
        }
      });
      return res.status(200).json({ ...jsonRes.data });
    } catch (error) {
      res.status(422).json({ error: error.message, message: "Can not verify the message" });
    }
  }
  res.status(405).end();

});


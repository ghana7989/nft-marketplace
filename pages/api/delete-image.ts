import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import { pinata, pinataApiKey, pinataSecretApiKey, withSession } from './utils';




export default withSession(async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  const cid = req.body.cid;
  if (req.method === "POST") {
    try {
      await pinata.unpin(cid);

      res.status(200).json({ message: "OK" });
    } catch (error) {

      res.status(422).json({ error: error.message, message: "Can not generate the message" });
    }
  }
});


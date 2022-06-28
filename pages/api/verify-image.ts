import { NextApiRequest, NextApiResponse } from 'next';
import { addressCheckMiddleware, pinataApiKey, pinataSecretApiKey, withSession } from './utils';
import { Session } from "next-iron-session";
import { FileRequest } from '@_types/NFT';
import { randomUUID } from 'crypto';
import axios from 'axios';
import FormData from 'form-data';

export default withSession(async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { bytes, fileName, contentType } = req.body as FileRequest;
    if (!bytes || !fileName || !contentType) return res.status(400).json({ error: "Missing required fields" });
    await addressCheckMiddleware(req, res);

    const buffer = Buffer.from(Object.values(bytes));
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: fileName + "-" + randomUUID(),
      contentType,
    });
    const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data`,
        "pinata_api_key": pinataApiKey,
        "pinata_secret_api_key": pinataSecretApiKey,
      }
    },
    );
    console.log("📢[verify-image.ts:18]: ", fileResponse);
    res.json(fileResponse.data);
  }
  else {
    return res.status(422).json({
      message: "Invalid route"
    });
  }
});

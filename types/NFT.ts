export type Trait = 'attack' | 'health' | 'speed';

export type NftAttribute = {
  trait_type: Trait;
  value: string;
};

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
};

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type Nft = {
  meta: NftMeta;
} & NftCore;

export type FileRequest = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};


export type PinataResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

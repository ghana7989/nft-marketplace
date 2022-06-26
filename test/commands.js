const instance = await NftMarket.deployed();
instance.mintToken('https://gateway.pinata.cloud/ipfs/QmVnohPeygA6mqXBq6hLAyRyw4WqV88opDRrVAv7CsyRgS','500000000000000000',{value: '25000000000000000',from: accounts[0],	});
instance.mintToken('https://gateway.pinata.cloud/ipfs/Qmcm3Qyy81KfeGdtV7awexej6QsDR3pHUThkXchWNZWX7o','500000000000000000',{value: '25000000000000000',from: accounts[0],	});

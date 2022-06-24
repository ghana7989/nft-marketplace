const {assert} = require('console');

const NftMarket = artifacts.require('NftMarket');
const ethers = require('ethers');
contract('NftMarket', accounts => {
	let _contract = null;
	let _ntfPrice = ethers.utils.parseEther('0.1').toString();
	let _listingPrice = ethers.utils.parseEther('0.025').toString();

	before(async () => {
		_contract = await NftMarket.deployed();
	});
	describe('Mint token', () => {
		const tokenURI = 'https://test.com';
		before(async () => {
			await _contract.mintToken(tokenURI, _ntfPrice, {
				from: accounts[0],
				value: _listingPrice,
			});
		});
		it('owner of the first token should be address[0]', async () => {
			const owner = await _contract.ownerOf(1);
			assert(owner == accounts[0], 'owner should be accounts[0]');
		});
		it('first token should point to the correct tokenURI', async () => {
			const actualTokenURI = await _contract.tokenURI(1);
			assert(
				actualTokenURI == tokenURI,
				'tokenURI in the contract is NOT same tokenURI provided for the test',
			);
		});
		it('should NOT be possible to create NFT with used tokenURI', async () => {
			try {
				await _contract.mintToken(tokenURI, _ntfPrice, {
					from: accounts[0],
				});
			} catch (error) {
				assert(error, 'NFT was minted with used tokenURI');
			}
		});
		it('should have one listed item', async () => {
			const count = await _contract.listedItemsCount();
			assert(
				count.toNumber() === 1,
				'listed Items count should be one because we are minting one token in before block',
			);
		});
		it('should have created NFT item', async () => {
			const nftItem = await _contract.getNftItem(1);
			assert(nftItem.tokenId === '1', 'tokenId should be 1');
			assert(nftItem.price === _ntfPrice, 'Nft price is incorrect');
			assert(
				nftItem.creator === accounts[0],
				'creator is not the first account in accounts array (accounts[0])',
			);
			assert(
				nftItem.isListed === true,
				'Initial NFT should be listed unless it is deListed',
			);
		});
	});

	describe('Buy NFT', async () => {
		before(async () => {
			await _contract.buyNft(1, {
				from: accounts[1],
				value: _ntfPrice,
			});
		});
		it('should be un-listed after buying', async () => {
			const listedItem = await _contract.getNftItem(1);
			assert(listedItem.isListed === false, 'NFT should be unlisted');
		});
		it('should decrease the total items count', async () => {
			const count = await _contract.listedItemsCount();
			assert(
				count.toNumber() === 0,
				'total items count should be 0 this mean the decrement is not working ',
			);
		});
		it('should change the owner', async () => {
			const currentOwner = await _contract.ownerOf(1);
			assert(currentOwner === accounts[1], 'owner should be accounts[1]');
		});
	});
});

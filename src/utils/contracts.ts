import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { currentNetwork, getContractObj } from ".";
import { NFTStakingEngineDetail, NFTMintEngineDetail } from "./typs";
import { RPC_URLS } from "./connectors";

export async function getMintEngineInfo() {
    const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[currentNetwork]);
    const NFTContract = getContractObj('TAKEOVERE_NFT', currentNetwork, jsonProvider);
    try {
        const [
            maxSupply,
            totalSupply,
            price,
            saleStep
        ] = await Promise.all([
            NFTContract.MAX_SUPPLY(),
            NFTContract.totalSupply(),
            NFTContract.PUBLIC_PRICE(),
            NFTContract.SALE_STEP(),
        ]);

        const mintDetail: NFTMintEngineDetail = {
            maxSupply: maxSupply.toNumber(),
            totalSupply: totalSupply.toNumber(),
            price: parseFloat(ethers.utils.formatEther(price)),
            saleStep: saleStep.toNumber(),
        }

        return mintDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function mintNFTs(chainId, provider, amount) {
    const NFTContract = getContractObj('TAKEOVERE_NFT', chainId, provider);
    try {
        const price: BigNumber = await NFTContract.PUBLIC_PRICE();
        const tx = await NFTContract.purchase(amount, {
            value: price.mul(amount)
        });
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


export async function getStakingEngineInfo(account) {
    const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[currentNetwork]);
    const NFTContract = getContractObj('TAKEOVERE_NFT', currentNetwork, jsonProvider);
    const TokenContract = getContractObj('TAKEOVER_Token', currentNetwork, jsonProvider);

    try {
        const [
            earned,
            currentNFTList,
            stakedNFTList,
            userStakeInfo,
            dailyTokenRewards,
            tokenDecimals,
        ] = await Promise.all([
            account ? NFTContract.earnedForAll(account) : BigNumber.from(0),
            account ? NFTContract.userHoldNFTs(account) : [],
            account ? NFTContract.userStakedNFTs(account) : [],
            account ? NFTContract.userStakeInfo(account) : null,
            NFTContract.dailyTokenRewards(),
            TokenContract.decimals(),
        ]);

        const stakingDetail: NFTStakingEngineDetail = {
            earned: parseFloat(ethers.utils.formatUnits(earned, tokenDecimals)),
            currentNFTList: currentNFTList,
            stakedNFTList: stakedNFTList,
            lastUpdated: userStakeInfo.lastUpdated,
            dailyTokenRewards: parseFloat(ethers.utils.formatUnits(dailyTokenRewards, tokenDecimals)),
        }

        return stakingDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function stakeNFTs(chainId, provider, account, tokenIDList) {
    const NFTContract = getContractObj('TAKEOVERE_NFT', chainId, provider);
    try {
        const isApprovedForAll: boolean = await NFTContract.isApprovedForAll(account, NFTContract.address);
        if (isApprovedForAll !== true) {
            const tx1 = await NFTContract.setApprovalForAll(NFTContract.address, true);
            await tx1.wait(1);
        }

        const tx2 = await NFTContract.stakeForDay(tokenIDList);
        await tx2.wait(1);
        return true;
        
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function unstakeNFTs(chainId, provider, tokenIDList) {
    const NFTContract = getContractObj('TAKEOVERE_NFT', chainId, provider);
    try {
        const tx2 = await NFTContract.unstakeForDay(tokenIDList);
        await tx2.wait(1);
        return true;
       
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function claimReward(chainId, provider) {
    const NFTContract = getContractObj('TAKEOVERE_NFT', chainId, provider);
    try {
        const tx = await NFTContract.harvest();
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


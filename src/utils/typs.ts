export interface NFTMintEngineDetail {
    maxSupply: number;
    totalSupply: number;
    price: number;
    saleStep: number;
}

export interface NFTStakingEngineDetail {
    earned: number;
    currentNFTList: string[];
    stakedNFTList: string[];
    lastUpdated: number;
    dailyTokenRewards: number;
}
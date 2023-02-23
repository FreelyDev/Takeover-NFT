import Loading from 'components/loading/Loading';
import Menu from 'components/menu/Menu';
import Topbar from 'components/topbar/Topbar';
import { useEffect, useState } from 'react';
import StakingCard from 'components/stakingCard';
import toast from 'react-hot-toast';
import { useWeb3React } from '@web3-react/core';
import { currentNetwork } from 'utils';
import { claimReward, getStakingEngineInfo, stakeNFTs, unstakeNFTs } from 'utils/contracts';
import { NFTStakingEngineDetail } from 'utils/typs';

import './style.scss';
export default function StakingPage() {
    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => {
        setIsLoading(false)
    };
    const [imgCount, setImgCount] = useState(0);
    const onLoad = () => {
        setImgCount(imgCount + 1)
    }
    useEffect(() => {
        if (imgCount === 1){
            setTimeout(() => {
                setIsLoading(false)
            }, 500);
        }
    }, [setIsLoading, imgCount]);

    // ======  selected ID list ======== by XU 
    const [selectedCurrentNFTList, setSelectedCurrentNFTList] = useState([]);
    // ========= selected ID list =========  by XU
    const [selectedStakedNFTList, setSelectedStakedNFTList] = useState([]);

    const [isLoadedCurrentNFTList, setIsLoadedCurrentNFTList] = useState(false);
    const [isLoadedStakedNFTList, setIsLoadedStakedNFTList] = useState(false);

    const { connector, library, chainId, account, active } = useWeb3React();
    const [loginStatus, setLoginStatus] = useState(true);
    const [stakingEngineDetail, setStakingEngineDetail] = useState<NFTStakingEngineDetail>(null);
    const [dailyRewards, setDailyRewards] = useState(0.00);
    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(currentNetwork);
        setLoginStatus(isLoggedin);

        if (isLoggedin) {
            getStakingEngineInfo(account).then(
                (engineDetail: NFTStakingEngineDetail) => {
                    setStakingEngineDetail(engineDetail);
                    setIsLoadedCurrentNFTList(true);
                    setIsLoadedStakedNFTList(true);
                    let totalRewards = 0;
                    totalRewards = engineDetail?.dailyTokenRewards * engineDetail?.stakedNFTList.length;
                    setDailyRewards(totalRewards);
                }
            );
        }
    }, [connector, library, account, active, chainId]);

    const stakeSelectedNFT = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (selectedCurrentNFTList.length <= 0) {
            toast.error("Selcted NFT count should be higher than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Staking...");
        try {
            const bSuccess = await stakeNFTs(chainId, library.getSigner(), account, selectedCurrentNFTList);
            if (bSuccess) {
                toast.success("Staking Success!");
                setTimeout(() => {
                    getStakingEngineInfo(account).then((engineDetail: NFTStakingEngineDetail) => {
                        setStakingEngineDetail(engineDetail);
                        setIsLoadedCurrentNFTList(true);
                        setIsLoadedStakedNFTList(true);
                        let totalRewards = 0;
                        totalRewards = engineDetail?.dailyTokenRewards * engineDetail?.stakedNFTList.length;
                        setDailyRewards(totalRewards);
                    });
                }, 2000);
            } else {
                toast.error("Staking Failed!");
            }
        } catch (error) {
            toast.error("Staking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const unstakeSelectedNFT = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (selectedStakedNFTList.length <= 0) {
            toast.error("Selcted NFT count should be higher than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Unstaking...");
        try {
            const bSuccess = await unstakeNFTs(chainId, library.getSigner(), selectedStakedNFTList);
            if (bSuccess) {
                toast.success("Unstaking Success!");
                setTimeout(() => {
                    getStakingEngineInfo(account).then((engineDetail: NFTStakingEngineDetail) => {
                        setStakingEngineDetail(engineDetail);
                        setIsLoadedCurrentNFTList(true);
                        setIsLoadedStakedNFTList(true);
                        let totalRewards = 0;
                        totalRewards = engineDetail?.dailyTokenRewards * engineDetail?.stakedNFTList.length;
                        setDailyRewards(totalRewards);
                    });
                }, 2000);
            } else {
                toast.error("Unstaking Failed!");
            }
        } catch (error) {
            toast.error("Unstaking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const handleClaim = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }
        const load_toast_id = toast.loading("Please wait for Claim Reward...");
        try {

            const bSuccess = await claimReward(chainId, library.getSigner());
            if (bSuccess) {
                toast.success("Claiming Success!");
                const engineDetail: NFTStakingEngineDetail = await getStakingEngineInfo(account);
                setStakingEngineDetail(engineDetail);
            } else {
                toast.error("Claiming Failed!");
            }
        } catch (error) {
            toast.error("Claiming Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    return (
        <>
            <Topbar/>
            <Menu />
            <Loading isLoading={isLoading} />
            <div className="sections" >
                <div className="seasonSection">
                    <div className="scroll" />
                    <div className="seasonContent" >
                        <h1 data-aos="fade-up">Staking</h1>

                        {!loginStatus ?
                            <div className="wrapper" >
                                <div className="noneWallet" data-aos="fade-up">
                                    <h2>Please connect wallet</h2>
                                </div>
                            </div> :
                            <>
                                <div className="wrapper" >
                                    <div className="left">

                                    <div className="calm">
                                        <h2>REWARDS : <span>{(stakingEngineDetail?.earned || 0).toFixed(2)}</span> $ TAKEOVER</h2>
                                        <p>{(dailyRewards || 0).toFixed(2)} Rewards Per Day</p>
                                        <button className="claimBtn button" disabled={!loginStatus} onClick={handleClaim} >CLAIM
                                        </button>
                                    </div>

                                        
                                    </div>
                                    <div className="right">

                                        <StakingCard
                                            // nfts={stakingEngineDetail?.currentNFTList}
                                            nfts={['1', '2','3', '4', '5', '6', '7', '8', '9', '10']}
                                            dataLoaded={isLoadedCurrentNFTList}

                                            selectdNftIds={selectedCurrentNFTList}
                                            setSelectedNftIds={setSelectedCurrentNFTList}
                                            OnStake={stakeSelectedNFT}
                                        />

                                        <StakingCard

                                            nfts_staked={['1', '2','3', '4', '5', '6', '7', '8', '9', '10']}
                                            // nfts_staked={stakingEngineDetail?.stakedNFTList}

                                            dataLoaded={isLoadedStakedNFTList}
                                            isStaked

                                            selectdNftIds_Staked={selectedStakedNFTList}
                                            setSelectedNftIds_Staked={setSelectedStakedNFTList}
                                            OnUnStake={unstakeSelectedNFT}

                                            lastUpdated = {Number(stakingEngineDetail?.lastUpdated || 0)}
                                        />

                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <img src="/assets/stakingBack.gif" alt="" className="back" onLoad={onLoad} style = {{filter : loginStatus? 'none':'blur(5px)'}}/>
                </div>
            </div>
        </>
    )
}

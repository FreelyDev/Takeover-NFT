import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { currentNetwork } from 'utils';
import { claimReward, getStakingEngineInfo } from 'utils/contracts';
import { NFTStakingEngineDetail } from 'utils/typs';
import './home.scss'

type LoadingType = {
    setIsLoading?(flag: boolean): void;
};

export default function Home({ setIsLoading }: LoadingType) {

    const [imgCount, setImgCount] = useState(0);
    const onLoad = () => {
        setImgCount(imgCount + 1)
    }
    useEffect(() => {
        if (imgCount >= 2) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        }
    }, [setIsLoading, imgCount]);

    const { connector, library, chainId, account, active } = useWeb3React();
    const [loginStatus, setLoginStatus] = useState(true);
    const [stakingEngineDetail, setStakingEngineDetail] = useState<NFTStakingEngineDetail>(null);
    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(currentNetwork);
        setLoginStatus(isLoggedin);
        getStakingEngineInfo(account).then(
            (engineDetail: NFTStakingEngineDetail) => {
                setStakingEngineDetail(engineDetail);

            }
        );
    }, [connector, library, account, active, chainId]);
    
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
        <div className="home" id="home">
            <img src="/assets/9a996a_520dafb995474a748e0cba7c842026ec_mv2.webp" alt="" className="back" onLoad = {onLoad}/>
            <div className="homeContent">
                <h1>Staking Its Just PEPE</h1>
                <div className="warpper" data-aos="fade-up">

                    <div className="calm">
                        <img src="/assets/bar_03.png" alt="" className="back" onLoad = {onLoad}/>
                        <h2><span className='gray'>REWARDS :</span> <span>{stakingEngineDetail?.earned?.toFixed(2)}</span> $ PEP</h2>
                        <p>25 PEP for every 1 NFT Staked per 24 hour</p>
                        <button 
                            className="claimBtn button" 
                            disabled={!loginStatus} 
                            onClick={handleClaim}
                            style={{backgroundImage: `url("assets/button01.png")`}}
                        >CLAIM
                        </button>
                    </div>

                </div>
            </div>
            
        </div>
    )
}

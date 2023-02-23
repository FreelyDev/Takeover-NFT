import Loading from 'components/loading/Loading';
import Menu from 'components/menu/Menu';
import Topbar from 'components/topbar/Topbar';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import toast from 'react-hot-toast';
import Timer from 'components/timer/Timer';
import './style.scss'
import { NFTMintEngineDetail } from 'utils/typs';
import { getMintEngineInfo, mintNFTs } from 'utils/contracts';

export default function MintPage() {
    const [isLoading, setIsLoading] = useState(true);

    window.onload = () => {
        setIsLoading(false)
    };

    const [imgCount, setImgCount] = useState(0);
    const onLoad = () => {
        setImgCount(imgCount + 1)
    }
    useEffect(() => {
        if (imgCount === 2){
            setTimeout(() => {
                setIsLoading(false)
            }, 500);
        }
    }, [setIsLoading, imgCount]);

    const [showMint, setShowMint] = useState(false)
    const [mintCount, setMintCount] = useState(1);

    const decreaseHandle = () => {
        if (mintCount > 0) {
            setMintCount(mintCount - 1)
        }

    }
    const increaseHandle = () => {
        if (mintCount < 30) {
            setMintCount(mintCount + 1)
        }
    }

    const [loginStatus, setLoginStatus] = useState(false);
    const { connector, library, chainId, account, active } = useWeb3React();
    const [mintDetail, setMintDetail] = useState<NFTMintEngineDetail>(null);

    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(process.env.REACT_APP_NETWORK_ID, 10);
        setLoginStatus(isLoggedin);
    }, [connector, library, account, active, chainId]);

    useEffect(() => {
        getMintEngineInfo().then((detail) => {
            setMintDetail(detail);
        });
    }, []);

    const mintTokens = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (mintCount <= 0) {
            toast.error("Mint Count should be higer than 0");
            return;
        }

        if (mintDetail?.saleStep !== 1) {
            toast.error("NFT Sale is not opened yet. Please wait launch time.");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Mint...");
        try {
            const bSuccess = await mintNFTs(chainId, library.getSigner(), mintCount);
            if (bSuccess) {
                toast.success("Mint Success!");
                setTimeout(() => {
                    getMintEngineInfo().then((detail) => {
                        setMintDetail(detail);
                    });
                }, 2000);
            } else {
                toast.error("Mint Failed!");
            }
        } catch (error) {
            toast.error("Mint Failed!");
        }
        toast.dismiss(load_toast_id);
    };

    return (
        <>
            <Topbar/>
            <Menu/>
            <Loading isLoading={isLoading} />
            <div className="sections">
                <div className="mint">
                    <div className="scroll" id='mint'> </div>
                    <div className="mintContent">
                        <div className="mintWrapper">
                            <div className="left" data-aos="fade-right">
                                <img src="/assets/mint.gif" alt="" onLoad={onLoad} />
                            </div>
                            <div className="right" data-aos="fade-left">
                                <h1>Mint Takeover</h1>
                                {showMint === false ?
                                    <div className="countDown">
                                        {/* <Timer deadLine={1677175200} setShowMint={() => { setShowMint(true) }} /> */}
                                        <Timer deadLine={0} setShowMint={() => { setShowMint(true) }} />
                                    </div>:
                                    <>
                                        <div className="mintCount">
                                            <button
                                                className="mintIncDec"
                                                onClick={decreaseHandle}
                                                disabled = {!loginStatus}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>

                                            <span className="mintCountValue" style={{}}>{mintCount}</span>
                                            <button
                                                className="mintIncDec"
                                                onClick={increaseHandle}
                                                disabled = {!loginStatus}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button
                                                className="mintNow button"
                                                disabled = {!loginStatus}
                                                onClick={mintTokens}
                                            >Mint Now</button>
                                        </div>
                                        <div className='state'>
                                            <span>
                                                <p>✓ Price : </p> 
                                                <p><strong>{(mintDetail?.price || 0).toFixed(2)}</strong> ETH</p>
                                            </span>
                                            <span>
                                                <p>✓ Minted :</p> 
                                                <p><strong>{mintDetail?.totalSupply} / {mintDetail?.maxSupply || 10000}</strong></p>
                                            </span>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <img src="/assets/back.gif" alt="" className="back" onLoad={onLoad}  style = {{filter : loginStatus? 'none':'blur(5px)'}}/>
                </div>
            </div>
        </>
    )
}

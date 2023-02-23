import './gallery.scss'
import { useEffect, useRef, useState } from "react";
import useDraggableScroll from 'use-draggable-scroll';
import Loader from 'components/loader/Loader';
import { useWeb3React } from '@web3-react/core';
import BtnTimer from 'components/timer/BtnTimer';

type GalleryProps = {
    nfts: string[]
    isStaked ?:boolean
    selectedIds: string[]
    onSelect(nftIds: string[]): void
    onSelectAll(nftIds: string[]): void
    onDeselect(nftIds: string[]): void
    onUnstake ?:any
    onStake ?:any
    selectedCount ?:number
    lastUpdated ?: number
};

export default function Gallery({ nfts, selectedIds, isStaked, onSelect, onSelectAll, onDeselect, onUnstake, onStake, selectedCount, lastUpdated }: GalleryProps): JSX.Element {
    const ref = useRef(null);
    const { onMouseDown } = useDraggableScroll(ref, { direction: 'horizontal' });
    const [loadedCount, SetLoadedCount] = useState(0)
    const [allImgLoaded, setAllImgLoaded] = useState(false)
    const isAllSelected = nfts.length > 0 && nfts.filter((nft) => selectedIds.indexOf(nft) === -1).length === 0

    const handleLoading = function () {
        SetLoadedCount(loadedCount + 1)
        if (loadedCount + 1 === nfts.length) {
            setAllImgLoaded(true)
        }
    };
    useEffect(() => {
        setTimeout(() => {
            setAllImgLoaded(true)
         }, 3000);

    }, [setAllImgLoaded]);

    const handleClick = (isSelected, nftId: string) => {
        if (isSelected) {
            onDeselect([nftId])
        } else {
            onSelect([nftId])
        }
    }

    const handleAllClick = () => {
        const tokenIds = nfts.map((nft) => nft)
        if (isAllSelected) {
            onDeselect(tokenIds)
        } else {
            onSelectAll(tokenIds)
        }
    }
    const [isAvailable, setIsAvailable] = useState(true)
    const { connector, library, chainId, account, active } = useWeb3React();
    useEffect(() => {
        let myInterval = setInterval(() => {
            const currentDate: any = Date.now()/1000;

            if (currentDate < lastUpdated) {
                setIsAvailable(false)
            }
            else{
                setIsAvailable(true)
            }

        }, 0)
        return () => {
            clearInterval(myInterval);
        };

    }, [connector, library, account, active, chainId, lastUpdated, setIsAvailable]);

    return (
        <div className="gallery">
            <div className="top">
                <p>{`${nfts?.length || 0} NFTS ${isStaked ? `IN STAKED POOL` : 'IN YOUR WALLET'}`}</p>
                <div className="row">
                <button
                    disabled={!isAllSelected && nfts.length === 0}
                    onClick={handleAllClick}
                    className = 'selectBtn'
                >{!isAllSelected ? 'Select All' : 'UnSelect All'}</button>

                {isStaked ? 
                    <button
                    disabled={selectedCount === 0 || !isAvailable}
                    onClick={onUnstake}
                    className = 'stakeBtn'
                >{isAvailable ? `Unstake ${selectedCount || ''}` : <BtnTimer deadLine={lastUpdated}/>}</button>:
                <button
                    disabled={selectedCount === 0 || !isAvailable}
                    onClick={onStake}
                    className = 'stakeBtn'
                >{isAvailable ? `Stake ${selectedCount || ''}` : <BtnTimer deadLine={lastUpdated}/>}</button>
                } 
                </div>
                
            </div>
            
            <div className="imgContent">
                {nfts.length === 0?
                    <div className="noNFT">
                        <p>No NFTs</p>
                    </div>
                    :
                    <div className={!allImgLoaded ? "img_loader" : "img_loader imgDone"}>
                        <Loader />
                    </div>
                }

                <div className={!allImgLoaded ? "slideView" : "slideView done"} onMouseDown={onMouseDown} ref={ref}>
                    <div className="slideList">
                        {nfts.map((nft) => {
                            const isSelected = selectedIds.indexOf(nft) > -1;
                            const imgUrl = `/assets/nfts/${nft}.gif`
                            // const imgUrl = `/${nft}.jpg`
                            return <div className={isSelected ? "sideImg selected" : "sideImg"}
                                onClick={() => { handleClick(isSelected, nft) }}
                                key={`nft${nft}`}
                            >
                                <div className="imgContainer">
                                    <img src={imgUrl} alt="" onLoad={handleLoading} />
                                    <p className="tokenID"># {nft}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            
        </div>
    )
}


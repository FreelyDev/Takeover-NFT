import { useWeb3React } from '@web3-react/core';
import AccountModal from 'components/accountModal/AccountModal';
import { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link'
import { truncateWalletString } from 'utils';
import ConnectModal from '../connectModal/ConnectModal';
import './topbar.scss'


export default function Topbar() {
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

    const [loginStatus, setLoginStatus] = useState(false);
    const { connector, library, chainId, account, active } = useWeb3React();
    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(process.env.REACT_APP_NETWORK_ID, 10);
        setLoginStatus(isLoggedin);
    }, [connector, library, account, active, chainId]);

    const [isDown, setIsDown] = useState('')
    const handleDown = (value: string) => {
        setIsDown(value)
    }
    const handleUp = (value: string) => {
        setIsDown(value)
    }

    return (
        <div className="topbar">
            <div className="logo">
                <HashLink to="/#home" ><img src="assets/logo.png" alt="" /></HashLink>
            </div>
            <div className="navList">
                <ul>
                    <li><HashLink to="/" smooth>Mint</HashLink></li>
                    <li><HashLink to="/staking" smooth>Staking</HashLink></li>
                </ul>
            </div>
            <div className="btns">
                <div className="socialLinks">
                    <a href="/" target="_blank"rel="noreferrer">
                        <img src="/assets/opensea.webp" alt="" />
                    </a> 
                    <a href="https://twitter.com/Operation_TKO" target="_blank"rel="noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a> 
                    <a href="https://discord.gg/v885RBtttf" target="_blank"rel="noreferrer">
                        <i className="fab fa-discord"></i>
                    </a> 
                   
                </div>
                <div
                    className={isDown === 'connectBtnDown' ? "connectBtn button connectBtnDown" : "connectBtn button"}
                    onMouseDown={() => { handleDown('connectBtnDown') }}
                    onMouseUp={() => { handleUp('') }}
                    onClick={() => { !loginStatus ? setShowConnectModal(true) : setShowAccountModal(true) }}
                >
                    {loginStatus ? truncateWalletString(account) : "CONNECT WALLET"}
                    
                </div>
               
            </div>

            <AccountModal  showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
            <ConnectModal showConnectModal={showConnectModal} setShowConnectModal={setShowConnectModal} />
        </div>
    )
}

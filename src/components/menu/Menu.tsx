import "./menu.scss"
import {HashLink} from 'react-router-hash-link'
import { useState } from "react";

export default function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
       <>
        <div className={"sidebar " + (menuOpen && "active")}>
            <ul>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem1 " + (menuOpen && "active")}>
                    <HashLink to="/">Mint</HashLink>
                </li>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem2 " + (menuOpen && "active")}>
                <HashLink to="/staking" smooth>Staking</HashLink>
                </li>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem3 " + (menuOpen && "active")}>
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
                </li>
            </ul>
        </div>
        <div className={(menuOpen ? "hamburger active" : "hamburger")} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
        </div>
        </>
    )
}


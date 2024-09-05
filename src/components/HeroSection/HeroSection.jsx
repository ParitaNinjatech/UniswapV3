

import React, { useEffect, useState, useContext } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from "ethers"
import Style from "./HeroSection.module.css";
import images from "../../assets";
import { Token, SearchToken } from "../index";
import { routerAddress, ChainId } from '../../constant/Chain';
import { tokenObj, uniSwapObj } from '../../constant/ContractObject';

export default function HeroSection({ accounts, tokenData }) {
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId } = useWeb3ModalAccount()
    console.log(walletProvider, "walletProvider");


    const [openSetting, setOpenSetting] = useState(false);
    const [openToken, setOpenToken] = useState(false);
    const [openTokenTwo, setOpenTokenTwo] = useState(false);
    const [amountIn, setAmount] = useState();

    const [tokenOne, setTokenOne] = useState({
        name: "",
        image: "",
        address: ""
    })

    const [tokenTwo, setTokenTwo] = useState({
        name: "",
        image: "",
        address: ""
    })
    console.log(tokenOne, "TokenOne");

    const swapToken = async () => {
        try {
            if (!walletProvider) {
                alert("Please Connect Wallet");
                return;
            }

            const provider = new Web3Provider(walletProvider);
            const signer = provider.getSigner();
            const getRouterAddress = routerAddress.get(chainId);

            console.log(signer, "signer", chainId, address, "Router Address:", getRouterAddress);

            // Check if router address and tokens are valid
            if (!getRouterAddress) {
                alert("Invalid router address for the selected chain.");
                return;
            }

            if (!tokenOne.address || !ethers.utils.isAddress(tokenOne.address)) {
                alert("Invalid token address for Token One.");
                return;
            }

            if (!tokenTwo.address || !ethers.utils.isAddress(tokenTwo.address)) {
                alert("Invalid token address for Token Two.");
                return;
            }

            const tokenobj = await tokenObj(tokenOne.address, signer);
            const uniswapobj = await uniSwapObj(getRouterAddress, signer);
            const WETH = await uniswapobj.WETH9()
            console.log(WETH, "WETH");


            const amountApproval = ethers.utils.parseUnits(amountIn, 18);
            const swapData = {
                tokenIn: tokenOne.address,
                tokenOut: tokenTwo.address,
                fee: 3000,
                recipient: address,
                deadline: Math.floor(Date.now() / 1000) + 60 * 10,
                amountIn: ethers.utils.parseUnits(amountIn, 18),
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            };

            console.log(swapData, "Swap Data");

            // Approve token
            const approvetoken = await tokenobj.approve(getRouterAddress, amountApproval);
            await approvetoken.wait();

            // Perform the swap

            if (tokenOne.address === WETH) {
                const swapTx = await uniswapobj.exactInputSingle(swapData, {
                    value: ethers.utils.parseUnits(amountIn, 18)
                });

                console.log("Swap Result: ", swapTx);
                await swapTx.wait();
            } else if (tokenTwo.address === WETH) {
                const swapTx = await uniswapobj.exactInputSingle(swapData);
                console.log("Swap Result: ", swapTx);
                await swapTx.wait();
            } else {
                const swapTx = await uniswapobj.exactInputSingle(swapData);
                console.log("Swap Result: ", swapTx);
                await swapTx.wait();
            }

        } catch (error) {
            console.error("Error swapping tokens:", error);
        }
    };


    return (
        <div className={Style.HeroSection}>
            <div className={Style.HeroSection_box}>
                <div className={Style.HeroSection_box_heading}>
                    <p>Swap</p>
                    <div className={Style.HeroSection_box_heading_img}>
                        <img src={images.close} alt='image' width={50} height={50} onClick={() => setOpenSetting(true)} />
                    </div>
                </div>

                <div className={Style.HeroSection_box_input}>
                    <input
                        type='number'
                        placeholder='0'
                        style={{ marginLeft: "0.5rem" }}
                        value={amountIn}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.001" // Allows decimal points
                    />
                    <button onClick={() => setOpenToken(true)}>
                        <img src={tokenOne.image || images.etherlogo} width={20} height={20} alt='token' />
                        {tokenOne.name || "ETH"}
                        <small>9474</small>
                    </button>
                </div>

                <div className={Style.HeroSection_box_input}>
                    <input
                        type='number'
                        placeholder='0'
                        style={{ marginLeft: "0.5rem" }}
                        step="0.000001" // Allows decimal points
                    />
                    <button onClick={() => setOpenTokenTwo(true)}>
                        <img src={tokenTwo.image || images.etherlogo} width={20} height={20} alt='token' />
                        {tokenTwo.name || "ETH"}
                        <small>9474</small>
                    </button>
                </div>

                {accounts ? (
                    <button className={Style.HeroSection_box_btn}>Connect Wallet</button>
                ) : (
                    <button className={Style.HeroSection_box_btn} onClick={() => swapToken()}>Swap</button>
                )}
            </div>

            {openSetting && <Token setOpenSetting={setOpenSetting} />}

            {openToken && (
                <SearchToken openToken={setOpenToken} tokens={setTokenOne} tokenData={tokenData} />
            )}

            {openTokenTwo && (
                <SearchToken openToken={setOpenTokenTwo} tokens={setTokenTwo} tokenData={tokenData} />
            )}
        </div>
    )
}
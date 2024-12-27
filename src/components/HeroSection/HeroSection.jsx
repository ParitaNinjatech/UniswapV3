

import React, { useEffect, useState, useContext } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from "ethers"
import Style from "./HeroSection.module.css";
import images from "../../assets";
import { Token, SearchToken } from "../index";
import { routerAddress, ChainId } from '../../constant/Chain';
import { tokenObj, uniSwapObj } from '../../constant/ContractObject';
import { getAbi, FetchPrice } from '../../utils/FetchPrice';

export default function HeroSection({ accounts, tokenData }) {
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId,isConnected } = useWeb3ModalAccount()


    const [openSetting, setOpenSetting] = useState(false);
    const [openToken, setOpenToken] = useState(false);
    const [openTokenTwo, setOpenTokenTwo] = useState(false);
    const [amountIn, setAmount] = useState();
    const [tokenOneBalance, setTokenOnebalance] = useState(0);
    const [tokenTwoBalance, setTokenTwoBalance] = useState(0);
    const [amountOut, setAmountOut] = useState(0);
    const [amountTwo,setAmountTwo] = useState(0)
    const [loading, setLoading] = useState(false)

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

    const balanceof = async () => {
        if (walletProvider && tokenOne.address) {
            const provider = new Web3Provider(walletProvider);
            const signer = provider.getSigner();
            const tokenobj = await tokenObj(tokenOne.address, signer);

            const balanceOne = await tokenobj.balanceOf(address);
            const decimals = await tokenobj.decimals()
            const ethValue = ethers.utils.formatUnits(balanceOne,decimals);
            setTokenOnebalance(ethValue)

        }
    }

    const balanceof2 = async () => {
        if (walletProvider && tokenTwo.address) {
            const provider = new Web3Provider(walletProvider);
            const signer = provider.getSigner();


            const tokenobj2 = await tokenObj(tokenTwo.address, signer);
            const balancetwo = await tokenobj2.balanceOf(address);
            const decimals = await tokenobj2.decimals()
            const ethValue2 = ethers.utils.formatUnits(balancetwo,decimals);
            setTokenTwoBalance(ethValue2)

        }

    }
    const swapToken = async () => {
        try {
            if (!walletProvider) {
                alert("Please Connect Wallet");
                return;
            }

            const provider = new Web3Provider(walletProvider);
            const signer = provider.getSigner();

            const getRouterAddress = routerAddress.get(chainId);


            // if (!getRouterAddress) {
            //     alert("Invalid router address for the selected chain.");
            //     return;
            // }

            // if (!tokenOne.address || !ethers.utils.isAddress(tokenOne.address)) {
            //     alert("Invalid token address for Token One.");
            //     return;
            // }

            // if (!tokenTwo.address || !ethers.utils.isAddress(tokenTwo.address)) {
            //     alert("Invalid token address for Token Two.");
            //     return;
            // }

            const tokenobj = await tokenObj(tokenOne.address, signer);
            const uniswapobj = await uniSwapObj(getRouterAddress, signer);
            const WETH = await uniswapobj.WETH9()


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

            // Approve token
            const approvetoken = await tokenobj.approve(getRouterAddress, amountApproval);
            await approvetoken.wait();

            // Perform the swap

            if (tokenOne.address === WETH) {
                const swapTx = await uniswapobj.exactInputSingle(swapData, {
                    value: ethers.utils.parseUnits(amountIn, 18)
                });

                await swapTx.wait();
            } else if (tokenTwo.address === WETH) {
                const swapTx = await uniswapobj.exactInputSingle(swapData);
                console.log("Swap Result: ", swapTx);
            } else {
                const swapTx = await uniswapobj.exactInputSingle(swapData);
                console.log("Swap Result: ", swapTx);
            }

        } catch (error) {
            console.error("Error swapping tokens:", error);
        }
    };

    const SwapAmountOut = async (amountIn) => {
        try {
            setLoading(true)
            const data = await FetchPrice(walletProvider, chainId, tokenOne.address, tokenTwo.address, amountIn);
            setAmountOut(data[1])

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (walletProvider) {
            balanceof()
            balanceof2();
        }

    }, [tokenOne.address, tokenTwo.address, amountIn])
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
                        onChange={(e) => (SwapAmountOut(e.target.value), setAmount(e.target.value))}
                        step="0.001" // Allows decimal points
                    />
                    <button onClick={() => setOpenToken(true)}>
                        <img src={tokenOne.image || images.etherlogo} width={20} height={20} alt='token' />
                        {tokenOne.name || "ETH"}
                        {/* <small>{tokenOneBalance}</small> */}
                    </button>
                </div>
                <div style={{ display: "flex", gap: "15rem" }}>
                    <p>Balance: </p>
                    <p>{tokenOneBalance}</p>
                </div>

                <div className={Style.HeroSection_box_input}>
                    {loading ? (<img src={images.loading} width={70} height={50} style={{marginLeft:"10px"}} alt='token' />) : (
                        <input
                        style={{ marginLeft: "0.5rem"}}
                        value={amountOut} 
                        readOnly
                
                    />
                    )}

                    <button onClick={() => setOpenTokenTwo(true)}>
                        <img src={tokenTwo.image || images.etherlogo} width={20} height={20} alt='token' />
                        {tokenTwo.name || "ETH"}
                    </button>
                </div>
                <div style={{ display: "flex", gap: "15rem" }}>
                    <p>Balance: </p>
                    <p>{tokenTwoBalance}</p>
                </div>


                {!isConnected ? (
                    <button className={Style.HeroSection_box_btn}>Connect Wallet</button>
                ) : amountIn > tokenOneBalance ? (
                    <button className={Style.HeroSection_box_btn} disabled>Insufficient Funds</button>
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
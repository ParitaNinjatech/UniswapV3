import React, { useEffect, useState } from 'react'

import images from "../../assets";
import Style from "./PoolAdd.module.css";
import { Token, SearchToken } from "../index";
import { routerAddress, ChainId } from '../../constant/Chain';
import { tokenObj, uniSwapObj,uniswapLiquidity,factoryObj } from '../../constant/ContractObject';
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from "ethers"
import { factoryAddress, poolAddress } from "../../constant/Chain";

export default function PoolAdd({ setCloseModel, tokenData }) {
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [openModel, setOpenModel] = useState(false);
    const [openTokenModelOne, setOpenTokenModelOne] = useState(false);
    const [openTokenModelTwo, setOpenTokenModelTwo] = useState(false);
    const [active, setActive] = useState(1);
    const [openFee, setOpenFee] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
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

    const [fees, setFees] = useState(0)
    const [slippage, setSlippage] = useState(25)
    const [deadline, setDeadline] = useState(10);
    const [tokenAmountOne, setTokenAmountOne] = useState(0)
    const [tokenAmountTwo, setTokenAmountTwo] = useState(0)
    const [tokenOneBalance, setTokenOnebalance] = useState(0);
    const [tokenTwoBalance, setTokenTwoBalance] = useState(0);

    const feePairs = [
        {
            fee: "0.05%",
            info: "Best for stable Pairs",
            number: "0% Select",
            feeSystem: 500
        },
        {
            fee: "0.3%",
            info: "Best for stable Pairs",
            number: "0% Select",
            feeSystem: 3000
        },
        {
            fee: "1%",
            info: "Best for stable Pairs",
            number: "0% Select",
            feeSystem: 10000
        }
    ];

    const minPriceRange = (text) => {
        if (text === "+") {
            setMinPrice(minPrice + 1);
        } else if (text === "-" && minPrice > 0) {
            setMinPrice(minPrice - 1);
        }
    };

    const maxPriceRange = (text) => {
        if (text === "+") {
            setMaxPrice(maxPrice + 1);
        } else if (text === "-" && maxPrice > 0) {
            setMaxPrice(maxPrice - 1);
        }
    };

    const balanceof = async () => {
        if (walletProvider && tokenOne.address) {
            const provider = new Web3Provider(walletProvider);
            const signer = provider.getSigner();
            const tokenobj = await tokenObj(tokenOne.address, signer);
            const balanceOne = await tokenobj.balanceOf(address);
            const decimals = await tokenobj.decimals()
            const ethValue = ethers.utils.formatUnits(balanceOne, decimals);
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
            const ethValue2 = ethers.utils.formatUnits(balancetwo, decimals);
            setTokenTwoBalance(ethValue2)
        }
    }

    const CheckTickMath = async () => {
        try {
            if (walletProvider) {
                const provider = new Web3Provider(walletProvider);
                const signer = provider.getSigner();
                
                const getFactoryAddress = factoryAddress.get(chainId);
                const factoryContract =await factoryObj(getFactoryAddress, signer);
    
                const getPairAddress = await factoryContract.getPool(
                    "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
                    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", 
                    3000 
                );
    
              
                if (getPairAddress === ethers.constants.AddressZero) {
                    const createPoolTx = await factoryContract.createPool(
                        "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
                        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                        3000
                    );
                    await createPoolTx.wait();
    
                
                    const sqrtPrice = Math.sqrt(initialPrice);
                    const sqrtPriceX96 = Math.floor(sqrtPrice * Math.pow(2, 96));
    
                    const poolContract = new ethers.Contract(getPairAddress, PairAbi, signer);
                    const initializeTx = await poolContract.initialize(sqrtPriceX96);
                    await initializeTx.wait();
    
                    console.log("Pool initialized with sqrtPriceX96:", sqrtPriceX96);
                }
    
                
                const pairContract = new ethers.Contract(getPairAddress, PairAbi, signer);
                const { sqrtPriceX96, tick } = await pairContract.slot0();
                const tickSpacing = await pairContract.tickSpacing();
                const fee = await pairContract.fee();
                const liquidity = await pairContract.liquidity();
    
                console.log(tickSpacing, "tickSpacing", sqrtPriceX96, "sqrtPriceX96", fee, "fee", liquidity, "liquidity", tick, "tick");
    
              
                const tickLower = nearestUsableTick(Math.log(minPrice), tickSpacing);
                const tickUpper = nearestUsableTick(Math.log(maxPrice), tickSpacing);
    
                console.log(tickLower, "tickLower", tickUpper, "tickUpper");
    
              
                const getPoolAddresss = poolAddress.get(chainId);
                const poolContract = await uniswapLiquidity(getPoolAddresss, signer);
                const token0Contract = await tokenObj("0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec", signer);
                const token1Contract = await tokenObj("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", signer);
    
                const amount0Desired = ethers.utils.parseUnits("200", 18); 
                const amount1Desired = ethers.utils.parseUnits("0.03", 18);
    
                const approval0Tx = await token0Contract.approve(getPoolAddresss, amount0Desired);
                await approval0Tx.wait();
                const approval1Tx = await token1Contract.approve(getPoolAddresss, amount1Desired);
                await approval1Tx.wait();
    
                console.log("Token approvals completed");
    
                const amount0Min = amount0Desired.mul(ethers.BigNumber.from(1).sub(ethers.BigNumber.from(slippageTolerance * 100))).div(100);
                const amount1Min = amount1Desired.mul(ethers.BigNumber.from(1).sub(ethers.BigNumber.from(slippageTolerance * 100))).div(100);
    
                
                const mintParams = {
                    token0: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec", 
                    token1: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", 
                    fee: 3000,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: amount0Min,
                    amount1Min: amount1Min,
                    recipient: address,
                    deadline: Math.floor(Date.now() / 1000) + 60 * 10 
                };
    
                console.log("Mint parameters:", mintParams);
    
               
                const estimatedGas = await poolContract.estimateGas.mint(mintParams);
                const mintTx = await poolContract.mint(mintParams, { gasLimit: estimatedGas.mul(2) });
                await mintTx.wait();
    
                console.log("Liquidity added to the pool.");
            }
        } catch (error) {
            console.error("Error calculating ticks or adding liquidity: ", error);
        }
    };
    

    useEffect(() => {
        if (walletProvider) {
            balanceof()
            balanceof2();
        }

    }, [tokenOne.address, tokenTwo.address])
    return (
        <div className={Style.PoolAdd}>
            <div className={Style.PoolAdd_box}>
                <div className={Style.PoolAdd_box_header}>
                    <div className={Style.PoolAdd_box_header_left} onClick={() => setCloseModel(false)}>
                        <img src={images.arrowLeft} alt="image" width={30} height={30} />
                    </div>
                    <div className={Style.PoolAdd_box_header_middle}>
                        <p>Add Liquidity</p>
                    </div>
                    <div className={Style.PoolAdd_box_header_right}>
                        <p>{tokenOne.name || ""} {tokenOneBalance || ""} {" "} {" "}
                            {tokenTwo.name || ""} {tokenTwoBalance || ""} {" "} {" "} </p>
                        <img src={images.close} alt="image" width={50} height={50} onClick={() => setOpenModel(true)} />
                    </div>
                </div>

                <div className={Style.PoolAdd_box_price}>
                    <div className={Style.PoolAdd_box_price_left}>
                        <h4>Select Pair</h4>
                        <div className={Style.PoolAdd_box_price_left_token}>
                            <div className={Style.PoolAdd_box_price_left_token_info} onClick={() => setOpenTokenModelOne(true)}>
                                <p>
                                    <img src={images.etherlogo} alt="image" width={20} height={20} />
                                </p>
                                <p>{tokenOne.name || "ETH"}</p>
                                <p>?</p> {/* Optional, can remove or handle based on need */}
                            </div>
                            <div className={Style.PoolAdd_box_price_left_token_info} onClick={() => setOpenTokenModelTwo(true)}>
                                <p>
                                    <img src={images.etherlogo} alt="image" width={20} height={20} />
                                </p>
                                <p>{tokenTwo.name || "Select Token"}</p>
                                <p>?</p>
                            </div>
                        </div>

                        <div className={Style.PoolAdd_box_price_left_fee}>
                            <div className={Style.PoolAdd_box_price_left_fee_left}>
                                <h4>Fee tier</h4>
                                <p>The % you will earn in fees</p>
                            </div>
                            {openFee ? (
                                <button onClick={() => setOpenFee(false)}>Hide</button>
                            ) : (
                                <button onClick={() => setOpenFee(true)}>Show</button>
                            )}
                        </div>

                        {openFee && (
                            <div className={Style.PoolAdd_box_price_left_list_item_info}>
                                {feePairs.map((el, i) => (
                                    <>
                                        <div className={Style.PoolAdd_box_price_left_list_item} key={i + 1} onClick={() => (setActive(i + 1), setFees(el.feeSystem))}>
                                            <p>{el.fee}</p>
                                            <p>
                                                {active === i + 1 ? (
                                                    <img src={images.tick} alt="image" width={20} height={20} />
                                                ) : (" ")}
                                            </p>
                                            <small>{el.info}</small>
                                            <p className={Style.PoolAdd_box_price_left_list_item_para}>{el.number}</p>
                                        </div>
                                    </>
                                ))}
                            </div>
                        )}

                        <div className={Style.PoolAdd_box_deposit}>
                            <h4>Deposit Amount</h4>

                            <div className={Style.PoolAdd_box_deposit_box}>
                                <input type="number" placeholder={tokenOneBalance} onChange={(e) => setTokenAmountOne(e.target.value)} value={tokenAmountOne} />
                                <div className={Style.PoolAdd_box_deposit_box_input}>
                                    <p>
                                        <small>{tokenOne.name || "ETH"}</small>
                                    </p>
                                    {/* <p className={Style.PoolAdd_box_deposit_box_input_item}>
                                        Balance : {tokenOneBalance}
                                    </p> */}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "15rem" }}>
                                <p>Balance: </p>
                                <p>{tokenOneBalance}</p>
                            </div>

                            <div className={Style.PoolAdd_box_deposit_box}>
                                <input type="number" placeholder={tokenTwoBalance} value={tokenAmountTwo} onChange={(e) => setTokenAmountTwo(e.target.value)} />
                                <div className={Style.PoolAdd_box_deposit_box_input}>
                                    <p>
                                        <small>{tokenTwo.name || "Select Token"}</small>
                                    </p>
                                    {/* <p className={Style.PoolAdd_box_deposit_box_input_item}>
                                        Balance : {tokenTwoBalance}
                                    </p> */}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "15rem" }}>
                                <p>Balance: </p>
                                <p>{tokenTwoBalance}</p>
                            </div>
                        </div>
                    </div>



                    <div className={Style.PoolAdd_box_price_right}>
                        <h4>Set Price Range</h4>
                        <div className={Style.PoolAdd_box_price_right_box}>
                            <p className={Style.PoolAdd_box_price_right_box_para}>
                                Current Price : 41.1494 {tokenOne.name || "ETH"} per {tokenTwo.name || "Select Token"}
                            </p>

                            <img src={images.wallet} alt="wallet" height={80} width={80} />
                            <h3>Your Position will appear here.</h3>
                        </div>

                        <div className={Style.PoolAdd_box_price_right_range}>
                            <div className={Style.PoolAdd_box_price_right_range_box}>
                                <p>Min Price</p>
                                <p className={Style.PoolAdd_box_price_right_range_box} onClick={(e) => minPriceRange(e.target.innerText)}>
                                    <small>-</small> {minPrice} <small>+</small>
                                </p>
                                <p>{tokenOne.name || "ETH"} per {tokenTwo.name || "Select Token"}</p>
                            </div>

                            <div className={Style.PoolAdd_box_price_right_range_box}>
                                <p>Max Price</p>
                                <p className={Style.PoolAdd_box_price_right_range_box} onClick={(e) => maxPriceRange(e.target.innerText)}>
                                    <small>-</small> {maxPrice} <small>+</small>
                                </p>
                                <p>{tokenOne.name || "ETH"} per {tokenTwo.name || "Select Token"}</p>
                            </div>
                        </div>

                        <div className={Style.PoolAdd_box_price_right_amount}>
                            <button>Add Liquidity</button>
                        </div>
                    </div>
                </div>
            </div>

            {openModel && (
                <div className={Style.token}>
                    <Token setOpenSetting={setOpenModel} setSlippage={setSlippage} slippage={slippage} setDeadline={setDeadline} deadline={deadline} />
                </div>
            )}

            {openTokenModelOne && (

                <div className={Style.token}>
                    <SearchToken tokenData={tokenData} openToken={setOpenTokenModelOne} tokens={setTokenOne} />
                </div>
            )}

            {openTokenModelTwo && (

                <div className={Style.token}>
                    <SearchToken tokenData={tokenData} openToken={setOpenTokenModelTwo} tokens={setTokenTwo} />
                </div>
            )}
        </div>
    );
}

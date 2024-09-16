import React, { useState } from 'react';
import images from "../../assets";
import Style from "./PoolConnect.module.css";
import UniswapFactoryAbi from "../../constant/abis/UniswapFactory.json";
import PairAbi from "../../constant/abis/PairAbi.json";
import UniSwapPoolAbi from "../../constant/abis/UniswapV3Pool.json";
import ERC20Abi from "../../constant/abis/token.json";
import { factoryAddress,poolAddress } from "../../constant/Chain";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from "ethers";
import {nearestUsableTick} from "@uniswap/v3-sdk"

export default function PoolConnect() {
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [currentPrice, setCurrentPrice] = useState(null);
  const [tickLower, setTickLower] = useState(null);
  const [tickUpper, setTickUpper] = useState(null);

  const CheckTickMath = async () => {
    try {
      if (walletProvider) {
        const provider = new Web3Provider(walletProvider);
        const signer = provider.getSigner();
        const getFactoryAddress = factoryAddress.get(chainId);
  
        const factoryContract = new ethers.Contract(getFactoryAddress, UniswapFactoryAbi, signer);
  
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
  
          const price = 100; 
          const sqrtPrice = Math.sqrt(price);
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
  
        const tickmin = nearestUsableTick(tick, tickSpacing) - tickSpacing * 2;
        console.log(tickmin, "tickmin");
  
        const tickmax = nearestUsableTick(tick, tickSpacing) + tickSpacing * 2;
        console.log(tickmax, "tickmax");
  
        setTickLower(tickmin);
        setTickUpper(tickmax);
  
        const getPoolAddresss = poolAddress.get(chainId);
        const poolContract = new ethers.Contract(getPoolAddresss, UniSwapPoolAbi, signer);
  
        const token0Contract = new ethers.Contract("0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec", ERC20Abi, signer);
        const token1Contract = new ethers.Contract("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", ERC20Abi, signer);
  
        const amountone = ethers.utils.parseUnits("200", 18);
        const amounttwo = ethers.utils.parseUnits("0.03", 18);
  
        const approval0Tx = await token0Contract.approve(getPoolAddresss, amountone);
        await approval0Tx.wait();
        const approval1Tx = await token1Contract.approve(getPoolAddresss, amounttwo);
        await approval1Tx.wait();
  
        console.log("Token approvals completed");
  
        const minParams = {
          token0: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
          token1: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          fee: 3000,
          tickLower: tickmin,
          tickUpper: tickmax,
          amount0Desired: amountone,
          amount1Desired: amounttwo,
          amount0Min: 0,
          amount1Min: 0,
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 60 * 10
        };
  
        console.log("Mint parameters:", minParams);
  
        const estimatedGas = await poolContract.estimateGas.mint(minParams);
        const mintTx = await poolContract.mint(minParams, { gasLimit: estimatedGas.mul(2) });
        await mintTx.wait();
  
        console.log("Liquidity added to the pool.");
      }
    } catch (error) {
      console.error("Error calculating ticks or adding liquidity: ", error);
    }
  };
  

  return (
    <div className={Style.PoolConnect}>
      <div className={Style.PoolConnect_box}>
        <div className={Style.PoolConnect_box_header}>
          <h2>Pool</h2>
          <p onClick={() => CheckTickMath()}>+ New Position</p>
        </div>

        <div className={Style.PoolConnect_box_Middle}>
          <img src={images.wallet} alt="wallet" height={80} width={80} />
          <p>Your Active V3 Liquidity positions will appear here .</p>
          <button>Connect Wallet</button>
        </div>

        <div className={Style.PoolConnect_box_info}>
          <div className={Style.PoolConnect_box_info_left}>
            <h5>Learn about providing Liquidity</h5>
            <p>Check out our v3 LP walkthrough and migrate guide</p>
          </div>

          <div className={Style.PoolConnect_box_info_right}>
            <h5>Top Pools</h5>
            <p>Explore Uniswap Analytics</p>
          </div>
        </div>

        <div>
          <p>Current Price: {currentPrice}</p>
          <p>Tick Lower: {tickLower}</p>
          <p>Tick Upper: {tickUpper}</p>
        </div>
      </div>
    </div>
  );
}

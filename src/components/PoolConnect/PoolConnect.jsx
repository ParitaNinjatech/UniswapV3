import React, { useEffect, useState } from 'react';
import images from "../../assets";
import Style from "./PoolConnect.module.css";
import { factoryAddress, poolAddress } from "../../constant/Chain";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Web3Provider } from '@ethersproject/providers';
import { tokenObj, uniswapLiquidity } from "../../constant/ContractObject";
import { ethers } from "ethers";

export default function PoolConnect({ setCloseModel }) {
  const { walletProvider, connect } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [positions, setPositions] = useState([]);

  const fetchPositions = async () => {
    try {
      if (walletProvider) {
        const provider = new Web3Provider(walletProvider);
        const signer = provider.getSigner();
        const getPoolAddresss = poolAddress.get(chainId);
        const uniSwapLiquidity = await uniswapLiquidity(getPoolAddresss, signer);
        const balance = await uniSwapLiquidity.balanceOf(address);
        const fetchedPositions = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await uniSwapLiquidity.tokenOfOwnerByIndex(address, i);
          const position = await uniSwapLiquidity.positions(tokenId);
          const tokenobj0 = await tokenObj(position.token0, signer);
          const token0Name = await tokenobj0.name();
          const tokenobj1 = await tokenObj(position.token1, signer);
          const token1Name = await tokenobj1.name();

          fetchedPositions.push({
            token0Name,
            token1Name,
            tokenId: tokenId.toString(),
            token0: position.token0,
            token1: position.token1,
            fee: position.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            liquidity: position.liquidity.toString(),
            tokensOwed0: position.tokensOwed0.toString(),
            tokensOwed1: position.tokensOwed1.toString(),
          });
        }
        setPositions(fetchedPositions);
      } else {
        alert("Please connect a wallet provider");
      }
    } catch (error) {
      console.error("Error fetching positions: ", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchPositions();
    }
  }, [isConnected, address]);

  return (
    <div className={Style.PoolConnect}>
      <div className={Style.PoolConnect_box}>
        <div className={Style.PoolConnect_box_header}>
          <h2>Pool</h2>
          <p onClick={() => setCloseModel(true)}>+ New Position</p>
        </div>
        {isConnected ? (
          <div className={Style.PoolConnect_box_liqyidity}>
            <div className={Style.PoolConnect_box_liqyidity_header}>
              <p>Your Position {positions.length}</p>
            </div>
            {positions.map((el, i) => (
              <div className={Style.PoolConnect_box_liqyidity_box} key={i}>
                <div className={Style.PoolConnect_box_liqyidity_list}>
                  <p>
                    <small className={Style.mark}>{el.token0Name}</small>{" "}
                    <small className={Style.mark}>{el.token1Name}</small>{" "}
                    <span className={(Style.paragraph, Style.hide)}>
                      {el.token0Name}/{el.token1Name}
                    </span>{" "}
                    <span className={Style.paragraph}>{el.fee}</span>{" "}
                  </p>
                  <p className={Style.hightlight}>In Range</p>
                </div>
                <div className={Style.PoolConnect_box_liqyidity_list_info}>
                  <p>
                    <small>Min: 0.990 </small>
                    <span>
                      {el.token0Name} per {el.token1Name}
                    </span>{" "}
                    <span>----------</span> <small>Max: 1.0000</small>{" "}
                    <span className={Style.hide}>
                      {el.token0Name} per {el.token1Name}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={Style.PoolConnect_box_Middle}>
            <img src={images.wallet} alt="wallet" height={80} width={80} />
            <p>Your active V3 liquidity positions will appear here.</p>
            <button onClick={connect}>Connect Wallet</button>
          </div>
        )}
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
      </div>
    </div>
  );
}

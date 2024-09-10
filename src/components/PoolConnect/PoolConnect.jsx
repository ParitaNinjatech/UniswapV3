import React from 'react'
import images from "../../assets"
import Style from "./PoolConnect.module.css"

export default function PoolConnect() {
  return (
    <div className={Style.PoolConnect}>
      <div className={Style.PoolConnect_box}>
        <div className={Style.PoolConnect_box_header}>
          <h2>Pool</h2>
          <p>+ New Position</p>
        </div>

        <div className={Style.PoolConnect_box_Middle}>
          <img src={images.wallet} alt="wallet" height={80} width={80} />
          <p>Your Active V3 Liquidity positions will appear here .</p>
          <button>Connect Wallet</button>
        </div>


        <div className={Style.PoolConnect_box_info}>
          <div className={Style.PoolConnect_box_info_left}>
            <h5>Learn about providing Liquidity</h5>
            <p>Check out our v3 LP walkthrough and migrate quide</p>
          </div>

          <div className={Style.PoolConnect_box_info_right}>
            <h5>Top Pools</h5>
            <p>Explore Uniswap Anlytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}


import React, { useEffect, useState, useContext } from 'react';


import Style from "./Token.module.css";
import images from "../../assets";
import { Toggle } from "../index";

function Token({ setOpenSetting, setSlippage, slippage, setDeadline, deadline }) {
  return (
    <div className={Style.Token}>
      <div className={Style.Token_box}>
        <div className={Style.Token_box_heading}>
          <h4>Setting</h4>
          <img src={images.close} alt='close' width={50} height={50} onClick={() => setOpenSetting(false)} />
        </div>
        <p className={Style.Token_box_para}>Slippage tolerance{" "}
          <img src={images.lock} alt='img' width={20} height={20} />
        </p>

        <div className={Style.Token_box_input}>
          <button>Auto</button>
          <input type='number' placeholder={slippage} onChange={(e) => setSlippage(e.target.value)} value={slippage} />
        </div>

        <p className={Style.Token_box_para}>
          Deadline Time{" "}
          <img src={images.lock} alt='img' width={20} height={20} />
        </p>

        <div className={Style.Token_box_input}>
          <input type='number' placeholder={deadline} onChange={(e)=>setDeadline(e.target.value)} value={deadline} />
          <button>Minutes</button>
        </div>

        <h2>Interface Setting</h2>
        <div className={Style.Token_box_toggle}>
          <p className={Style.Token_box_para}>
            Transaction Deadline
          </p>
          <Toggle label="No" />
        </div>
      </div>
    </div>
  )
}

export default Token

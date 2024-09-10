import React,{useEffect,useState} from 'react';
import Style from "./AllTokens.module.css";
import images from "../../assets"

export default function AllTokens({allTokenList}) {
  return (
    <div className={Style.AllTokens}>
      <div className={Style.AllTokens_box}>
        <div className={Style.AllTokens_box_header}>
          <p className={Style.hide}>#</p>
          <p>Token name</p>
          <p>Price</p>
          <p className={Style.hide}>Change</p>
          <p className={Style.hide}>TVL{" "}
            <small>
              <img src={images.question}  alt='img' width={15} height={15}/>
            </small>{" "}
          </p>

          <p className={Style.hide}>
            <small>
              <img src={images.arrowPrice} alt="img" width={15} height={15} />
            </small>{" "}
            Volume{" "}
            <small>
              <img src={images.question} alt="img" width={15} height={15} />
            </small>{" "}
          </p>
        </div>

        {allTokenList.map((el,i) =>(
          <div className={Style.AllTokens_box_list}> 
           <p className={Style.hide}>{el.number}</p>
           <p className={Style.AllTokens_box_list_para}>
            <small>
              <img src={el.image} alt="logo" width={25} height={25} />
            </small>
            <small>{el.name}</small>
            <small>{el.symbol}</small>
           </p>
           <p>{el.price}</p>
           <p className={Style.hide}>{el.change}</p>
           <p className={Style.hide}>{el.tvl}</p>
           <p className={Style.hide}>{el.volume}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

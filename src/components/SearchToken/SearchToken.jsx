import React, { useState } from 'react';
import './SearchToken.css'; // Import CSS
import images from '../../assets';

export default function SearchToken({ openToken, tokens, tokenData }) {
  const [active, setActive] = useState(null); // Use null to indicate no token is selected

  const coin = [
    {
      img: images.ether,
      name: "WMATIC",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      abbr: "WMATIC",
      decimals: 18,
      chainId: 137,
      logoURI: "https://i.imgur.com/uIExoAr.png"
    },
    {
      img: images.ether,
      name: "DAI",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      abbr: "DAI",
      decimals: 18,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
    },
    {
      img: images.ether,
      name: "USDT",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      abbr: "USDT",
      decimals: 6,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
    },
    {
      img: images.ether,
      name: "BNB"
    },
    {
      img: images.ether,
      name: "MATIC",
      address: "0xfC11F0080C6fA8b3F7caE4C5fb9f83BBbcb96197",
      decimals: 18,
      chainId: 137,
    },
    {
      img: images.ether,
      name: "HEY",
      address: "0x26c88bC1a25d71AbFAdc8C97401929F89cE1DD10",
      decimals: 18,
      chainId: 137,
    }
  ];

  return (
    <div className="SearchToken">
      <div className="SearchToken_box">
        <div className="SearchToken_box_heading">
          <h4>Select a token</h4>
          <img 
            src={images.close} 
            alt='Close' 
            width={50} 
            height={50} 
            onClick={() => openToken(false)} 
          />
        </div>

        <div className="SearchToken_box_search">
          <div className="SearchToken_box_search_img">
            <img 
              src={images.search} 
              alt='Search' 
              width={20} 
              height={20} 
            />
          </div>
          <input type='text' placeholder='Search name and Paste the Address' />
        </div>

        <div className="SearchToken_box_tokens">
          {coin.map((el, i) => (
            <span 
              key={i}
              className={active === i ? "active" : ""}
              onClick={() => {
                setActive(i);
                tokens({ name: el.name, image: el.img, address: el.address });
              }}
            >
              <img 
                src={el.img || images.ether} 
                alt={el.name} 
                width={30} 
                height={30} 
              />
              {el.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

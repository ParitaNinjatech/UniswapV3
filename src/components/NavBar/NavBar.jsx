import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./NavBar.css";
import images from "../../assets";
import { TokenList } from "../index";

function NavBar() {
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  const [accounts, setAccounts] = useState(false);
  const menuItem = [
    { name: "Swap", link: "/" },
    { name: "Tokens", link: "/" },
    { name: "Pools", link: "/" }
  ];

  return (
    <div className="NavBar">
      <div className="NavBar_box">
        <div className="NavBar_box_left">
          <div className="NavBar_box_left_img">
            <img src={images.uniswap} alt='logo' width={50} height={50} />
            <div className="NavBar_box_left_menu">
              {menuItem.map((el, i) => (
                <Link key={i} to={el.link}>
                  <p className="NavBar_box_left_menu_item">
                    {el.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="NavBar_box_middle">
          <div className="NavBar_box_middle_search">
            <div className="NavBar_box_middle_search_img">
              <img src={images.search} alt='search' width={20} height={20} />
            </div>
            <input type='text' placeholder='Search Tokens' />
          </div>
        </div>

        <div className="NavBar_box_right">
          <div className="NavBar_box_right_box">
            <div className="NavBar_box_right_box_img">
              <img src={images.ether} alt='Network' height={30} width={30} />
            </div>
            <p>Network</p>
          </div>

          
          <w3m-button />
        </div>
      </div>
      {!openTokenBox && (
        <TokenList tokenDate="Hey" setOpenTokenBox={setOpenTokenBox} />
      )}
    </div>
  );
}

export default NavBar;

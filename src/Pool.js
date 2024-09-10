import React,{useEffect,useState} from 'react';
import Style from "./Pool.module.css";
import images from "./assets";
import { PooldAdd , PoolConnect } from './components';

export default function Pool() {
  return (
    <div className={Style.Pool}>
      {/* <PooldAdd/> */}
      <PoolConnect/>
    </div>

  )}
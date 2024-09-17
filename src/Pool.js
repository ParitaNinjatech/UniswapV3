import React,{useEffect,useState} from 'react';
import Style from "./Pool.module.css";
import images from "./assets";
import { PooldAdd , PoolConnect } from './components';

export default function Pool({tokenData}) {
  const [closeModel,setCloseModel] = useState(false);
  return (
    <div className={Style.Pool}>
      {closeModel ? (<PooldAdd setCloseModel={setCloseModel} tokenData={tokenData} />) : (

      <PoolConnect setCloseModel={setCloseModel}/>
      )}
    </div>

  )}
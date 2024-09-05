import { ethers, Signer } from "ethers";
import TokenAbi from "./abis/token.json";
import UniswapV3 from "./abis/UniswapV3.json";



export const tokenObj = async(tokenAddress,Signer) =>{
   return new ethers.Contract(tokenAddress,TokenAbi,Signer);
}

export const uniSwapObj = async(routeAddress,Signer) =>{
    return  new ethers.Contract(routeAddress,UniswapV3,Signer)
}